import { useStreamSSE } from "../../../../api/stream";
import { Button, StatusIndicator } from "../../../atoms";
import { StreamCard } from "./StreamCard";

/**
 * Demo component for Server-Sent Events (SSE) streaming.
 * This is the same protocol ChatGPT uses for streaming responses.
 *
 * Shows message metadata, streaming content, and usage stats.
 */
export function SSEStreamDemo() {
  const {
    content,
    metadata,
    usage,
    error,
    start,
    reset,
    isStreaming,
    isComplete,
  } = useStreamSSE();

  // Calculate elapsed time if we have metadata
  const elapsedTime =
    metadata && isComplete
      ? ((Date.now() / 1000 - metadata.createdAt) * 1000).toFixed(0)
      : null;

  return (
    <StreamCard
      title="SSE Streaming"
      description="Server-Sent Events — the protocol ChatGPT uses"
      badge="text/event-stream"
      footer={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={start} disabled={isStreaming}>
              {isStreaming ? "Generating..." : "Start Stream"}
            </Button>

            {(isComplete || error) && (
              <Button variant="secondary" onClick={reset}>
                Reset
              </Button>
            )}
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 text-sm">
            {isStreaming && (
              <span className="flex items-center gap-1.5 text-amber-600">
                <StatusIndicator status="pending" />
                Generating...
              </span>
            )}
            {isComplete && (
              <span className="text-green-600 font-medium">✓ Complete</span>
            )}
            {error && <span className="text-red-600">✕ Error</span>}
          </div>
        </div>
      }
    >
      {/* Error display */}
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error.message}
        </div>
      )}

      {/* Metadata header */}
      {metadata && (
        <div className="mb-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded font-medium">
              {metadata.model}
            </span>
            {isStreaming && !content && (
              <span className="text-gray-400 animate-pulse">thinking...</span>
            )}
          </div>
          <span className="text-gray-400 font-mono">
            {metadata.messageId.slice(0, 12)}...
          </span>
        </div>
      )}

      {/* Stream output area */}
      <div
        className="h-64 overflow-auto p-4 bg-gray-900 rounded-lg font-mono text-sm 
          text-gray-100 whitespace-pre-wrap leading-relaxed"
      >
        {content || (
          <span className="text-gray-500 italic">
            Click "Start Stream" to generate text...
          </span>
        )}
        {isStreaming && content && (
          <span className="inline-block w-2 h-4 bg-violet-400 animate-pulse ml-0.5" />
        )}
      </div>

      {/* Stats footer */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <div>
          {content && <span>{content.length.toLocaleString()} characters</span>}
        </div>
        <div className="flex items-center gap-3">
          {usage && (
            <span className="font-medium text-gray-600">
              {usage.totalTokens} tokens
            </span>
          )}
          {elapsedTime && <span>{elapsedTime}ms</span>}
        </div>
      </div>
    </StreamCard>
  );
}
