import type { ComponentType } from "react";

/**
 * Centralized route configuration.
 * Single source of truth for all app routes.
 */

// Route paths as constants
export const ROUTES = {
  HOME: "/",
  USERS: "/users",
  STREAMS: "/streams",
} as const;

// Type for route paths
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

// Navigation items for header/sidebar
export type NavItem = {
  to: RoutePath;
  label: string;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { to: ROUTES.USERS, label: "Users" },
  { to: ROUTES.STREAMS, label: "Streams" },
] as const;

// Route config for React Router (lazy-loadable)
export type RouteConfig = {
  path: RoutePath;
  label: string;
  Component: ComponentType;
};
