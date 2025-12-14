import { useQuery } from "@tanstack/react-query";
import type { GetUsersMetadataResponse } from "shared";
import { fetchUsersMetadata } from "./users.endpoints";
import { queryKeys } from "@api/queryKeys";

/** Default selector: returns the raw metadata response */
const defaultSelectMetadata = (data: GetUsersMetadataResponse) => data;

type UseUsersMetadataOptions<TData = GetUsersMetadataResponse> = {
  select?: (data: GetUsersMetadataResponse) => TData;
};

export function useUsersMetadata<TData = GetUsersMetadataResponse>(
  options: UseUsersMetadataOptions<TData> = {}
) {
  const { select } = options;

  const query = useQuery({
    queryKey: queryKeys.users.metadata(),
    queryFn: fetchUsersMetadata,
    staleTime: 5 * 60 * 1000, // 5 minutes — metadata rarely changes
    select:
      select ??
      (defaultSelectMetadata as (data: GetUsersMetadataResponse) => TData),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
