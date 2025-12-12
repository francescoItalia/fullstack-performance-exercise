import type { Request, Response } from "express";
import { streamGeneratedText, streamGeneratedToken } from "./stream.service.js";
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
 *   data: {"token":"H"}
 *   data: {"token":"e"}
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
