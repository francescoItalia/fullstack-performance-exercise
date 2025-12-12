import { faker } from "@faker-js/faker";
import { delay, delayRandom } from "./stream.utils.js";
import type { ChatStreamEvent, JobProgressEvent } from "shared";

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
  await delay(2000);

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
// SSE STREAMING (Job Progress)
// ============================================================

/**
 * Simulates a multi-step job with progress updates.
 * Useful for demonstrating Server-Sent Events.
 */
export async function* streamJobProgress(): AsyncGenerator<JobProgressEvent> {
  const steps = [
    "uploading video",
    "extracting frames",
    "generating final report",
  ];

  const progressStep = 20;

  for (const step of steps) {
    for (let progress = 0; progress <= 100; progress += progressStep) {
      yield {
        step,
        progress,
        message: `${step}... ${progress}%`,
      };

      await delayRandom(500, 3000);
    }
  }
}
