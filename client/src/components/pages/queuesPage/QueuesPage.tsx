import { useState } from "react";
import { PageTemplate } from "@components/templates";
import { PageTitle, InfoBox } from "@components/molecules";
import { useQueue } from "@api/queue";
import { QueueControls, JobList } from "./components";
import { QUEUES_PAGE } from "./queues.constants";

/**
 * Queue demo page showcasing async job processing with Socket.IO.
 *
 * Exercise 3: Web Worker + WebSocket (Socket.IO)
 * - Submit jobs via HTTP POST (server generates requestId)
 * - Jobs are queued and processed in a worker thread
 * - Results are pushed via Socket.IO
 */
export function QueuesPage() {
  const { jobs, isConnected, submit, clearAll } = useQueue();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submit({ message: `Job submitted at ${new Date().toISOString()}` });
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitBatch = async () => {
    setIsSubmitting(true);
    try {
      const promises = Array.from({ length: 20 }, () =>
        submit({ message: `Job submitted at ${new Date().toISOString()}` })
      );
      await Promise.all(promises);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = jobs.filter((j) => j.status === "pending").length;
  const completedCount = jobs.filter((j) => j.status === "completed").length;

  return (
    <PageTemplate maxWidth="4xl">
      <PageTitle
        title={QUEUES_PAGE.TITLE}
        description={QUEUES_PAGE.DESCRIPTION}
      />

      <QueueControls
        isConnected={isConnected}
        isSubmitting={isSubmitting}
        pendingCount={pendingCount}
        completedCount={completedCount}
        hasJobs={jobs.length > 0}
        onSubmit={handleSubmit}
        onSubmitBatch={handleSubmitBatch}
        onClearAll={clearAll}
      />

      <JobList jobs={jobs} />

      <InfoBox
        title={QUEUES_PAGE.ABOUT_TITLE}
        description={QUEUES_PAGE.ABOUT_DESCRIPTION}
      />
    </PageTemplate>
  );
}
