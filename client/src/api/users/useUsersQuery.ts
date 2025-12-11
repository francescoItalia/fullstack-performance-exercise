import { useInfiniteQuery } from "@tanstack/react-query";
import type { GetUsersParams, GetUsersResponse, User } from "shared";
import { fetchUsers } from "./users.endpoints";
import { queryKeys } from "../queryKeys";

type UseUsersQueryParams = Omit<GetUsersParams, "page">;

/** Default selector: flattens paginated responses into a single User[] */
const defaultSelectUsers = (data: { pages: GetUsersResponse[] }): User[] =>
  data.pages.flatMap((page) => page.items);

type UseUsersQueryOptions<TData = User[]> = {
  params?: UseUsersQueryParams;
  select?: (data: { pages: GetUsersResponse[] }) => TData;
};

export function useUsersQuery<TData = User[]>(
  options: UseUsersQueryOptions<TData> = {}
) {
  const { params = {}, select } = options;

  const query = useInfiniteQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: ({ pageParam }) =>
      fetchUsers({ ...params, page: pageParam, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: GetUsersResponse) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    select:
      select ??
      (defaultSelectUsers as (data: { pages: GetUsersResponse[] }) => TData),
    // Keep data fresh for 5 minutes. Without this, returning to a previously
    // paginated query (e.g., after removing filters) refetches ALL cached pages,
    // causing a burst of API calls. With staleTime, cached data is reused directly.
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasMore: query.hasNextPage ?? false,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  };
}
