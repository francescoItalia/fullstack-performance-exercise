import { useState, useCallback, useRef } from "react";
import { streamNDJSON } from "./stream.endpoints";
import type { StreamState, ChatMetadata, ChatUsage } from "shared";

/**
 * Hook for consuming NDJSON streaming responses.
 *
 * Provides:
 * - Accumulated text content
 * - Message metadata (model, message_id, created_at)
 * - Usage stats after completion (token counts)
 * - Stream state management
 */
export function useStreamNDJSON() {
  const [content, setContent] = useState("");
  const [state, setState] = useState<StreamState>("idle");
  const [error, setError] = useState<Error | null>(null);
  const [metadata, setMetadata] = useState<ChatMetadata | null>(null);
  const [usage, setUsage] = useState<ChatUsage | null>(null);

  // Track abort state
  const abortRef = useRef(false);

  const start = useCallback(async () => {
    // Reset all state
    setContent("");
    setState("streaming");
    setError(null);
    setMetadata(null);
    setUsage(null);
    abortRef.current = false;

    try {
      for await (const event of streamNDJSON()) {
        if (abortRef.current) break;

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
      }

      setState("complete");
    } catch (err) {
      if (!abortRef.current) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setState("error");
      }
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current = true;
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

