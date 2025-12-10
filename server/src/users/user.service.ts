import type { User, GetUsersParams, GetUsersResponse } from "shared";
import * as userDb from "./user.db.js";

/**
 * Business logic for users.
 * Orchestrates data access and applies business rules.
 */

export function getUsers(params: GetUsersParams): GetUsersResponse {
  const { page = 1, limit = 20 } = params;

  // All filtering, searching, and pagination happens in the DB layer
  // When we add a real DB, only user.db.ts changes — this stays the same
  const { items, total } = userDb.findUsers(params);

  const hasMore = page * limit < total;

  return {
    items,
    page,
    limit,
    total,
    hasMore,
  };
}
