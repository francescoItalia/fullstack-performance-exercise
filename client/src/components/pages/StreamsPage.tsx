import { Header } from "../templates";
import { RawStreamDemo } from "../organisms";

/**
 * Streams demo page showcasing different HTTP streaming strategies.
 *
 * Layout:
 * - Mobile: Single column, full width cards
 * - Tablet: 2-column grid
 * - Desktop: 3-column grid (one for each streaming method)
 *
 */
export function StreamsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Header />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Page title and description */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            HTTP Streaming Strategies
          </h1>
          <p className="mt-2 text-gray-600">
            Explore different approaches to streaming data from server to
            client. Each method has unique characteristics suited for different
            use cases.
          </p>
        </div>

        {/* Demo grid - responsive layout for 3 streaming methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Raw HTTP Chunked Demo */}
          <RawStreamDemo />

          {/* Placeholder for NDJSON Demo */}
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-400 text-xl">2</span>
              </div>
              <h3 className="font-medium text-gray-700">NDJSON Streaming</h3>
              <p className="text-sm text-gray-500 mt-1">Coming soon...</p>
            </div>
          </div>

          {/* Placeholder for SSE Demo */}
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-gray-400 text-xl">3</span>
              </div>
              <h3 className="font-medium text-gray-700">Server-Sent Events</h3>
              <p className="text-sm text-gray-500 mt-1">Coming soon...</p>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h2 className="font-semibold text-indigo-900 mb-2">
            About This Exercise
          </h2>
          <p className="text-sm text-indigo-700">
            This page demonstrates reading HTTP responses as streams and
            displaying content progressively. Each demo shows a different
            streaming protocol: raw chunked transfer, NDJSON (OpenAI-style), and
            Server-Sent Events (SSE).
          </p>
        </div>
      </main>
    </div>
  );
}
