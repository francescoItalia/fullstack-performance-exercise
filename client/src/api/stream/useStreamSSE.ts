import { useState, useCallback, useRef } from "react";
import { createSSEStream } from "./stream.endpoints";
import type { StreamState, ChatMetadata, ChatUsage } from "shared";

/**
 * Hook for consuming Server-Sent Events (SSE) streaming.
 * This is the same protocol ChatGPT uses for streaming responses.
 *
 * SSE advantages over fetch-based streaming:
 * - Browser handles reconnection automatically
 * - Native EventSource API with typed event listeners
 * - Standard protocol with wide browser support
 *
 * Provides:
 * - Accumulated text content
 * - Message metadata (model, message_id, created_at)
 * - Usage stats after completion (token counts)
 * - Stream state management
 */
export function useStreamSSE() {
  const [content, setContent] = useState("");
  const [state, setState] = useState<StreamState>("idle");
  const [error, setError] = useState<Error | null>(null);
  const [metadata, setMetadata] = useState<ChatMetadata | null>(null);
  const [usage, setUsage] = useState<ChatUsage | null>(null);

  // Track the EventSource connection for cleanup
  const connectionRef = useRef<{ close: () => void } | null>(null);

  const start = useCallback(() => {
    // Reset all state
    setContent("");
    setState("streaming");
    setError(null);
    setMetadata(null);
    setUsage(null);

    // Close any existing connection
    connectionRef.current?.close();

    // Create new SSE connection
    connectionRef.current = createSSEStream(
      // onEvent callback
      (event) => {
        switch (event.type) {
          case "message_start":
            setMetadata({
              messageId: event.message_id,
              model: event.model,
              createdAt: event.created_at,
            });
            break;

          case "delta":
            setContent((prev) => prev + event.delta.content);
            break;

          case "message_complete":
            setUsage({
              completionTokens: event.usage.completion_tokens,
              totalTokens: event.usage.total_tokens,
            });
            break;
        }
      },
      // onError callback
      (err) => {
        setError(err);
        setState("error");
        connectionRef.current = null;
      },
      // onComplete callback
      () => {
        setState("complete");
        connectionRef.current = null;
      }
    );
  }, []);

  const reset = useCallback(() => {
    connectionRef.current?.close();
    connectionRef.current = null;
    setContent("");
    setState("idle");
    setError(null);
    setMetadata(null);
    setUsage(null);
  }, []);

  return {
    /** Accumulated text content */
    content,
    /** Message metadata from message_start event */
    metadata,
    /** Usage stats from message_complete event */
    usage,
    /** Current stream state */
    state,
    /** Error if stream failed */
    error,
    /** Start streaming */
    start,
    /** Reset to idle state */
    reset,
    /** Convenience flags */
    isStreaming: state === "streaming",
    isComplete: state === "complete",
  };
}
