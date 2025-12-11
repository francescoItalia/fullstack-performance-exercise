import type { User } from "../../entities/user.js";
import type { PaginatedResponse } from "../../common/pagination.js";

export type GetUsersResponse = PaginatedResponse<User>;

export type GetUsersMetadataResponse = {
  hobbies: string[];
  nationalities: string[];
};
