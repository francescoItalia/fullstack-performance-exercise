/**
 * Types for queue/worker/websocket job processing.
 * Shared between server and client.
 *
 * Architecture:
 * - Server owns job identity (generates requestId)
 * - Client sends payload only
 * - Server responds with pending status + requestId
 * - Worker processes and sends result via Socket.IO
 */

// ============================================================
// API Request/Response Types
// ============================================================

/**
 * Request body for submitting a job (client sends payload only)
 */
export type QueueSubmitRequest = {
  payload?: unknown;
};

/**
 * Response when job is submitted (immediate 202 Accepted)
 * Server generates the requestId
 */
export type QueueSubmitResponse = {
  status: "pending";
  requestId: string;
  queuedAt: number;
};

// ============================================================
// Internal Job Types (Server-side)
// ============================================================

/**
 * Job in the queue (server-generated ID)
 */
export type QueueJob = {
  requestId: string;
  payload?: unknown;
  createdAt: number;
};

/**
 * Result after job is processed by worker
 */
export type JobResult = {
  requestId: string;
  result: string;
  processedAt: number;
};

// ============================================================
// Socket.IO Event Types
// ============================================================

/**
 * Socket.IO event sent when job completes
 */
export type JobResultEvent = {
  requestId: string;
  result: string;
  processedAt: number;
};

// ============================================================
// Client-side State
// ============================================================

export type JobStatus = "idle" | "pending" | "completed" | "error";

/**
 * Client-side job state for UI
 */
export type JobState = {
  requestId: string;
  status: JobStatus;
  result?: string;
  error?: string;
  queuedAt?: number;
  processedAt?: number;
};

