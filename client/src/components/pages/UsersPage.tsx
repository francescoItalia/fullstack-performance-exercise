import { useState } from "react";
import type { User } from "shared";
import { SearchBox } from "../molecules";
import { UserListVirtual, FilterSidebar } from "../organisms";
import { PageWithSidebarTemplate } from "../templates";

// Mock data for scaffolding — will be replaced with API calls
const MOCK_USERS: User[] = [
  {
    id: "1",
    avatar: "https://i.pravatar.cc/150?u=1",
    first_name: "John",
    last_name: "Doe",
    age: 28,
    nationality: "United States",
    hobbies: ["coding", "gaming", "reading"],
  },
  {
    id: "2",
    avatar: "https://i.pravatar.cc/150?u=2",
    first_name: "Jane",
    last_name: "Smith",
    age: 34,
    nationality: "Canada",
    hobbies: ["music", "travel"],
  },
  {
    id: "3",
    avatar: "https://i.pravatar.cc/150?u=3",
    first_name: "Carlos",
    last_name: "Garcia",
    age: 42,
    nationality: "Spain",
    hobbies: ["sports", "cooking", "photography", "hiking"],
  },
];

const MOCK_HOBBIES = [
  "coding",
  "gaming",
  "reading",
  "music",
  "travel",
  "sports",
  "cooking",
  "photography",
  "hiking",
];

const MOCK_NATIONALITIES = [
  "United States",
  "Canada",
  "Spain",
  "Germany",
  "France",
];

export function UsersPage() {
  const [search, setSearch] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedNationalities, setSelectedNationalities] = useState<string[]>(
    []
  );

  // TODO: Replace with actual API integration
  const users = MOCK_USERS;
  const hobbies = MOCK_HOBBIES;
  const nationalities = MOCK_NATIONALITIES;

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
        <FilterSidebar
          hobbies={hobbies}
          nationalities={nationalities}
          selectedHobbies={selectedHobbies}
          selectedNationalities={selectedNationalities}
          onHobbiesChange={setSelectedHobbies}
          onNationalitiesChange={setSelectedNationalities}
        />
      }
      content={
        <UserListVirtual users={users} hasMore={false} isLoading={false} />
      }
    />
  );
}
