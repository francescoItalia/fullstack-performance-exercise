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
