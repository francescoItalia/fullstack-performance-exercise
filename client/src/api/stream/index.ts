// Endpoints
export { streamRawText, streamNDJSON, createSSEStream } from "./stream.endpoints";

// Hooks
export { useStreamRaw } from "./useStreamRaw";
export { useStreamNDJSON } from "./useStreamNDJSON";
export { useStreamSSE } from "./useStreamSSE";

// Re-export types from shared for convenience
export type {
  StreamState,
  ChatStreamEvent,
  ChatMessageStart,
  ChatDelta,
  ChatMessageComplete,
  ChatMetadata,
  ChatUsage,
} from "shared";

