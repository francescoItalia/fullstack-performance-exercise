import { useStreamNDJSON } from "../../api/stream";
import { StreamCard } from "../molecules";

/**
 * Demo component for NDJSON streaming.
 * Shows message metadata, streaming content, and usage stats.
 */
export function NDJSONStreamDemo() {
  const {
    content,
    metadata,
    usage,
    error,
    start,
    reset,
    isStreaming,
    isComplete,
  } = useStreamNDJSON();

  // Calculate elapsed time if we have metadata
  const elapsedTime =
    metadata && isComplete
      ? ((Date.now() / 1000 - metadata.createdAt) * 1000).toFixed(0)
      : null;

  return (
    <StreamCard
      title="NDJSON Streaming"
      description="Structured event streaming using Newline Delimited JSON"
      badge="application/x-ndjson"
      footer={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={start}
              disabled={isStreaming}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg
                hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
            >
              {isStreaming ? "Generating..." : "Start Stream"}
            </button>

            {(isComplete || error) && (
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg
                  hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 text-sm">
            {isStreaming && (
              <span className="flex items-center gap-1.5 text-amber-600">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
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
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-medium">
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
          <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5" />
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
