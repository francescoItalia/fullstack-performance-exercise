import type { Request, Response } from "express";
import type { QueueSubmitResponse } from "shared";
import { enqueueJob, getQueueSize, isWorkerBusy } from "./queue.service.js";

/**
 * POST /api/queue/submit
 *
 * Submit a job to the processing queue.
 */
export function submitJob(req: Request, res: Response): void {
  const { payload } = req.body;

  const job = enqueueJob(payload);

  const response: QueueSubmitResponse = {
    status: "pending",
    requestId: job.requestId,
    queuedAt: job.createdAt,
  };

  res.status(202).json(response);
}

/**
 * GET /api/queue/status
 *
 * Get current queue status (for debugging/monitoring).
 */
export function getStatus(_req: Request, res: Response): void {
  res.json({
    queueSize: getQueueSize(),
    isProcessing: isWorkerBusy(),
  });
}
