import type { ReactNode } from "react";

type PageWithSidebarTemplateProps = {
  header: ReactNode;
  sidebar: ReactNode;
  content: ReactNode;
};

export function PageWithSidebarTemplate({
  header,
  sidebar,
  content,
}: PageWithSidebarTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        {header}
      </header>

      {/* Main layout */}
      <div className="flex max-w-7xl mx-auto px-6 py-6 gap-6">
        {/* Sidebar */}
        <div className="flex-shrink-0">{sidebar}</div>

        {/* Content */}
        <main className="flex-1 min-w-0">{content}</main>
      </div>
    </div>
  );
}
