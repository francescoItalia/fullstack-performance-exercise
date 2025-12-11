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
      {/* Header — aligned with content via same max-w container */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">{header}</div>
      </header>

      {/* Main layout: stack on mobile, side-by-side on desktop */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar: full width on mobile, auto width on desktop */}
          <aside className="w-full lg:w-auto flex-shrink-0">{sidebar}</aside>

          {/* Content */}
          <main className="flex-1 min-w-0">{content}</main>
        </div>
      </div>
    </div>
  );
}
