import type { Request, Response } from "express";
import {
  streamGeneratedText,
  streamChatCompletion,
  streamChatCompletionSSE,
} from "./stream.service.js";
import { delay } from "./stream.utils.js";
import { once } from "events";

/**
 * Streams text to the client chunk-by-chunk (raw HTTP streaming).
 * Sends one character at a time for full visibility of streaming behavior.
 */
export async function streamTextRaw(
  _req: Request,
  res: Response
): Promise<void> {
  const text = streamGeneratedText();

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Cache-Control", "no-cache");

  // Stream characters one by one
  for (const char of text) {
    res.write(char);
    await delay(5);
  }

  res.end();
}

/**
 * Streams text as pure NDJSON (Newline Delimited JSON)
 *
 * Format:
 *   {"type":"message_start","message_id":"msg_abc123","model":"mock-gpt-1","created_at":1234567890}
 *   {"type":"delta","delta":{"content":"Hello"},"index":0}
 *   {"type":"delta","delta":{"content":" world"},"index":1}
 *   {"type":"message_complete","finish_reason":"stop","usage":{"total_tokens":2}}
 *
 * Each JSON object on its own line. No prefixes, no done markers.
 */
export async function streamTextNDJSON(
  _req: Request,
  res: Response
): Promise<void> {
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Cache-Control", "no-cache");

  res.flushHeaders?.();

  // Setup AbortController for early cancellation
  const abortController = new AbortController();

  // Handle client disconnect
  res.on("close", () => {
    abortController.abort();
  });

  try {
    for await (const streamEvent of streamChatCompletion(
      abortController.signal
    )) {
      // Check if client disconnected
      if (abortController.signal.aborted) {
        break;
      }

      // Handle backpressure: if write buffer is full, wait for drain
      if (!res.write(`${JSON.stringify(streamEvent)}\n`)) {
        await once(res, "drain");
      }
    }
  } finally {
    // Ensure response is properly closed
    if (!res.writableEnded) {
      res.end();
    }
  }
}

/**
 * Streams chat completion via Server-Sent Events (SSE).
 * This is the same protocol ChatGPT uses for streaming responses.
 *
 * SSE Format (per event):
 *   event: message_start
 *   data: {"message_id":"msg_abc123","model":"mock-gpt-1","created_at":1234567890}
 *
 *   event: delta
 *   data: {"content":"Hello","index":0}
 *
 *   event: message_complete
 *   data: {"finish_reason":"stop","usage":{"total_tokens":42}}
 *
 *   data: [DONE]
 *
 * The `event:` line specifies the event type (used by EventSource.addEventListener).
 * The `data:` line contains the JSON payload.
 * Events are separated by double newlines.
 *
 */
export async function streamTextSSE(
  _req: Request,
  res: Response
): Promise<void> {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders?.();

  // Setup AbortController for early cancellation
  const abortController = new AbortController();

  // Handle client disconnect
  res.on("close", () => {
    abortController.abort();
  });

  try {
    for await (const streamEvent of streamChatCompletionSSE(
      abortController.signal
    )) {
      // Check if client disconnected
      if (abortController.signal.aborted) {
        break;
      }

      // SSE format: event type on its own line, then data
      // Handle backpressure for event line
      if (!res.write(`event: ${streamEvent.type}\n`)) {
        await once(res, "drain");
      }

      const { type, ...payload } = streamEvent;
      // Handle backpressure for data line
      if (!res.write(`data: ${JSON.stringify(payload)}\n\n`)) {
        await once(res, "drain");
      }
    }

    // Only send DONE if not aborted
    if (!abortController.signal.aborted && !res.write("data: [DONE]\n\n")) {
      await once(res, "drain");
    }
  } finally {
    // Ensure response is properly closed
    if (!res.writableEnded) {
      res.end();
    }
  }
}
