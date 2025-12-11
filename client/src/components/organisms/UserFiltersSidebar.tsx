import { useUsersMetadata } from "../../api/users";
import { FilterSection } from "../molecules";

type UserFiltersSidebarProps = {
  selectedHobbies: string[];
  selectedNationalities: string[];
  onHobbiesChange: (hobbies: string[]) => void;
  onNationalitiesChange: (nationalities: string[]) => void;
};

export function UserFiltersSidebar({
  selectedHobbies,
  selectedNationalities,
  onHobbiesChange,
  onNationalitiesChange,
}: UserFiltersSidebarProps) {
  const { data: metadata, isLoading } = useUsersMetadata();

  const hobbies = metadata?.hobbies ?? [];
  const nationalities = metadata?.nationalities ?? [];

  const hasFilters =
    selectedHobbies.length > 0 || selectedNationalities.length > 0;

  const clearAll = () => {
    onHobbiesChange([]);
    onNationalitiesChange([]);
  };

  if (isLoading) {
    return (
      <aside className="w-full lg:w-96 p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-80 bg-gray-200 rounded" />
          <div className="h-80 bg-gray-200 rounded" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-96 p-4 bg-gray-50 rounded-lg space-y-6">
      {/* Header with Clear all */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-indigo-600 hover:text-indigo-700"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection
        title="Hobbies"
        options={hobbies}
        selected={selectedHobbies}
        onChange={onHobbiesChange}
      />

      <FilterSection
        title="Nationalities"
        options={nationalities}
        selected={selectedNationalities}
        onChange={onNationalitiesChange}
        direction="column"
      />
    </aside>
  );
}
