import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS, ROUTES } from "../../routes";

type HeaderProps = {
  /** Optional page-specific content (e.g., search box) */
  children?: ReactNode;
};

/**
 * Site header with navigation.
 * Fixed width (max-w-7xl) across all pages for consistent nav positioning.
 */
export function Header({ children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center gap-6">
          {/* Logo / Brand */}
          <NavLink
            to={ROUTES.HOME}
            className="text-xl font-bold text-gray-900 flex-shrink-0"
          >
            App
          </NavLink>

          {/* Navigation */}
          <nav className="flex items-center gap-6 flex-shrink-0">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-indigo-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Page-specific content */}
          {children && <div className="flex-1">{children}</div>}
        </div>
      </div>
    </header>
  );
}
