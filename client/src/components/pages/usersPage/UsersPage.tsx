import { useState } from "react";
import { useUsersQuery } from "@api/users";
import { UserListVirtual, UserFiltersSidebar } from "./components";
import { PageWithSidebarTemplate } from "@components/templates";
import { useDebouncedValue } from "@hooks/useDebouncedValue";

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedNationalities, setSelectedNationalities] = useState<string[]>(
    []
  );

  const debouncedSearch = useDebouncedValue(search);

  const {
    data: users = [],
    isLoading,
    isFetchingNextPage,
    hasMore,
    fetchNextPage,
  } = useUsersQuery({
    params: {
      search: debouncedSearch || undefined,
      hobbies: selectedHobbies.length > 0 ? selectedHobbies : undefined,
      nationalities:
        selectedNationalities.length > 0 ? selectedNationalities : undefined,
    },
  });

  return (
    <PageWithSidebarTemplate
      sidebar={
        <UserFiltersSidebar
          search={search}
          onSearchChange={setSearch}
          selectedHobbies={selectedHobbies}
          selectedNationalities={selectedNationalities}
          onHobbiesChange={setSelectedHobbies}
          onNationalitiesChange={setSelectedNationalities}
        />
      }
      content={
        <UserListVirtual
          users={users}
          hasMore={hasMore}
          isLoading={isLoading || isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      }
    />
  );
}
