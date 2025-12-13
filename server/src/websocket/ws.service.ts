/**
 * Socket.IO service for real-time communication.
 * Broadcasts job results to connected clients.
 */

import { Server as SocketIOServer } from "socket.io";
import type { Server as HttpServer } from "http";
import type { JobResult, JobResultEvent } from "shared";

let io: SocketIOServer | null = null;

/**
 * Initialize Socket.IO server attached to HTTP server.
 */
export function initSocketIO(server: HttpServer): void {
  io = new SocketIOServer(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`Socket.IO client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket.IO client disconnected: ${socket.id}`);
    });
  });

  console.log("Socket.IO server initialized");
}

/**
 * Broadcast job result to all connected clients.
 * Called by queue service when a job completes.
 */
export function broadcastResult(result: JobResult): void {
  if (!io) {
    console.error("Socket.IO server not initialized");
    return;
  }

  const event: JobResultEvent = {
    requestId: result.requestId,
    result: result.result,
    processedAt: result.processedAt,
  };

  // Emit "job_result" event to all connected clients
  io.emit("job_result", event);

  console.log(
    `Broadcast job_result for ${result.requestId} to ${getClientCount()} clients`
  );
}

/**
 * Get current connected client count.
 */
export function getClientCount(): number {
  return io?.engine.clientsCount ?? 0;
}
