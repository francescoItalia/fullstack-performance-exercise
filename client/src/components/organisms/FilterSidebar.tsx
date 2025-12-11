import { FilterSection } from "../molecules";

type FilterSidebarProps = {
  hobbies: string[];
  nationalities: string[];
  selectedHobbies: string[];
  selectedNationalities: string[];
  onHobbiesChange: (hobbies: string[]) => void;
  onNationalitiesChange: (nationalities: string[]) => void;
};

export function FilterSidebar({
  hobbies,
  nationalities,
  selectedHobbies,
  selectedNationalities,
  onHobbiesChange,
  onNationalitiesChange,
}: FilterSidebarProps) {
  const hasFilters =
    selectedHobbies.length > 0 || selectedNationalities.length > 0;

  const clearAll = () => {
    onHobbiesChange([]);
    onNationalitiesChange([]);
  };

  return (
    <aside className="w-full lg:w-96 p-4 bg-gray-50 rounded-lg space-y-6">
      {/* Header with Clear all */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">Filters</span>
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
      />
    </aside>
  );
}

