# Fullstack Performance Exercise

A full-stack JavaScript/TypeScript application showcasing modern web development practices with React, Express, and performance optimization techniques.

## About

This repository demonstrates fullstack JavaScript capabilities through a series of exercises focused on performance, scalability, and best practices.

### Exercise 1: Paginated User List with Virtual Scroll ✅

### Exercise 2: HTTP Streaming Strategies ✅

Demonstrates three different approaches to streaming data from server to client, each with unique characteristics:

| Method | Content-Type | Format | Use Case |
|--------|-------------|--------|----------|
| **Raw HTTP Chunked** | `text/plain` | Character-by-character | Simple text streaming |
| **NDJSON** | `application/x-ndjson` | One JSON object per line | Structured data streaming |
| **SSE** | `text/event-stream` | Event-based with typed listeners | ChatGPT-style streaming |

Each demo simulates an LLM response with:
- `message_start` event with metadata (model, message_id)
- `delta` events with content chunks
- `message_complete` event with usage stats

### Exercise 3: Queue Processing with Web Workers & Socket.IO ✅

Demonstrates asynchronous job processing with real-time updates:

- **HTTP POST** submits jobs to a server-side queue (server generates `requestId`)
- **Worker Thread** processes jobs with a 2-second delay
- **Socket.IO** broadcasts results to all connected clients in real-time

Architecture: Client → HTTP API → Queue → Worker Thread → Socket.IO → Client

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

### Testing

```bash
# Run all server tests
cd server && yarn test

# Run tests in watch mode
cd server && yarn test:watch

# Generate coverage report
cd server && yarn test:coverage
```

**Test Coverage:**
- **Unit Tests**: Service layer (users)
- **Integration Tests**: HTTP routes (users, stream, queue)
- **Total**: 63 tests covering all endpoints

Tests use Jest with TypeScript ESM support. Streaming tests mock delays for fast execution.

---

## Project Structure

```
├── shared/                 # Shared TypeScript types
│   └── src/
│       ├── entities/       # Domain entities (User)
│       ├── api/            # API request/response types
│       │   ├── users/      # User-related API types
│       │   ├── stream/     # Streaming event types
│       │   └── queue/      # Queue/WebSocket event types
│       └── common/         # Shared utilities (Pagination)
│
├── server/                 # Express backend
│   └── src/
│       ├── app.ts          # Express app setup
│       ├── server.ts       # Server entry point
│       ├── users/          # User domain
│       │   ├── user.controller.ts
│       │   ├── user.service.ts
│       │   ├── user.db.ts
│       │   ├── user.routes.ts
│       │   └── __tests__/  # Unit & integration tests
│       ├── stream/         # Streaming endpoints
│       │   ├── stream.controller.ts
│       │   ├── stream.service.ts
│       │   ├── stream.routes.ts
│       │   ├── stream.utils.ts
│       │   └── __tests__/  # Integration tests
│       ├── queue/          # Queue processing
│       │   ├── queue.controller.ts
│       │   ├── queue.service.ts
│       │   ├── queue.worker.ts
│       │   ├── queue.routes.ts
│       │   └── __tests__/  # Integration tests
│       └── websocket/      # Socket.IO
│           └── ws.service.ts
│
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── api/            # API layer
│       │   ├── apiClient.ts        # Fetch wrapper
│       │   ├── queryKeys.ts        # React Query key factory
│       │   ├── users/              # User API hooks & endpoints
│       │   ├── stream/             # Streaming hooks & endpoints
│       │   └── queue/              # Queue API + Socket.IO hooks
│       ├── components/
│       │   ├── atoms/              # Basic UI elements (Badge, Input, etc.)
│       │   ├── molecules/          # Composite components (PageTitle, InfoBox)
│       │   ├── templates/          # Page layouts (Header, PageTemplate)
│       │   └── pages/              # Page components (colocated structure)
│       │       ├── usersPage/
│       │       │   ├── UsersPage.tsx
│       │       │   └── components/   # Page-specific components
│       │       ├── streamsPage/
│       │       │   ├── StreamsPage.tsx
│       │       │   └── components/
│       │       └── queuesPage/
│       │           ├── QueuesPage.tsx
│       │           └── components/
│       ├── hooks/          # Custom React hooks
│       └── routes.ts       # Centralized route config
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
- **Streaming API**:
  - `GET /api/stream/raw-http-chunked` - Raw text streaming
  - `GET /api/stream/ndjson` - NDJSON structured streaming
  - `GET /api/stream/sse` - Server-Sent Events (ChatGPT-style)
- **Queue API**:
  - `POST /api/queue/submit` - Submit job (returns 202 with server-generated requestId)
  - `GET /api/queue/status` - Queue status (for monitoring)
  - Socket.IO `job_result` event - Broadcasts completed job results

### Frontend (React + TypeScript)

- **Atomic Design** with colocated page components:
  - `atoms/` - Basic UI elements (shared)
  - `molecules/` - Composite components (shared)
  - `templates/` - Page layouts (shared)
  - `pages/*/components/` - Page-specific components (colocated)
- **TanStack Query**: Data fetching with caching, infinite queries
- **TanStack Virtual**: Virtual scrolling for performance
- **Socket.IO Client**: Real-time WebSocket communication
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
| Testing  | Jest, ts-jest, Supertest                        |
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

---

## Streaming API Reference

### GET /api/stream/raw-http-chunked

Streams raw text character-by-character using `Transfer-Encoding: chunked`.

**Content-Type:** `text/plain`

### GET /api/stream/ndjson

Streams structured events as Newline Delimited JSON.

**Content-Type:** `application/x-ndjson`

**Format:**
```
{"type":"message_start","message_id":"msg_abc","model":"mock-gpt-1","created_at":1234567890}
{"type":"delta","delta":{"content":"Hello"},"index":0}
{"type":"delta","delta":{"content":" world"},"index":1}
{"type":"message_complete","finish_reason":"stop","usage":{"completion_tokens":2,"total_tokens":2}}
```

### GET /api/stream/sse

Streams events using Server-Sent Events (the protocol ChatGPT uses).

**Content-Type:** `text/event-stream`

**Format:**
```
event: message_start
data: {"message_id":"msg_abc","model":"mock-gpt-1","created_at":1234567890}

event: delta
data: {"delta":{"content":"Hello"},"index":0}

event: message_complete
data: {"finish_reason":"stop","usage":{"completion_tokens":2,"total_tokens":2}}

data: [DONE]
```

---

## Queue API Reference

### POST /api/queue/submit

Submit a job to the processing queue. Server generates the `requestId`.

**Request:**
```json
{
  "payload": { "message": "any data" }
}
```

**Response (202 Accepted):**
```json
{
  "status": "pending",
  "requestId": "uuid-generated-by-server",
  "queuedAt": 1234567890
}
```

### Socket.IO: job_result Event

When a job completes, the server broadcasts to all connected clients:

```json
{
  "requestId": "uuid-generated-by-server",
  "result": "Processed job with payload: {...}",
  "processedAt": 1234567892
}
```

