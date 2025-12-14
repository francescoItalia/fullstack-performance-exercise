/**
 * Streams Page Constants
 * Centralized strings for the streaming demos
 */

// Page content
export const STREAMS_PAGE = {
  TITLE: "HTTP Streaming Strategies",
  DESCRIPTION:
    "Explore different approaches to streaming data from server to client. Each method has unique characteristics suited for different use cases.",
  ABOUT_TITLE: "About This Exercise",
  ABOUT_DESCRIPTION:
    "This page demonstrates reading HTTP responses as streams and displaying content progressively. Each demo shows a different streaming protocol: raw chunked transfer, NDJSON, and Server-Sent Events (SSE).",
} as const;

// Shared button labels
export const STREAM_BUTTONS = {
  START: "Start Stream",
  RESET: "Reset",
  STREAMING: "Streaming...",
  GENERATING: "Generating...",
} as const;

// Shared status messages
export const STREAM_STATUS = {
  COMPLETE: "✓ Complete",
  ERROR: "✕ Error",
  RECEIVING: "Receiving...",
  THINKING: "thinking...",
} as const;

// Raw HTTP demo
export const RAW_STREAM = {
  TITLE: "Raw HTTP Chunked",
  DESCRIPTION: "Streams text character-by-character using Transfer-Encoding: chunked",
  BADGE: "text/plain",
  PLACEHOLDER: 'Click "Start Stream" to begin...',
  CHARS_SUFFIX: "characters received",
} as const;

// NDJSON demo
export const NDJSON_STREAM = {
  TITLE: "NDJSON Streaming",
  DESCRIPTION: "Structured event streaming using Newline Delimited JSON",
  BADGE: "application/x-ndjson",
  PLACEHOLDER: 'Click "Start Stream" to generate text...',
  CHARS_SUFFIX: "characters",
  TOKENS_SUFFIX: "tokens",
} as const;

// SSE demo
export const SSE_STREAM = {
  TITLE: "SSE Streaming",
  DESCRIPTION: "Server-Sent Events — the protocol ChatGPT uses",
  BADGE: "text/event-stream",
  PLACEHOLDER: 'Click "Start Stream" to generate text...',
  CHARS_SUFFIX: "characters",
  TOKENS_SUFFIX: "tokens",
} as const;

