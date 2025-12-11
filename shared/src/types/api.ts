import type { User } from "./user.js";

export type GetUsersParams = {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
} & Partial<Metadata>;

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type GetUsersResponse = PaginatedResponse<User>;

export type Metadata = {
  hobbies: string[] | undefined;
  nationalities: string[] | undefined;
};

export type GetUsersMetadataResponse = Metadata;
