import type { Request, Response } from "express";
import {
  streamGeneratedText,
  streamChatCompletion,
  streamChatCompletionSSE,
} from "./stream.service.js";
import { delay } from "./stream.utils.js";

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

  // Recommended for proxies (Heroku, Vercel…)
  res.flushHeaders?.();

  for await (const streamEvent of streamChatCompletion()) {
    res.write(`${JSON.stringify(streamEvent)}\n`);
  }

  res.end();
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
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
 */
export async function streamTextSSE(
  _req: Request,
  res: Response
): Promise<void> {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Recommended for proxies (Heroku, Vercel…)
  res.flushHeaders?.();

  for await (const streamEvent of streamChatCompletionSSE()) {
    // SSE format: event type on its own line, then data
    res.write(`event: ${streamEvent.type}\n`);

    // For SSE, we send just the payload without the "type" field
    // (the type is already in the event: line)
    const { type, ...payload } = streamEvent;
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }

  // Final done marker (ChatGPT convention)
  res.write("data: [DONE]\n\n");
  res.end();
}
