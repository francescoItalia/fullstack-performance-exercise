import { Checkbox, Text, Tag } from "../atoms";

type FilterSectionProps = {
  title: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

export function FilterSection({
  title,
  options,
  selected,
  onChange,
}: FilterSectionProps) {
  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleRemove = (option: string) => {
    onChange(selected.filter((s) => s !== option));
  };

  return (
    <div className="space-y-3">
      <Text variant="heading" className="text-sm">
        {title}
      </Text>

      {/* Desktop: 2-column grid (checkboxes | selected tags) */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4">
        {/* Checkboxes column */}
        <div className="space-y-2">
          {options.map((option) => (
            <Checkbox
              key={option}
              label={option}
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
            />
          ))}
        </div>

        {/* Selected tags column */}
        <div className="flex flex-wrap gap-1 content-start min-h-[2.5rem]">
          {selected.map((item) => (
            <Tag key={item} onRemove={() => handleRemove(item)}>
              {item}
            </Tag>
          ))}
        </div>
      </div>

      {/* Mobile/Tablet: horizontal scroll + tags below */}
      <div className="lg:hidden space-y-3">
        {/* Horizontal scrollable checkboxes */}
        <div
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {options.map((option) => (
            <div key={option} className="flex-shrink-0">
              <Checkbox
                label={option}
                checked={selected.includes(option)}
                onChange={() => handleToggle(option)}
              />
            </div>
          ))}
        </div>

        {/* Selected tags below with reserved space */}
        <div className="flex flex-wrap gap-1 min-h-[2.5rem]">
          {selected.map((item) => (
            <Tag key={item} onRemove={() => handleRemove(item)}>
              {item}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
