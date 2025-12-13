import { io, Socket } from "socket.io-client";
import type { QueueSubmitResponse, JobResultEvent } from "shared";

const API_BASE_URL = "/api";

// ============================================================
// HTTP API
// ============================================================

/**
 * Submit a job to the processing queue.
 * Server generates the requestId.
 * Returns immediately with pending status (202).
 */
export async function submitJob(
  payload?: unknown
): Promise<QueueSubmitResponse> {
  const response = await fetch(`${API_BASE_URL}/queue/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload }),
  });

  if (!response.ok) {
    throw new Error(`Submit failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ============================================================
// Socket.IO Connection
// ============================================================

type JobResultHandler = (event: JobResultEvent) => void;
type ConnectionHandler = () => void;
type ErrorHandler = (error: Error) => void;

export type SocketConnection = {
  /** Disconnect from Socket.IO server */
  disconnect: () => void;
  /** Check if connected */
  isConnected: () => boolean;
};

/**
 * Create a Socket.IO connection for receiving job results.
 *
 * @param onJobResult Callback when a job completes
 * @param onConnect Callback when connected
 * @param onDisconnect Callback when disconnected
 * @param onError Callback on connection error
 */
export function createSocketConnection(
  onJobResult: JobResultHandler,
  onConnect?: ConnectionHandler,
  onDisconnect?: ConnectionHandler,
  onError?: ErrorHandler
): SocketConnection {
  // Connect to same origin (Vite proxy handles /socket.io)
  const socket: Socket = io({
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Socket.IO connected:", socket.id);
    onConnect?.();
  });

  socket.on("disconnect", () => {
    console.log("Socket.IO disconnected");
    onDisconnect?.();
  });

  socket.on("connect_error", (err) => {
    console.error("Socket.IO connection error:", err);
    onError?.(err);
  });

  // Listen for job results
  socket.on("job_result", (event: JobResultEvent) => {
    console.log("Job result received:", event.requestId);
    onJobResult(event);
  });

  return {
    disconnect: () => {
      socket.disconnect();
    },
    isConnected: () => socket.connected,
  };
}
