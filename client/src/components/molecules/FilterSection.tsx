type FilterSectionProps = {
  title: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  direction?: "row" | "column";
};

export function FilterSection({
  title,
  options,
  selected,
  onChange,
  direction = "row",
}: FilterSectionProps) {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  // Sort options alphabetically
  const sortedOptions = [...options].sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>

      <div
        className={`flex flex-wrap gap-2 ${
          direction === "column" ? "lg:flex-col lg:items-start" : ""
        }`}
      >
        {sortedOptions.map((option) => {
          const isSelected = selected.includes(option);

          return (
            <button
              key={option}
              onClick={() => handleToggle(option)}
              className={`
                inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm
                transition-colors cursor-pointer
                ${
                  isSelected
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {option}
              {isSelected && (
                <span className="text-indigo-400 hover:text-indigo-700">×</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
