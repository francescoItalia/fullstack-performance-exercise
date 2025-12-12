import { Router } from "express";
import { streamTextRaw, streamTextNDJSON } from "./stream.controller.js";

const router = Router();

router.get("/raw-http-chunked", streamTextRaw);

router.get("/ndjson", streamTextNDJSON);

export default router;
