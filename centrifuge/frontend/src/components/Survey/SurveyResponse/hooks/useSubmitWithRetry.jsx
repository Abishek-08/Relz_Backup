
import { useEffect, useRef } from "react";

/**
 * Queues submission when offline and retries with backoff.
 * Keeps your endpoint + body unchanged. Uses your axiosInstance.
 */
export function useSubmitWithRetry({ endpoint, axiosInstance, onFlushRef }) {
  const queueRef = useRef([]);

  useEffect(() => {
    const onOnline = () => flushQueue();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);

  async function flushQueue() {
    while (queueRef.current.length) {
      const job = queueRef.current[0];
      try {
        await axiosInstance.post(endpoint, job.body);
        queueRef.current.shift();
      } catch (e) {
        // stop on first failure to respect backoff window
        break;
      }
    }
  }

  // expose flushing
  if (onFlushRef) onFlushRef.current = flushQueue;

  return async function submit(body) {
    // if offline, enqueue
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      queueRef.current.push({ body, ts: Date.now() });
      return;
    }

    // try immediate
    try {
      await axiosInstance.post(endpoint, body);
    } catch (e) {
      // enqueue and try later
      queueRef.current.push({ body, ts: Date.now() });
      throw e;
    }
  };
}
