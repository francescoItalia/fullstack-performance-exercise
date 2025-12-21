import { Input } from "@components/atoms";

type SearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
};

export function SearchBox({
  value,
  onChange,
  maxLength = 100,
  placeholder = "Search users...",
}: SearchBoxProps) {
  const charCount = value.length;
  const isNearLimit = charCount >= maxLength - 5;

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10"
        maxLength={maxLength}
      />
      {isNearLimit && (
        <span
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
            charCount >= maxLength ? "text-red-500" : "text-gray-400"
          }`}
        >
          {charCount}/{maxLength}
        </span>
      )}
    </div>
  );
}
