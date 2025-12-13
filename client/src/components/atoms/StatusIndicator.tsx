type StatusIndicatorProps = {
  status: "pending" | "completed" | "error" | "idle";
};

const statusStyles = {
  pending: "bg-amber-500",
  completed: "bg-green-500",
  error: "bg-red-500",
  idle: "bg-gray-400",
} as const;

/**
 * Status indicator dot with optional pulse animation.
 */
export function StatusIndicator({ status }: StatusIndicatorProps) {
  const baseClass = statusStyles[status];

  if (status === "pending") {
    return (
      <span className="relative flex h-3 w-3">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${baseClass} opacity-75`}
        />
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${baseClass}`}
        />
      </span>
    );
  }

  return <span className={`flex h-3 w-3 rounded-full ${baseClass}`} />;
}

