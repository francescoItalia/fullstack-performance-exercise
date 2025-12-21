import { createServer } from "http";
import app from "./app.js";
import { initSocketIO } from "./websocket/ws.service.js";
import { initWorker } from "./queue/queue.service.js";

const PORT = 3000;

const server = createServer(app);

initSocketIO(server);

initWorker();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.IO available on ws://localhost:${PORT}`);
});
