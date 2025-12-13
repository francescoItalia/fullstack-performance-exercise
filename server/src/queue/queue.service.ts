/**
 * Queue service for managing job processing with worker threads.
 *
 * Architecture:
 * 1. Jobs are added to an in-memory queue
 * 2. A worker thread processes jobs one at a time
 * 3. Results are broadcast via WebSocket
 */

import { Worker } from "worker_threads";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { QueueJob, JobResult } from "shared";
import { broadcastResult } from "../websocket/ws.service.js";

// Get current directory for worker path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// In-memory job queue
const jobQueue: QueueJob[] = [];

// Worker instance
let worker: Worker | null = null;
let isProcessing = false;

/**
 * Initialize the worker thread.
 * Must be called once at server startup.
 */
export function initWorker(): void {
  // Path to TypeScript worker file
  const workerPath = join(__dirname, "queue.worker.ts");

  // Create worker with ts-node/esm loader for TypeScript support
  worker = new Worker(workerPath, {
    execArgv: ["--loader", "ts-node/esm"],
  });

  // Handle results from worker
  worker.on("message", (result: JobResult) => {
    console.log(`Job completed: ${result.requestId}`);

    // Broadcast result to all WebSocket clients
    broadcastResult(result);

    // Mark as not processing and try next job
    isProcessing = false;
    processNextJob();
  });

  worker.on("error", (err) => {
    console.error("Worker error:", err);
    isProcessing = false;
    // Try to process next job even on error
    processNextJob();
  });

  worker.on("exit", (code) => {
    console.log(`Worker exited with code ${code}`);
    worker = null;
  });

  console.log("Queue worker initialized");
}

/**
 * Add a job to the queue.
 * Returns the queued job immediately.
 */
export function enqueueJob(payload?: unknown): QueueJob {
  const requestId = randomUUID();

  const job: QueueJob = {
    requestId,
    payload,
    createdAt: Date.now(),
  };

  jobQueue.push(job);
  console.log(`Job queued: ${requestId} (queue size: ${jobQueue.length})`);

  // Trigger processing
  processNextJob();

  return job;
}

/**
 * Process the next job in the queue.
 * Jobs are processed one at a time (FIFO).
 */
function processNextJob(): void {
  // Skip if already processing, queue empty, or no worker
  if (isProcessing || jobQueue.length === 0 || !worker) {
    return;
  }

  isProcessing = true;
  const job = jobQueue.shift()!;

  console.log(
    `Processing job: ${job.requestId} (remaining: ${jobQueue.length})`
  );

  // Send job to worker thread
  worker.postMessage(job);
}

/**
 * Get current queue size (for debugging/monitoring).
 */
export function getQueueSize(): number {
  return jobQueue.length;
}

/**
 * Check if worker is currently processing a job.
 */
export function isWorkerBusy(): boolean {
  return isProcessing;
}
