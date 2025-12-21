import { z } from "zod";

/**
 * Validation constants - single source of truth for all query limits.
 * Used both in schema validation and UI constraints.
 */
export const USER_QUERY_LIMITS = {
  SEARCH_MAX_LENGTH: 40,
  PAGE_MIN: 1,
  PAGE_MAX: 1000,
  PAGE_DEFAULT: 1,
  LIMIT_MIN: 1,
  LIMIT_MAX: 100,
  LIMIT_DEFAULT: 20,
  ARRAY_MAX_ITEMS: 50,
  ARRAY_ITEM_MAX_LENGTH: 100,
} as const;

/**
 * Shared validation schema for GET /users query parameters.
 * Used by both client and server for consistent validation.
 */
export const getUsersQuerySchema = z.object({
  // Page number: positive integer, uses constants for min/max
  page: z
    .string()
    .optional()
    .transform((val) =>
      val ? parseInt(val, 10) : USER_QUERY_LIMITS.PAGE_DEFAULT
    )
    .refine(
      (val) =>
        Number.isInteger(val) &&
        val >= USER_QUERY_LIMITS.PAGE_MIN &&
        val <= USER_QUERY_LIMITS.PAGE_MAX,
      {
        message: `Page must be between ${USER_QUERY_LIMITS.PAGE_MIN} and ${USER_QUERY_LIMITS.PAGE_MAX}`,
      }
    ),

  // Limit: positive integer, uses constants for min/max
  limit: z
    .string()
    .optional()
    .transform((val) =>
      val ? parseInt(val, 10) : USER_QUERY_LIMITS.LIMIT_DEFAULT
    )
    .refine(
      (val) =>
        Number.isInteger(val) &&
        val >= USER_QUERY_LIMITS.LIMIT_MIN &&
        val <= USER_QUERY_LIMITS.LIMIT_MAX,
      {
        message: `Limit must be between ${USER_QUERY_LIMITS.LIMIT_MIN} and ${USER_QUERY_LIMITS.LIMIT_MAX}`,
      }
    ),

  // Search term: trimmed string, max length from constants
  search: z.string().trim().max(USER_QUERY_LIMITS.SEARCH_MAX_LENGTH).optional(),

  // Nationalities filter: comma-separated string converted to array
  nationalities: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return val
        .split(",")
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
    })
    .pipe(
      z
        .array(z.string().min(1).max(USER_QUERY_LIMITS.ARRAY_ITEM_MAX_LENGTH))
        .max(USER_QUERY_LIMITS.ARRAY_MAX_ITEMS)
        .optional()
    ),

  // Hobbies filter: comma-separated string converted to array
  hobbies: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      return val
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0);
    })
    .pipe(
      z
        .array(z.string().min(1).max(USER_QUERY_LIMITS.ARRAY_ITEM_MAX_LENGTH))
        .max(USER_QUERY_LIMITS.ARRAY_MAX_ITEMS)
        .optional()
    ),
});

/**
 * Type inference from schema
 */
export type ValidatedUserQuery = z.infer<typeof getUsersQuerySchema>;

/**
 * Validation result - either success with data or failure with formatted errors
 */
export type UserQueryValidationResult =
  | { success: true; data: ValidatedUserQuery }
  | { success: false; error: string; details: unknown };

/**
 * Validates user query parameters and returns formatted result.
 *
 * @param queryParams - Raw query parameters from request
 * @returns Validation result with either data or formatted errors
 */
export function validateUserQuery(
  queryParams: Record<string, unknown>
): UserQueryValidationResult {
  const result = getUsersQuerySchema.safeParse(queryParams);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    error: "Invalid query parameters",
    details: z.treeifyError(result.error),
  };
}
