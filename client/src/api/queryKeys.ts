import type { GetUsersParams } from "shared";

/**
 * Centralized query key factory.
 * Using factory functions for type-safety and consistency.
 *
 * Pattern: [domain, ...scope] allows for granular cache invalidation.
 * - queryKeys.users.all() → invalidates all user-related queries
 * - queryKeys.users.list(params) → specific list with filters
 * - queryKeys.users.metadata() → metadata query
 */
export const queryKeys = {
  users: {
    all: () => ["users"] as const,
    list: (params: Omit<GetUsersParams, "page">) =>
      ["users", "list", params] as const,
    metadata: () => ["users", "metadata"] as const,
  },
} as const;

