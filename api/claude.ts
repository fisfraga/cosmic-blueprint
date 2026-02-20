import type { VercelRequest, VercelResponse } from '@vercel/node';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
