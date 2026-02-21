import express from 'express';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

// --- Rate Limiting (in-memory, resets on restart) ---
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '20', 10);
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUEST_SIZE_BYTES = 50 * 1024; // 50KB

const rateLimitMap = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
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

// --- Model whitelist ---
const ALLOWED_MODELS = new Set([
  'anthropic/claude-sonnet-4-6',
  'anthropic/claude-haiku-4-5-20251001',
  'anthropic/claude-sonnet-4-5-20250514',
]);

// --- Structured JSON logging ---
function logRequest(req, res, startTime) {
  const duration = Date.now() - startTime;
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl || req.url,
    status: res.statusCode,
    duration_ms: duration,
    ip: getClientIp(req),
  };
  process.stdout.write(JSON.stringify(logEntry) + '\n');
}

// --- Request logging middleware ---
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => logRequest(req, res, startTime));
  next();
});

// --- Health endpoint (O-06) ---
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Claude API proxy (O-01) ---
app.post('/api/claude', express.json({ limit: '50kb' }), async (req, res) => {
  // Rate limiting
  const clientIp = getClientIp(req);
  const { allowed, retryAfter } = checkRateLimit(clientIp);
  if (!allowed) {
    res.set('Retry-After', String(retryAfter));
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY not configured');
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const { systemPrompt, messages, stream: shouldStream, model } = req.body;
  const modelId = model || 'anthropic/claude-sonnet-4-6';

  if (!ALLOWED_MODELS.has(modelId)) {
    return res.status(400).json({ error: `Model not allowed: ${modelId}` });
  }

  if (!systemPrompt || !messages) {
    return res.status(400).json({ error: 'Missing systemPrompt or messages' });
  }

  try {
    const msgArray = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const openRouterMessages = [
      { role: 'system', content: systemPrompt },
      ...msgArray,
    ];

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
      'X-Title': 'Cosmic Blueprint',
    };

    if (shouldStream) {
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
        const errJson = await openRouterRes.json().catch(() => ({}));
        const errMsg = errJson.error?.message || `OpenRouter error: ${openRouterRes.status}`;
        res.set('Content-Type', 'text/event-stream');
        res.write(`data: ${JSON.stringify({ type: 'error', error: errMsg })}\n\n`);
        return res.end();
      }

      res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      });

      const reader = openRouterRes.body?.getReader();
      if (!reader) {
        res.write(`data: ${JSON.stringify({ type: 'error', error: 'No response body from OpenRouter' })}\n\n`);
        return res.end();
      }

      const decoder = new TextDecoder();
      let sseBuffer = '';

      try {
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
              return res.end();
            }
            try {
              const parsed = JSON.parse(data);
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
      return res.end();
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
      const errJson = await openRouterRes.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `OpenRouter error: ${openRouterRes.status}`);
    }

    const json = await openRouterRes.json();
    const content = json.choices?.[0]?.message?.content || '';
    return res.json({ content });
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to connect to OpenRouter',
    });
  }
});

// --- Static files ---
app.use(express.static(join(__dirname, 'dist')));

// --- SPA fallback ---
app.get(/(.*)/, (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// --- Start server ---
app.listen(PORT, () => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event: 'server_start',
    port: PORT,
    node_env: process.env.NODE_ENV || 'production',
  };
  process.stdout.write(JSON.stringify(logEntry) + '\n');
});
