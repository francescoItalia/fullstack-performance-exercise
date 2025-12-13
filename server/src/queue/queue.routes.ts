/**
 * Route definitions for queue endpoints.
 */

import { Router } from "express";
import { submitJob, getStatus } from "./queue.controller.js";

const router = Router();

// POST /api/queue/submit - Submit a job
router.post("/submit", submitJob);

// GET /api/queue/status - Get queue status
router.get("/status", getStatus);

export default router;
