import type { Request, Response } from "express";
import type { GetUsersParams } from "shared";
import * as userService from "./user.service.js";

/**
 * HTTP handlers for user endpoints.
 * Parses request, calls service, formats response.
 */

export function getUsers(req: Request, res: Response): void {
  const params: GetUsersParams = {
    page: req.query["page"] ? Number(req.query["page"]) : undefined,
    limit: req.query["limit"] ? Number(req.query["limit"]) : undefined,
    search: req.query["search"] as string | undefined,
    nationalities: req.query["nationalities"]
      ? (req.query["nationalities"] as string).split(",").map((n) => n.trim())
      : undefined,
    hobbies: req.query["hobbies"]
      ? (req.query["hobbies"] as string).split(",").map((h) => h.trim())
      : undefined,
  };

  const result = userService.getUsers(params);
  res.json(result);
}

export function getMetadata(_req: Request, res: Response): void {
  const result = userService.getMetadata();
  res.json(result);
}
