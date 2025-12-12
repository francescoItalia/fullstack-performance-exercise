import { useStreamRaw } from "../../api/stream";
import { StreamCard } from "../molecules";

/**
 * Demo component for raw HTTP chunked streaming.
 * Displays text character-by-character as it streams from the server.
 */
export function RawStreamDemo() {
  const { text, error, start, reset, isStreaming, isComplete } = useStreamRaw();

  return (
    <StreamCard
      title="Raw HTTP Chunked"
      description="Streams text character-by-character using Transfer-Encoding: chunked"
      badge="text/plain"
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
              {isStreaming ? "Streaming..." : "Start Stream"}
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
                Receiving...
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

      {/* Stream output area */}
      <div
        className="h-64 overflow-auto p-4 bg-gray-900 rounded-lg font-mono text-sm 
          text-gray-100 whitespace-pre-wrap leading-relaxed"
      >
        {text || (
          <span className="text-gray-500 italic">
            Click "Start Stream" to begin...
          </span>
        )}
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-0.5" />
        )}
      </div>

      {/* Character count */}
      {text && (
        <div className="mt-2 text-xs text-gray-500 text-right">
          {text.length.toLocaleString()} characters received
        </div>
      )}
    </StreamCard>
  );
}
