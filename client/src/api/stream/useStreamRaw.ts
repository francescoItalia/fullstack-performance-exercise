import { useState, useCallback, useRef } from "react";
import { streamRawText } from "./stream.endpoints";
import type { StreamState } from "shared";

/**
 * Hook for consuming raw HTTP chunked streaming.
 * Returns accumulated text, stream state, and control functions.
 */
export function useStreamRaw() {
  const [text, setText] = useState("");
  const [state, setState] = useState<StreamState>("idle");
  const [error, setError] = useState<Error | null>(null);

  // Track if we should abort (for cleanup)
  const abortRef = useRef(false);

  const start = useCallback(async () => {
    // Reset state
    setText("");
    setState("streaming");
    setError(null);
    abortRef.current = false;

    try {
      for await (const char of streamRawText()) {
        if (abortRef.current) break;
        setText((prev) => prev + char);
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
    setText("");
    setState("idle");
    setError(null);
  }, []);

  return {
    /** Accumulated text received so far */
    text,
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
