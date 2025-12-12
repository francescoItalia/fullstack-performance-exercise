import { faker } from "@faker-js/faker";
import { delay, delayRandom } from "./stream.utils.js";
import type { ChatStreamEvent } from "shared";

// ============================================================
// RAW HTTP CHUNKED STREAMING
// ============================================================

/**
 * Generate a long text string (simulating heavy content)
 */
export function streamGeneratedText(): string {
  return faker.lorem.paragraphs(16, "\n\n");
}

// ============================================================
// NDJSON STREAMING (Newline Delimited JSON)
// ============================================================

/**
 * Simulates a chat completion with structured NDJSON events.
 * NDJSON is just a format choice for chunked HTTP responses.
 *
 * Event sequence:
 * 1. message_start - Initial metadata (message_id, model, created_at)
 * 2. delta (multiple) - Content chunks with index
 * 3. message_complete - Final stats (total tokens, finish_reason)
 */
export async function* streamChatCompletion(): AsyncGenerator<ChatStreamEvent> {
  const messageId = `msg_${faker.string.alphanumeric(12)}`;
  const model = "mock-gpt-1";
  const createdAt = Math.floor(Date.now() / 1000);

  // 1. Send message start event
  yield {
    type: "message_start",
    message_id: messageId,
    model,
    created_at: createdAt,
  };

  // Small delay to simulate "thinking"
  await delayRandom(2000, 3000);

  // 2. Generate and stream tokens
  const text = faker.lorem.paragraphs(3, "\n\n");
  // Split keeping whitespace as separate tokens for realistic streaming
  const tokens = text.split(/(\s+)/);
  let tokenIndex = 0;

  for (const token of tokens) {
    if (!token) continue;

    yield {
      type: "delta",
      delta: { content: token },
      index: tokenIndex,
    };

    tokenIndex++;
    await delayRandom(80, 100); // Variable delay for realism
  }

  // 3. Send completion event
  yield {
    type: "message_complete",
    finish_reason: "stop",
    usage: {
      completion_tokens: tokenIndex,
      total_tokens: tokenIndex,
    },
  };
}

// ============================================================
// SSE STREAMING (Server-Sent Events)
// ============================================================

/**
 * Simulates a chat completion using Server-Sent Events (SSE).
 * This is the same protocol ChatGPT uses for streaming responses.
 *
 * SSE is a browser-native protocol that enables server-to-client streaming
 * over a single HTTP connection. The browser handles reconnection automatically.
 *
 * We reuse the same ChatStreamEvent types as NDJSON - only the transport differs:
 * - NDJSON: `{"type":"delta",...}\n`
 * - SSE: `event: delta\ndata: {...}\n\n`
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
 */
export async function* streamChatCompletionSSE(): AsyncGenerator<ChatStreamEvent> {
  // Reuse the same logic as NDJSON streaming
  // Take everything the other generator yields, and yield it again from this one.
  yield* streamChatCompletion();
}
