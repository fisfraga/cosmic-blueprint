// Claude API service for Contemplation Chamber
// Uses serverless function at /api/claude to proxy requests (API key stays server-side)

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ContemplationResponse {
  content: string;
  error?: string;
}

export interface StreamOptions {
  maxRetries?: number;
  onRetry?: (attempt: number, error: string) => void;
  model?: string; // Model ID to use (e.g., 'claude-sonnet-4-20250514')
}

const API_URL = '/api/claude';
const DEFAULT_MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

// Calculate exponential backoff delay
function getRetryDelay(attempt: number): number {
  // 1s, 2s, 4s with some jitter
  const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 500;
  return delay + jitter;
}

// Check if error is retryable (network issues, rate limits, server errors)
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    // Retry on network errors, timeouts, rate limits, server errors
    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('fetch') ||
      message.includes('connection') ||
      message.includes('rate limit') ||
      message.includes('429') ||
      message.includes('500') ||
      message.includes('502') ||
      message.includes('503') ||
      message.includes('504')
    );
  }
  return false;
}

// Sleep utility for retry delays
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Non-streaming version (backwards compatible)
export async function sendContemplation(
  systemPrompt: string,
  messages: Message[]
): Promise<ContemplationResponse> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return { content: data.content || '' };
  } catch (error) {
    console.error('Claude API error:', error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Failed to connect to Claude API',
    };
  }
}

// Streaming version with automatic retry on transient failures
export async function sendContemplationStream(
  systemPrompt: string,
  messages: Message[],
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: string, canRetry: boolean) => void,
  options?: StreamOptions
): Promise<void> {
  const maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;
  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= maxRetries) {
    attempt++;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt,
          messages,
          stream: true,
          model: options?.model,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      let done = false;

      while (!done) {
        const result = await reader.read();
        done = result.done;
        if (done) break;
        const value = result.value;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages from buffer
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'text') {
                onChunk(data.content);
              } else if (data.type === 'done') {
                onComplete();
                return;
              } else if (data.type === 'error') {
                // API returned an error - check if retryable
                const apiError = new Error(data.error);
                if (isRetryableError(apiError) && attempt < maxRetries) {
                  throw apiError; // Will be caught and retried
                }
                onError(data.error, false);
                return;
              }
            } catch (parseError) {
              // Ignore malformed JSON lines unless it's our rethrown error
              if (parseError instanceof Error && parseError.message !== 'Unexpected token') {
                throw parseError;
              }
            }
          }
        }
      }

      // Handle any remaining data in buffer
      if (buffer.startsWith('data: ')) {
        try {
          const data = JSON.parse(buffer.slice(6));
          if (data.type === 'text') {
            onChunk(data.content);
          }
        } catch {
          // Ignore
        }
      }

      onComplete();
      return; // Success - exit retry loop

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Claude API attempt ${attempt}/${maxRetries + 1} failed:`, lastError.message);

      // Check if we should retry
      if (attempt <= maxRetries && isRetryableError(lastError)) {
        const delay = getRetryDelay(attempt);
        console.log(`Retrying in ${Math.round(delay)}ms...`);

        // Notify caller about retry
        options?.onRetry?.(attempt, lastError.message);

        await sleep(delay);
        continue; // Retry
      }

      // No more retries or non-retryable error
      break;
    }
  }

  // All retries exhausted or non-retryable error
  const errorMessage = lastError?.message || 'Connection failed';
  const canRetry = isRetryableError(lastError);
  onError(errorMessage, canRetry);
}

// API key is now server-side, so always return true
export function isApiConfigured(): boolean {
  return true;
}
