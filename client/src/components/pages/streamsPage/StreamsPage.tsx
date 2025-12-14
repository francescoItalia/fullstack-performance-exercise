import { PageTemplate } from "@components/templates";
import { PageTitle, InfoBox } from "@components/molecules";
import { RawStreamDemo, NDJSONStreamDemo, SSEStreamDemo } from "./components";
import { STREAMS_PAGE } from "./streams.constants";

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
        title={STREAMS_PAGE.TITLE}
        description={STREAMS_PAGE.DESCRIPTION}
      />

      {/* Demo grid - responsive layout for 3 streaming methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <RawStreamDemo />
        <NDJSONStreamDemo />
        <SSEStreamDemo />
      </div>

      <InfoBox
        title={STREAMS_PAGE.ABOUT_TITLE}
        description={STREAMS_PAGE.ABOUT_DESCRIPTION}
      />
    </PageTemplate>
  );
}
