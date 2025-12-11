import { Checkbox, Text } from "../atoms";

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

  return (
    <div className="space-y-3">
      <Text variant="heading" className="text-sm">
        {title}
      </Text>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {options.map((option) => (
          <Checkbox
            key={option}
            label={option}
            checked={selected.includes(option)}
            onChange={() => handleToggle(option)}
          />
        ))}
      </div>
    </div>
  );
}

