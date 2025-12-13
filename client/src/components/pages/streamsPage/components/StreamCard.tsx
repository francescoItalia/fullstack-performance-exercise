import type { ReactNode } from "react";

type StreamCardProps = {
  title: string;
  description: string;
  badge: string;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Reusable card component for streaming demos.
 * Provides consistent layout for title, description, content area, and controls.
 */
export function StreamCard({
  title,
  description,
  badge,
  children,
  footer,
}: StreamCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 flex-shrink-0">
            {badge}
          </span>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 p-4 overflow-hidden">{children}</div>

      {/* Footer with controls */}
      {footer && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">{footer}</div>
      )}
    </div>
  );
}
