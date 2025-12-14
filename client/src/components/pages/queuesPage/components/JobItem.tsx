import type { JobState } from "shared";
import { StatusIndicator } from "@components/atoms";

type JobItemProps = {
  job: JobState;
};

const statusBadgeStyles = {
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  idle: "bg-gray-100 text-gray-700",
} as const;

/**
 * Individual job row with status indicator and details.
 */
export function JobItem({ job }: JobItemProps) {
  return (
    <div className="px-6 py-4 flex items-start gap-4">
      <div className="flex-shrink-0 mt-1">
        <StatusIndicator status={job.status} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">
            {job.requestId.slice(0, 8)}...
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${statusBadgeStyles[job.status]}`}
          >
            {job.status}
          </span>
        </div>

        {job.result && (
          <p className="mt-1 text-sm text-gray-600 truncate">{job.result}</p>
        )}

        <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
          {job.queuedAt && (
            <span>Queued: {new Date(job.queuedAt).toLocaleTimeString()}</span>
          )}
          {job.processedAt && (
            <span>
              Completed: {new Date(job.processedAt).toLocaleTimeString()}
            </span>
          )}
          {job.queuedAt && job.processedAt && (
            <span className="font-medium text-gray-500">
              ({job.processedAt - job.queuedAt}ms)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
