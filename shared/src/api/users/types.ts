/**
 * Types for user API endpoints.
 * Shared between server and client.
 */

import type { User } from "../../entities/user.js";
import type { PaginatedResponse } from "../../common/pagination.js";

// ============================================================
// Request Parameters
// ============================================================

export type GetUsersParams = {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  nationalities?: string[] | undefined;
  hobbies?: string[] | undefined;
};

// ============================================================
// Response Types
// ============================================================

export type GetUsersResponse = PaginatedResponse<User>;

export type GetUsersMetadataResponse = {
  hobbies: string[];
  nationalities: string[];
};

