import { useStreamRaw } from "@api/stream";
import { Button, StatusIndicator } from "@components/atoms";
import { StreamCard } from "./StreamCard";

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
            <Button onClick={start} disabled={isStreaming}>
              {isStreaming ? "Streaming..." : "Start Stream"}
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
