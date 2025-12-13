import type { ReactNode } from "react";
import { Header } from "./Header";

type PageTemplateProps = {
  /** Main page content */
  children: ReactNode;
  /** Max width variant */
  maxWidth?: "4xl" | "6xl" | "7xl";
};

const maxWidthClasses = {
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
} as const;

/**
 * Template for simple pages without sidebar.
 * Provides consistent layout structure.
 */
export function PageTemplate({
  children,
  maxWidth = "7xl",
}: PageTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main
        className={`${maxWidthClasses[maxWidth]} mx-auto px-4 md:px-6 py-8`}
      >
        {children}
      </main>
    </div>
  );
}
