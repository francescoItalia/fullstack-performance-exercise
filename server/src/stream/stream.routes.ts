import { Router } from "express";
import { streamTextRaw } from "./stream.controller.js";

const router = Router();

router.get("/raw-http-chunked", streamTextRaw);

export default router;
