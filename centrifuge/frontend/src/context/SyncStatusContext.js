// SyncStatusContext.js (no JSX here)
import { createContext, useContext } from "react";

export const SyncStatusContext = createContext(null);

export function useSyncStatusContext() {
  const context = useContext(SyncStatusContext);
  if (context === null) {
    throw new Error(
      "useSyncStatusContext must be used within SyncStatusProvider",
    );
  }
  return context;
}
