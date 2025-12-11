import type { User } from "shared";
import { UserCard } from "./UserCard";

type UserListVirtualProps = {
  users: User[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
};

/**
 * Virtual scrolling list for users.
 * TODO: Integrate @tanstack/react-virtual for actual virtualization.
 * For now, renders all items (will be replaced with virtualized implementation).
 */
export function UserListVirtual({
  users,
  onLoadMore,
  hasMore,
  isLoading,
}: UserListVirtualProps) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}

      {isLoading && (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      )}

      {!isLoading && hasMore && onLoadMore && (
        <button
          onClick={onLoadMore}
          className="w-full py-3 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Load more
        </button>
      )}

      {!isLoading && users.length === 0 && (
        <div className="text-center py-8 text-gray-500">No users found</div>
      )}
    </div>
  );
}

