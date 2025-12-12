/**
 * Types for streaming responses.
 * Shared between server and client for NDJSON streaming.
 */

// ============================================================
// NDJSON Chat Completion Events
// ============================================================

/**
 * First event: Message metadata with model info
 */
export type ChatMessageStart = {
  type: "message_start";
  message_id: string;
  model: string;
  created_at: number; // Unix timestamp
};

/**
 * Token delta: Incremental content chunks
 */
export type ChatDelta = {
  type: "delta";
  delta: { content: string };
  index: number;
};

/**
 * Completion event: Final stats and finish reason
 */
export type ChatMessageComplete = {
  type: "message_complete";
  finish_reason: "stop" | "length" | "error";
  usage: {
    prompt_tokens?: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

/**
 * Union of all chat stream events
 */
export type ChatStreamEvent =
  | ChatMessageStart
  | ChatDelta
  | ChatMessageComplete;

// ============================================================
// SSE Job Progress Events
// ============================================================

/**
 * Job progress event for SSE streaming
 */
export type JobProgressEvent = {
  step: string;
  progress: number; // 0–100
  message: string;
};

// ============================================================
// Stream State (Client-side)
// ============================================================

export type StreamState = "idle" | "streaming" | "complete" | "error";

/**
 * Metadata from message_start event (client-side convenience type)
 */
export type ChatMetadata = {
  messageId: string;
  model: string;
  createdAt: number;
};

/**
 * Usage stats from message_complete event (client-side convenience type)
 */
export type ChatUsage = {
  completionTokens: number;
  totalTokens: number;
};
