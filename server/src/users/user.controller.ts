import type { Request, Response } from "express";
import { validateUserQuery } from "shared";
import * as userService from "./user.service.js";

/**
 * HTTP handlers for user endpoints.
 */

export function getUsers(req: Request, res: Response): void {
  const validationResult = validateUserQuery(req.query);

  if (!validationResult.success) {
    res.status(400).json({
      error: validationResult.error,
      details: validationResult.details,
    });
    return;
  }

  const params = validationResult.data;
  const result = userService.getUsers(params);
  res.json(result);
}

export function getMetadata(_req: Request, res: Response): void {
  const result = userService.getMetadata();
  res.json(result);
}
