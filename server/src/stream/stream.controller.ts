import type { Request, Response } from "express";
import {
  streamGeneratedText,
  streamChatCompletion,
  streamJobProgress,
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

  for await (const event of streamChatCompletion()) {
    res.write(`${JSON.stringify(event)}\n`);
  }

  res.end();
}

/**
 * Streams text via Server-Sent Events (SSE)
 * Each character is sent as a separate SSE message.
 */
export async function streamTextSSE(
  _req: Request,
  res: Response
): Promise<void> {
  const jobProgress = streamJobProgress();

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Recommended for proxies (Heroku, Vercel…)
  res.flushHeaders?.();

  for await (const evt of jobProgress) {
    res.write(`event: progress\n`);
    res.write(`data: ${JSON.stringify(evt)}\n\n`);
  }

  res.write("data: [DONE]\n\n");
  res.end();
}
