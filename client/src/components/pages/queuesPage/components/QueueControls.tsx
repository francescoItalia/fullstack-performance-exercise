import { StatusIndicator, Button } from "../../../atoms";

type QueueControlsProps = {
  isConnected: boolean;
  isSubmitting: boolean;
  pendingCount: number;
  completedCount: number;
  hasJobs: boolean;
  onSubmit: () => void;
  onSubmitBatch: () => void;
  onClearAll: () => void;
};

/**
 * Connection status, stats, and action buttons.
 */
export function QueueControls({
  isConnected,
  isSubmitting,
  pendingCount,
  completedCount,
  hasJobs,
  onSubmit,
  onSubmitBatch,
  onClearAll,
}: QueueControlsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Connection indicator */}
        <div className="flex items-center gap-2">
          <StatusIndicator status={isConnected ? "completed" : "error"} />
          <span className="text-sm font-medium text-gray-700">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            Pending:{" "}
            <span className="font-semibold text-amber-600">{pendingCount}</span>
          </span>
          <span>
            Completed:{" "}
            <span className="font-semibold text-green-600">
              {completedCount}
            </span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {hasJobs && (
            <Button variant="secondary" onClick={onClearAll}>
              Clear All
            </Button>
          )}

          <Button onClick={onSubmit} disabled={!isConnected || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Job"}
          </Button>

          <Button
            onClick={onSubmitBatch}
            disabled={!isConnected || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit 20 Jobs"}
          </Button>
        </div>
      </div>
    </div>
  );
}
