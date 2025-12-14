import { useStreamRaw } from "@api/stream";
import { Button, StatusIndicator } from "@components/atoms";
import { StreamCard } from "./StreamCard";
import { RAW_STREAM, STREAM_BUTTONS, STREAM_STATUS } from "../streams.constants";

/**
 * Demo component for raw HTTP chunked streaming.
 * Displays text character-by-character as it streams from the server.
 */
export function RawStreamDemo() {
  const { text, error, start, reset, isStreaming, isComplete } = useStreamRaw();

  return (
    <StreamCard
      title={RAW_STREAM.TITLE}
      description={RAW_STREAM.DESCRIPTION}
      badge={RAW_STREAM.BADGE}
      footer={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button onClick={start} disabled={isStreaming}>
              {isStreaming ? STREAM_BUTTONS.STREAMING : STREAM_BUTTONS.START}
            </Button>

            {(isComplete || error) && (
              <Button variant="secondary" onClick={reset}>
                {STREAM_BUTTONS.RESET}
              </Button>
            )}
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 text-sm">
            {isStreaming && (
              <span className="flex items-center gap-1.5 text-amber-600">
                <StatusIndicator status="pending" />
                {STREAM_STATUS.RECEIVING}
              </span>
            )}
            {isComplete && (
              <span className="text-green-600 font-medium">{STREAM_STATUS.COMPLETE}</span>
            )}
            {error && <span className="text-red-600">{STREAM_STATUS.ERROR}</span>}
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
          <span className="text-gray-500 italic">{RAW_STREAM.PLACEHOLDER}</span>
        )}
        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-0.5" />
        )}
      </div>

      {/* Character count */}
      {text && (
        <div className="mt-2 text-xs text-gray-500 text-right">
          {text.length.toLocaleString()} {RAW_STREAM.CHARS_SUFFIX}
        </div>
      )}
    </StreamCard>
  );
}
