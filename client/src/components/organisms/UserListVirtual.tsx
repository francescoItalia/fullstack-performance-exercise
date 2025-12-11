import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { User } from "shared";
import { UserCard } from "./UserCard";

type UserListVirtualProps = {
  users: User[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
};

const ROW_HEIGHT = 120;

export function UserListVirtual({
  users,
  onLoadMore,
  hasMore,
  isLoading,
}: UserListVirtualProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const loadTriggeredForCount = useRef(0);

  const virtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    if (!virtualItems.length || !hasMore || isLoading || !onLoadMore) return;
    if (loadTriggeredForCount.current >= users.length) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (lastItem && lastItem.index >= users.length - 1) {
      loadTriggeredForCount.current = users.length;
      onLoadMore();
    }
  }, [virtualItems.length, users.length, hasMore, isLoading, onLoadMore]);

  if (users.length === 0 && !isLoading) {
    return <div className="text-center py-8 text-gray-500">No users found</div>;
  }

  return (
    <>
      <div ref={parentRef} className="h-screen overflow-auto">
        <div
          className="w-full relative"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualItems.map((virtualRow) => {
            const user = users[virtualRow.index];
            if (!user) return null;

            return (
              <div
                key={virtualRow.key}
                className="absolute top-0 left-0 w-full pb-3"
                style={{
                  height: virtualRow.size,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <UserCard user={user} />
              </div>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-4 text-gray-500">Loading...</div>
      )}
    </>
  );
}
