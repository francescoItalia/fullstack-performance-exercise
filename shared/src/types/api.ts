import { User } from "./user.js";

export type GetUsersParams = {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  nationality?: string | undefined;
  hobbies?: string[] | undefined;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type GetUsersResponse = PaginatedResponse<User>;
