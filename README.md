# Fullstack Performance Exercise

A full-stack JavaScript/TypeScript application showcasing modern web development practices with React, Express, and performance optimization techniques.

## About

This repository demonstrates fullstack JavaScript capabilities through a series of exercises focused on performance, scalability, and best practices.

### Exercise 1: Paginated User List with Virtual Scroll ✅

### Exercise 2: TBD

### Exercise 3: TBD

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- Yarn

### Installation

```bash
# Install dependencies for all workspaces
yarn install
```

### Development

```bash
# Start both client and server in development mode
yarn dev
```

This will:
1. Build the shared types package
2. Start the Express server on `http://localhost:3000`
3. Start the Vite dev server on `http://localhost:5173`

### Individual Commands

```bash
# Build shared types
yarn build:shared

# Start only the server
yarn workspace fullstack-performance-server dev

# Start only the client
yarn workspace fullstack-performance-client dev
```

---

## Project Structure

```
├── shared/                 # Shared TypeScript types
│   └── src/
│       ├── entities/       # Domain entities (User)
│       ├── api/            # API request/response types
│       │   └── users/      # User-related API types
│       └── common/         # Shared utilities (Pagination)
│
├── server/                 # Express backend
│   └── src/
│       ├── app.ts          # Express app setup
│       ├── server.ts       # Server entry point
│       └── users/          # User domain
│           ├── user.controller.ts  # HTTP handlers
│           ├── user.service.ts     # Business logic
│           ├── user.db.ts          # Data access (mock DB)
│           └── user.routes.ts      # Route definitions
│
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── api/            # API layer
│       │   ├── apiClient.ts        # Fetch wrapper
│       │   ├── queryKeys.ts        # React Query key factory
│       │   └── users/              # User API hooks & endpoints
│       ├── components/     # Atomic Design structure
│       │   ├── atoms/      # Basic UI elements
│       │   ├── molecules/  # Composite components
│       │   ├── organisms/  # Complex components
│       │   ├── templates/  # Page layouts
│       │   └── pages/      # Page components
│       └── hooks/          # Custom React hooks
│
├── package.json            # Root workspace config
├── tsconfig.json           # Root TypeScript config
└── lerna.json              # Lerna monorepo config
```

---

## Architecture

### Backend (Express + TypeScript)

- **Layered Architecture**: Controller → Service → DB
- **Mock Database**: In-memory data with Faker.js, designed for easy migration to real DB
- **RESTful API**:
  - `GET /api/users` - Paginated users with search/filter
  - `GET /api/users/metadata` - Top hobbies and nationalities for filters

### Frontend (React + TypeScript)

- **Atomic Design**: Components organized by complexity (atoms → pages)
- **TanStack Query**: Data fetching with caching, infinite queries
- **TanStack Virtual**: Virtual scrolling for performance
- **Tailwind CSS**: Utility-first styling

### Shared Types

- TypeScript types shared between client and server
- Built as a workspace dependency
- Ensures type safety across the stack

---

## Tech Stack

| Layer    | Technology                                      |
|----------|------------------------------------------------|
| Frontend | React 19, Vite, TanStack Query, TanStack Virtual |
| Backend  | Express 5, TypeScript, ts-node                  |
| Styling  | Tailwind CSS 4                                  |
| Monorepo | Yarn Workspaces, Lerna                          |
| Types    | Shared TypeScript workspace                     |

---

## API Reference

### GET /api/users

Fetch paginated users with optional filters.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `search` | string | - | Search by first/last name |
| `hobbies` | string | - | Comma-separated hobbies filter |
| `nationalities` | string | - | Comma-separated nationalities filter |

**Response:**
```json
{
  "items": [...],
  "page": 1,
  "limit": 20,
  "total": 1000,
  "hasMore": true
}
```

### GET /api/users/metadata

Fetch top 20 hobbies and nationalities for filter options.

**Response:**
```json
{
  "hobbies": ["coding", "music", ...],
  "nationalities": ["United States", "Germany", ...]
}
```

