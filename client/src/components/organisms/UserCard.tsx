import type { User } from "shared";
import { UserNameRow, UserMetaRow, HobbiesRow } from "../molecules";

type UserCardProps = {
  user: User;
};

export function UserCard({ user }: UserCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <UserNameRow
            avatar={user.avatar}
            firstName={user.first_name}
            lastName={user.last_name}
          />
          <UserMetaRow nationality={user.nationality} age={user.age} />
          <HobbiesRow hobbies={user.hobbies} maxDisplay={2} />
        </div>
      </div>
    </div>
  );
}

