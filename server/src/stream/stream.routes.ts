import { Router } from "express";
import {
  streamTextRaw,
  streamTextNDJSON,
  streamTextSSE,
} from "./stream.controller.js";

const router = Router();

router.get("/raw-http-chunked", streamTextRaw);

router.get("/ndjson", streamTextNDJSON);

router.get("/sse", streamTextSSE);

export default router;
