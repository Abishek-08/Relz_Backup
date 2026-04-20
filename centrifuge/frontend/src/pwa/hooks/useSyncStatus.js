import { useEffect, useState } from "react";
import { flushQueue } from "../queue/apiQueue";

const SyncStatus = {
  IDLE: "idle",
  OFFLINE: "offline",
  SYNCING: "syncing",
  SYNCED: "synced",
  FAILED: "failed",
};

export function useSyncStatus() {
  const [state, setState] = useState({ status: SyncStatus.IDLE });

  useEffect(() => {
    // Initial check
    if (!navigator.onLine) {
      setState({ status: SyncStatus.OFFLINE });
    } else {
      setState({ status: SyncStatus.IDLE });
    }

    const handleOnline = () => {
      // setState({ status: SyncStatus.SYNCING });
      setState({ status: SyncStatus.IDLE });
      flushQueue(setState);
    };

    const handleOffline = () => {
      setState({ status: SyncStatus.OFFLINE });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  console.log("status: ", state);
  return state;
}
