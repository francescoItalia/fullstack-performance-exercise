import { PageTemplate } from "@components/templates";
import { PageTitle, InfoBox } from "@components/molecules";
import { RawStreamDemo, NDJSONStreamDemo, SSEStreamDemo } from "./components";

/**
 * Streams demo page showcasing different HTTP streaming strategies.
 *
 * Layout:
 * - Mobile: Single column, full width cards
 * - Tablet: 2-column grid
 * - Desktop: 3-column grid (one for each streaming method)
 */
export function StreamsPage() {
  return (
    <PageTemplate maxWidth="7xl">
      <PageTitle
        title="HTTP Streaming Strategies"
        description="Explore different approaches to streaming data from server to client. Each method has unique characteristics suited for different use cases."
      />

      {/* Demo grid - responsive layout for 3 streaming methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <RawStreamDemo />
        <NDJSONStreamDemo />
        <SSEStreamDemo />
      </div>

      <InfoBox
        title="About This Exercise"
        description="This page demonstrates reading HTTP responses as streams and displaying
        content progressively. Each demo shows a different streaming protocol:
        raw chunked transfer, NDJSON, and Server-Sent Events (SSE)."
      />
    </PageTemplate>
  );
}
