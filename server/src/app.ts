import express from "express";
import userRoutes from "./users/user.routes.js";
import streamRoutes from "./stream/stream.routes.js";
import queueRoutes from "./queue/queue.routes.js";
import type { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Register user routes
app.use("/api/users", userRoutes);

// Register streaming routes
app.use("/api/stream", streamRoutes);

// Register queue routes
app.use("/api/queue", queueRoutes);

export default app;
