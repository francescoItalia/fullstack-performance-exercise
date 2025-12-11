type TagProps = {
  children: string;
  onRemove?: () => void;
};

export function Tag({ children, onRemove }: TagProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-sm">
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:text-indigo-900 focus:outline-none"
          aria-label={`Remove ${children}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

