import type { JobState } from "shared";
import { JobItem } from "./JobItem";
import { JOB_LIST } from "../queues.constants";

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
        <h2 className="text-lg font-semibold text-gray-900">{JOB_LIST.TITLE}</h2>
      </div>

      {jobs.length === 0 ? (
        <div className="px-6 py-12 text-center text-gray-500">
          <p>{JOB_LIST.EMPTY_TITLE}</p>
          <p className="text-sm mt-1">{JOB_LIST.EMPTY_HINT}</p>
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

