import { useState, useCallback, useEffect, useRef } from "react";
import {
  submitJob,
  createSocketConnection,
  type SocketConnection,
} from "./queue.endpoints";
import type { JobState } from "shared";

type UseQueueReturn = {
  jobs: JobState[];
  isConnected: boolean;
  submit: (payload?: unknown) => Promise<void>;
  clearAll: () => void;
};

export function useQueue(): UseQueueReturn {
  const [jobs, setJobs] = useState<JobState[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<SocketConnection | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const socket = createSocketConnection(
      // On job result
      (event) => {
        setJobs((prev) =>
          prev.map((job) =>
            job.requestId === event.requestId
              ? {
                  ...job,
                  status: "completed",
                  result: event.result,
                  processedAt: event.processedAt,
                }
              : job
          )
        );
      },
      // On connect
      () => setIsConnected(true),
      // On disconnect
      () => setIsConnected(false),
      // On error
      (error) => {
        console.error("Socket error:", error);
        setIsConnected(false);
      }
    );

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Submit a new job
  const submit = useCallback(async (payload?: unknown) => {
    try {
      const response = await submitJob(payload);

      // Add job to state as pending
      const newJob: JobState = {
        requestId: response.requestId,
        status: "pending",
        queuedAt: response.queuedAt,
      };

      setJobs((prev) => [...prev, newJob]);
    } catch (error) {
      console.error("Failed to submit job:", error);
      throw error;
    }
  }, []);

  // Clear all jobs
  const clearAll = useCallback(() => {
    setJobs([]);
  }, []);

  return {
    jobs,
    isConnected,
    submit,
    clearAll,
  };
}
