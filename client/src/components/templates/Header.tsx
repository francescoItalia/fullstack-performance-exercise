import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/users", label: "Users" },
] as const;

type HeaderProps = {
  children?: ReactNode;
};

export function Header({ children }: HeaderProps) {
  return (
    <div className="flex items-center gap-6">
      {/* Logo / Brand */}
      <NavLink to="/" className="text-xl font-bold text-gray-900 flex-shrink-0">
        Performance App
      </NavLink>

      {/* Navigation */}
      <nav className="flex items-center gap-6 flex-shrink-0">
        {navItems.map((item) => (
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

      {/* Page-specific content (e.g., SearchBox) */}
      {children && <div className="flex-1">{children}</div>}
    </div>
  );
}
