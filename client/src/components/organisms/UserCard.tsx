import type { User } from "shared";
import { Avatar, Text } from "../atoms";
import { HobbiesRow } from "../molecules";

type UserCardProps = {
  user: User;
};

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="h-full p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex gap-4">
      {/* Avatar - left side */}
      <Avatar
        src={user.avatar}
        alt={`${user.first_name} ${user.last_name}`}
        size="lg"
      />

      {/* Content - right side */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        {/* Name */}
        <Text variant="heading" className="truncate">
          {user.first_name} {user.last_name}
        </Text>

        {/* Nationality + Age */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="truncate">{user.nationality}</span>
          <span className="text-gray-400">•</span>
          <span>{user.age} yrs</span>
        </div>

        {/* Hobbies */}
        <HobbiesRow hobbies={user.hobbies} maxDisplay={2} />
      </div>
    </div>
  );
}
