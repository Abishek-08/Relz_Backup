// SyncStatusProvider.jsx
import { SyncStatusContext } from "./SyncStatusContext";
import { useSyncStatus } from "../pwa/hooks/useSyncStatus";

export function SyncStatusProvider({ children }) {
  const syncStatus = useSyncStatus();

  return (
    <SyncStatusContext.Provider value={syncStatus}>
      {children}
    </SyncStatusContext.Provider>
  );
}
