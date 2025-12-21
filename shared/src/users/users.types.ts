/**
 * User-related types shared between server and client.
 */

// ============================================================
// Shared Types
// ============================================================

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

// ============================================================
// Entity
// ============================================================

export type User = {
  id: string;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string[];
};

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
