import type { Request, Response } from "express";
import {
  streamGeneratedText,
  streamChatCompletion,
  streamChatCompletionSSE,
} from "./stream.service.js";
import { once } from "events";
import { pipeline } from "node:stream/promises";

/**
 * Streams text to the client chunk-by-chunk (raw HTTP streaming).
 * Sends one character at a time.
 */
export async function streamTextRaw(
  _req: Request,
  res: Response
): Promise<void> {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Cache-Control", "no-cache");

  res.flushHeaders?.();

  const ac = new AbortController();
  const { signal } = ac;

  res.on("close", () => ac.abort());

  try {
    await pipeline(streamGeneratedText(signal), res, { signal });
  } catch (err: any) {
    if (signal.aborted) return;

    // If error before streaming started, send 500
    if (!res.headersSent) {
      res.status(500).end("Internal Server Error");
    }
  }
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

  const ac = new AbortController();
  const { signal } = ac;

  res.on("close", () => {
    ac.abort();
  });

  try {
    for await (const streamEvent of streamChatCompletion(signal)) {
      if (signal.aborted) {
        break;
      }
      if (!res.write(`${JSON.stringify(streamEvent)}\n`)) {
        await once(res, "drain");
      }
    }
  } finally {
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

  const ac = new AbortController();
  const { signal } = ac;

  res.on("close", () => {
    ac.abort();
  });

  try {
    for await (const streamEvent of streamChatCompletionSSE(signal)) {
      if (signal.aborted) {
        break;
      }

      // SSE format: event type on its own line, then data
      // Handle backpressure for event line
      if (!res.write(`event: ${streamEvent.type}\n`)) {
        await once(res, "drain");
      }

      const { type, ...payload } = streamEvent;
      if (!res.write(`data: ${JSON.stringify(payload)}\n\n`)) {
        await once(res, "drain");
      }
    }

    if (!signal.aborted && !res.write("data: [DONE]\n\n")) {
      await once(res, "drain");
    }
  } finally {
    if (!res.writableEnded) {
      res.end();
    }
  }
}
