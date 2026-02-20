import type { VercelRequest, VercelResponse } from '@vercel/node';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

// --- Rate Limiting (in-memory, resets on cold start) ---
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '20', 10);
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_REQUEST_SIZE_BYTES = 50 * 1024; // 50KB

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true, retryAfter: 0 };
}

// --- CORS ---
const ALLOWED_ORIGINS = [
  process.env.VITE_APP_URL,
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean) as string[];

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some((allowed) => origin === allowed || origin.startsWith(allowed));
}

// --- Handler ---
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string | undefined;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    if (isOriginAllowed(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin!);
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Max-Age', '86400');
    }
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS origin check
  if (origin && !isOriginAllowed(origin)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  if (isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin!);
  }

  // Rate limiting
  const clientIp = getClientIp(req);
  const { allowed, retryAfter } = checkRateLimit(clientIp);
  if (!allowed) {
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // Request size check
  const bodyStr = JSON.stringify(req.body);
  if (bodyStr.length > MAX_REQUEST_SIZE_BYTES) {
    return res.status(413).json({ error: 'Request body too large (max 50KB)' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY not configured');
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  try {
    const { systemPrompt, messages, stream: shouldStream, model } = req.body;
    const modelId = (model as string) || 'anthropic/claude-sonnet-4-6';

    if (!systemPrompt || !messages) {
      return res.status(400).json({ error: 'Missing systemPrompt or messages' });
    }

    const msgArray = (messages as Array<{ role: string; content: string }>).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // OpenRouter uses OpenAI-compatible format: system prompt as first message
    const openRouterMessages = [
      { role: 'system', content: systemPrompt as string },
      ...msgArray,
    ];

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://cosmic-blueprint.vercel.app',
      'X-Title': 'Cosmic Blueprint',
    };

    if (shouldStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      const openRouterRes = await fetch(OPENROUTER_BASE_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: modelId,
          messages: openRouterMessages,
          stream: true,
          max_tokens: 4096,
        }),
      });

      if (!openRouterRes.ok) {
        const errJson = await openRouterRes.json().catch(() => ({})) as Record<string, unknown>;
        const errMsg = ((errJson.error as { message?: string })?.message) || `OpenRouter error: ${openRouterRes.status}`;
        res.write(`data: ${JSON.stringify({ type: 'error', error: errMsg })}\n\n`);
        res.end();
        return;
      }

      const reader = openRouterRes.body?.getReader();
      if (!reader) {
        res.write(`data: ${JSON.stringify({ type: 'error', error: 'No response body from OpenRouter' })}\n\n`);
        res.end();
        return;
      }

      const decoder = new TextDecoder();
      let sseBuffer = '';

      try {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          sseBuffer += decoder.decode(value, { stream: true });
          const lines = sseBuffer.split('\n');
          sseBuffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6);
            if (data === '[DONE]') {
              res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
              res.end();
              return;
            }
            try {
              const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                res.write(`data: ${JSON.stringify({ type: 'text', content })}\n\n`);
              }
            } catch {
              // ignore malformed JSON lines
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
      return;
    }

    // Non-streaming
    const openRouterRes = await fetch(OPENROUTER_BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: modelId,
        messages: openRouterMessages,
        max_tokens: 4096,
      }),
    });

    if (!openRouterRes.ok) {
      const errJson = await openRouterRes.json().catch(() => ({})) as Record<string, unknown>;
      throw new Error(
        ((errJson.error as { message?: string })?.message) ||
        `OpenRouter error: ${openRouterRes.status}`
      );
    }

    const json = await openRouterRes.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = json.choices?.[0]?.message?.content || '';
    return res.status(200).json({ content });

  } catch (error) {
    console.error('OpenRouter API error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to connect to OpenRouter',
    });
  }
}
