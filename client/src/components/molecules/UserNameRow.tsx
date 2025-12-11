import { Avatar, Text } from "../atoms";

type UserNameRowProps = {
  avatar: string;
  firstName: string;
  lastName: string;
};

export function UserNameRow({ avatar, firstName, lastName }: UserNameRowProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={avatar} alt={`${firstName} ${lastName}`} size="lg" />
      <Text variant="heading">
        {firstName} {lastName}
      </Text>
    </div>
  );
}

