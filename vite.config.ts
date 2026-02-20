/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Local dev middleware that proxies /api/claude to OpenRouter
// (replaces Vercel serverless function during local development)
function claudeApiProxy(): Plugin {
  let apiKey: string | undefined

  return {
    name: 'claude-api-proxy',
    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '')
      apiKey = env.OPENROUTER_API_KEY

      server.middlewares.use('/api/claude', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!apiKey) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'OPENROUTER_API_KEY not configured in .env' }))
          return
        }

        // Parse request body
        const body = await new Promise<string>((resolve) => {
          let data = ''
          req.on('data', (chunk: Buffer) => { data += chunk.toString() })
          req.on('end', () => resolve(data))
        })

        let parsed: Record<string, unknown>
        try {
          parsed = JSON.parse(body)
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Invalid JSON body' }))
          return
        }

        const { systemPrompt, messages, stream: shouldStream, model } = parsed
        const modelId = (model as string) || 'anthropic/claude-sonnet-4-6'

        if (!systemPrompt || !messages) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Missing systemPrompt or messages' }))
          return
        }

        try {
          const msgArray = (messages as Array<{ role: string; content: string }>).map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          }))

          // OpenRouter uses OpenAI-compatible format: system prompt as first message
          const openRouterMessages = [
            { role: 'system', content: systemPrompt as string },
            ...msgArray,
          ]

          const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'Cosmic Blueprint',
          }

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
            })

            if (!openRouterRes.ok) {
              const errJson = await openRouterRes.json().catch(() => ({})) as Record<string, unknown>
              throw new Error(
                ((errJson.error as { message?: string })?.message) ||
                `OpenRouter error: ${openRouterRes.status}`
              )
            }

            res.setHeader('Content-Type', 'text/event-stream')
            res.setHeader('Cache-Control', 'no-cache, no-transform')
            res.setHeader('Connection', 'keep-alive')
            res.setHeader('X-Accel-Buffering', 'no')

            const reader = openRouterRes.body?.getReader()
            if (!reader) throw new Error('No response body from OpenRouter')

            const decoder = new TextDecoder()
            let sseBuffer = ''

            try {
              // eslint-disable-next-line no-constant-condition
              while (true) {
                const { done, value } = await reader.read()
                if (done) break
                sseBuffer += decoder.decode(value, { stream: true })
                const lines = sseBuffer.split('\n')
                sseBuffer = lines.pop() || ''

                for (const line of lines) {
                  if (!line.startsWith('data: ')) continue
                  const data = line.slice(6)
                  if (data === '[DONE]') {
                    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
                    res.end()
                    return
                  }
                  try {
                    const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> }
                    const content = parsed.choices?.[0]?.delta?.content
                    if (content) {
                      res.write(`data: ${JSON.stringify({ type: 'text', content })}\n\n`)
                    }
                  } catch {
                    // ignore malformed JSON lines
                  }
                }
              }
            } finally {
              reader.releaseLock()
            }

            res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
            res.end()
            return
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
          })

          if (!openRouterRes.ok) {
            const errJson = await openRouterRes.json().catch(() => ({})) as Record<string, unknown>
            throw new Error(
              ((errJson.error as { message?: string })?.message) ||
              `OpenRouter error: ${openRouterRes.status}`
            )
          }

          const json = await openRouterRes.json() as { choices?: Array<{ message?: { content?: string } }> }
          const content = json.choices?.[0]?.message?.content || ''
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ content }))
        } catch (error) {
          console.error('OpenRouter API error:', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            error: error instanceof Error ? error.message : 'Failed to connect to OpenRouter',
          }))
        }
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), claudeApiProxy()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-d3': ['d3', 'd3-force', 'd3-selection', 'd3-zoom', 'd3-drag'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
  },
})
