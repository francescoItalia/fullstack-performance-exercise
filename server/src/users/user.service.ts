import type {
  GetUsersParams,
  GetUsersResponse,
  GetUsersMetadataResponse,
} from "shared";
import * as userDb from "./user.db.js";

/**
 * User Service - Business Logic Layer
 *
 * Responsibilities:
 * - Orchestrate data access through the DB layer
 * - Apply business rules (pagination limits, etc.)
 * - Calculate derived values (hasMore flag)
 *
 */

/**
 * Retrieve paginated list of users with optional filtering.
 *
 * @param params - Query parameters for filtering/pagination
 * @param params.page - Page number (1-indexed, defaults to 1)
 * @param params.limit - Items per page (defaults to 20)
 * @param params.search - Search term for first_name/last_name
 * @param params.hobbies - Filter by hobbies (OR match)
 * @param params.nationalities - Filter by nationalities (OR match)
 *
 * @returns Paginated response with items, total count, and hasMore flag
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

/**
 * Retrieve metadata for filter UI (top hobbies and nationalities).
 *
 * Returns the 20 most common hobbies and nationalities across all users,
 * sorted by frequency (most common first).
 *
 * @returns Object containing hobbies[] and nationalities[] arrays
 */
export function getMetadata(): GetUsersMetadataResponse {
  return userDb.getMetadata();
}
