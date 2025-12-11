import { FilterSection } from "../molecules";
import { Tag } from "../atoms";

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
    <aside className="w-64 p-4 bg-gray-50 rounded-lg space-y-6">
      {hasFilters && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Active Filters
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-indigo-600 hover:text-indigo-700"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedHobbies.map((hobby) => (
              <Tag
                key={hobby}
                onRemove={() =>
                  onHobbiesChange(selectedHobbies.filter((h) => h !== hobby))
                }
              >
                {hobby}
              </Tag>
            ))}
            {selectedNationalities.map((nat) => (
              <Tag
                key={nat}
                onRemove={() =>
                  onNationalitiesChange(
                    selectedNationalities.filter((n) => n !== nat)
                  )
                }
              >
                {nat}
              </Tag>
            ))}
          </div>
        </div>
      )}

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
