import type { JobState } from "shared";
import { JobItem } from "./JobItem";

type JobListProps = {
  jobs: JobState[];
};

/**
 * Jobs list container with empty state.
 */
export function JobList({ jobs }: JobListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Jobs</h2>
      </div>

      {jobs.length === 0 ? (
        <div className="px-6 py-12 text-center text-gray-500">
          <p>No jobs submitted yet.</p>
          <p className="text-sm mt-1">
            Click "Submit Job" to add a job to the queue.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {jobs.map((job) => (
            <JobItem key={job.requestId} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

