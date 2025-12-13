import { createServer } from "http";
import app from "./app.js";
import { initSocketIO } from "./websocket/ws.service.js";
import { initWorker } from "./queue/queue.service.js";

const PORT = 3000;

// Create HTTP server (required for Socket.IO on same port)
const server = createServer(app);

// Initialize Socket.IO server
initSocketIO(server);

// Initialize queue worker thread
initWorker();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.IO available on ws://localhost:${PORT}`);
});
