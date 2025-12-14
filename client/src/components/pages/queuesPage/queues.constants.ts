/**
 * Queues Page Constants
 * Centralized strings for the queue processing demo
 */

// Page content
export const QUEUES_PAGE = {
  TITLE: "Queue Processing with Socket.IO",
  DESCRIPTION:
    "Submit jobs to a server queue. Jobs are processed in a worker thread and results are pushed via Socket.IO in real-time.",
  ABOUT_TITLE: "About This Exercise",
  ABOUT_DESCRIPTION:
    "This demonstrates async job processing with Web Workers and Socket.IO. Each job is queued server-side, processed in a worker thread with a 2-second delay, and the result is pushed to all connected clients via Socket.IO.",
} as const;

// Connection status
export const CONNECTION_STATUS = {
  CONNECTED: "Connected",
  DISCONNECTED: "Disconnected",
} as const;

// Stats labels
export const STATS_LABELS = {
  PENDING: "Pending:",
  COMPLETED: "Completed:",
} as const;

// Button labels
export const QUEUE_BUTTONS = {
  CLEAR_ALL: "Clear All",
  SUBMIT_JOB: "Submit Job",
  SUBMIT_BATCH: "Submit 20 Jobs",
  SUBMITTING: "Submitting...",
} as const;

// Job list
export const JOB_LIST = {
  TITLE: "Jobs",
  EMPTY_TITLE: "No jobs submitted yet.",
  EMPTY_HINT: 'Click "Submit Job" to add a job to the queue.',
} as const;

