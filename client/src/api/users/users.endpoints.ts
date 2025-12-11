import type {
  GetUsersResponse,
  GetUsersMetadataResponse,
  GetUsersParams,
} from "shared";
import { apiClient } from "../apiClient";

export async function fetchUsers(
  params: GetUsersParams
): Promise<GetUsersResponse> {
  return apiClient<GetUsersResponse>("/users", { params });
}

export async function fetchUsersMetadata(): Promise<GetUsersMetadataResponse> {
  return apiClient<GetUsersMetadataResponse>("/users/metadata");
}
