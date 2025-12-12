import type { Request, Response } from "express";
import {
  streamGeneratedText,
  streamGeneratedToken,
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
 * Streams text as NDJSON lines (OpenAI style)
 * Format:
 *   data: {"token":"Here"}
 *   data: {"token":"is some"}
 *   data: {"token":"text"}
 *   ...
 *   data: [DONE]
 */
export async function streamTextNDJSON(
  _req: Request,
  res: Response
): Promise<void> {
  const text = streamGeneratedToken();

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Cache-Control", "no-cache");

  // Recommended for proxies (Heroku, Vercel…)
  res.flushHeaders?.();

  for await (const token of text) {
    res.write(`data: ${JSON.stringify({ token })}\n\n`);
  }

  // Final end marker (OpenAI style)
  res.write("data: [DONE]\n\n");
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
