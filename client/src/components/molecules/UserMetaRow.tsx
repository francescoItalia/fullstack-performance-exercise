import { Text } from "../atoms";

type UserMetaRowProps = {
  nationality: string;
  age: number;
};

export function UserMetaRow({ nationality, age }: UserMetaRowProps) {
  return (
    <div className="flex items-center gap-2">
      <Text variant="caption">{nationality}</Text>
      <span className="text-gray-300">•</span>
      <Text variant="caption">{age} years old</Text>
    </div>
  );
}

