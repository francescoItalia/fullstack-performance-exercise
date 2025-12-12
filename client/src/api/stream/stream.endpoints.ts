/**
 * Stream API endpoints.
 * Uses async generators to yield characters/chunks as they arrive.
 */

import type { ChatStreamEvent } from "shared";

const API_BASE_URL = "/api";

// ============================================================
// RAW HTTP CHUNKED STREAMING
// ============================================================

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

// ============================================================
// NDJSON STREAMING (Pure Newline Delimited JSON)
// ============================================================

/**
 * Streams pure NDJSON events from the server.
 * Each line is a complete JSON object - no prefixes, no done markers.
 *
 * Format:
 *   {"type":"message_start","message_id":"msg_123"}
 *   {"type":"delta","delta":{"content":"Hello"}}
 *   {"type":"message_complete","finish_reason":"stop"}
 */
export async function* streamNDJSON(): AsyncGenerator<
  ChatStreamEvent,
  void,
  unknown
> {
  const response = await fetch(`${API_BASE_URL}/stream/ndjson`);

  if (!response.ok || !response.body) {
    throw new Error(`Stream failed: ${response.status} ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      // Append new chunk to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines (each line is a JSON object)
      const lines = buffer.split("\n");
      // Keep last incomplete line in buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();

        // Skip empty lines
        if (!trimmed) continue;

        // Parse JSON line directly
        try {
          const event = JSON.parse(trimmed) as ChatStreamEvent;
          yield event;
        } catch {
          console.warn("Failed to parse NDJSON line:", trimmed);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// ============================================================
// SSE STREAMING (Server-Sent Events)
// ============================================================

/**
 * SSE event callback type for typed event handling
 */
export type SSEEventCallback = (event: ChatStreamEvent) => void;

/**
 * Creates an SSE connection and returns control functions.
 * This is the same protocol ChatGPT uses for streaming responses.
 *
 * SSE uses the browser's native EventSource API which provides:
 * - Automatic reconnection on connection loss
 * - Built-in event type handling via addEventListener
 * - Standard text/event-stream protocol
 *
 * Format from server:
 *   event: message_start
 *   data: {"message_id":"msg_abc","model":"mock-gpt-1"}
 *
 *   event: delta
 *   data: {"delta":{"content":"Hello"},"index":0}
 *
 *   event: message_complete
 *   data: {"finish_reason":"stop","usage":{"total_tokens":42}}
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventSource
 */
export function createSSEStream(
  onEvent: SSEEventCallback,
  onError: (error: Error) => void,
  onComplete: () => void
): { close: () => void } {
  const eventSource = new EventSource(`${API_BASE_URL}/stream/sse`);

  // Handle message_start event
  eventSource.addEventListener("message_start", (e) => {
    try {
      const payload = JSON.parse(e.data);
      onEvent({ type: "message_start", ...payload });
    } catch {
      console.warn("Failed to parse message_start:", e.data);
    }
  });

  // Handle delta events (content chunks)
  eventSource.addEventListener("delta", (e) => {
    try {
      const payload = JSON.parse(e.data);
      onEvent({ type: "delta", ...payload });
    } catch {
      console.warn("Failed to parse delta:", e.data);
    }
  });

  // Handle message_complete event
  eventSource.addEventListener("message_complete", (e) => {
    try {
      const payload = JSON.parse(e.data);
      onEvent({ type: "message_complete", ...payload });
    } catch {
      console.warn("Failed to parse message_complete:", e.data);
    }
  });

  // Handle generic message (for [DONE] marker)
  eventSource.onmessage = (e) => {
    if (e.data === "[DONE]") {
      eventSource.close();
      onComplete();
    }
  };

  // Handle errors
  eventSource.onerror = () => {
    eventSource.close();
    onError(new Error("SSE connection failed"));
  };

  return {
    close: () => {
      eventSource.close();
    },
  };
}
