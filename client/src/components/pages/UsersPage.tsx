import { useState } from "react";
import { useUsersQuery } from "../../api/users";

import { SearchBox } from "../molecules";
import { UserListVirtual, UserFiltersSidebar } from "../organisms";
import { PageWithSidebarTemplate } from "../templates";
import { useDebouncedValue } from "../../hooks";

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedNationalities, setSelectedNationalities] = useState<string[]>(
    []
  );

  // Debounce search to avoid excessive API calls
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
      header={
        <div className="max-w-md">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search by name..."
          />
        </div>
      }
      sidebar={
        <UserFiltersSidebar
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
