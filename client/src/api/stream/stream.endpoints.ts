/**
 * Stream API endpoints.
 * Uses async generators to yield characters/chunks as they arrive.
 */

const API_BASE_URL = "/api";

/**
 * Streams raw text from the server, yielding one character at a time.
 * Uses fetch + ReadableStream for true streaming.
 */
export async function* streamRawText(): AsyncGenerator<string, void, unknown> {
  const response = await fetch(`${API_BASE_URL}/stream/raw-http-chunked`);

  if (!response.ok || !response.body) {
    throw new Error(`Stream failed: ${response.status} ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      // Decode the chunk and yield each character
      const chunk = decoder.decode(value, { stream: true });
      for (const char of chunk) {
        yield char;
      }
    }
  } finally {
    reader.releaseLock();
  }
}
