import express from "express";
import userRoutes from "./users/user.routes.js";
import streamRoutes from "./stream/stream.routes.js";
import type { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Register user routes
app.use("/api/users", userRoutes);

// Register streaming route
app.use("/api/stream", streamRoutes);

export default app;
