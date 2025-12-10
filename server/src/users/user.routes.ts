import { Router } from "express";
import * as userController from "./user.controller.js";

const router = Router();

// GET /api/users - List users with pagination, search, and filters
router.get("/", userController.getUsers);

export default router;
