/**
 * Worker thread for processing queued jobs.
 *
 * This runs in a separate thread, allowing the main thread
 * to remain responsive while jobs are processed.
 *
 * Communication:
 * - Receives: QueueJob via parentPort.on("message")
 * - Sends: JobResult via parentPort.postMessage()
 */

import { parentPort } from "worker_threads";
import type { QueueJob, JobResult } from "shared";

// parentPort is how the worker thread communicates with the main thread
if (!parentPort) {
  // If parentPort is not available, this script was run as a normal Node process, so throw an error.
  throw new Error("This file must be run as a worker thread");
}

parentPort.on("message", async (job: QueueJob) => {
  console.log(`[Worker] Processing job: ${job.requestId}`);

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Generate result
  const result: JobResult = {
    requestId: job.requestId,
    result: `Processed job ${job.requestId} with payload: ${JSON.stringify(job.payload ?? null)}`,
    processedAt: Date.now(),
  };

  console.log(`[Worker] Completed job: ${job.requestId}`);

  // Send result back to main thread
  parentPort!.postMessage(result);
});

console.log("[Worker] Queue worker thread started");
