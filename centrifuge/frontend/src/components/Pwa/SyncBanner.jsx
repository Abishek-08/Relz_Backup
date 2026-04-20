import { useEffect, useState } from "react";
import { useSyncStatusContext } from "../../context/SyncStatusContext";
import { CloudAlert } from "lucide-react";

export function SyncBanner() {
  const { status } = useSyncStatusContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      setVisible(false);
      return;
    }

    setVisible(true);

    if (status === "synced") {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!visible) return null;

  const map = {
    offline: `No internet. You are in Offline-Mode.`,
    syncing: "🔄 Syncing…",
    synced: "✅ Connection Restored!",
    failed: "❌ Sync failed",
  };

  const bannerStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    padding: "4px 10px",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: status === "synced" ? "#4caf50" : "#f75252", // green for synced
    animation:
      status === "offline"
        ? "pulse 1.5s infinite"
        : status === "synced"
        ? "fadeBlink 1s ease-in-out 3" // blink 3 times
        : "none",
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
          }

          @keyframes fadeBlink {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
        `}
      </style>
      <div style={bannerStyle}>
        <CloudAlert size={18} /> {map[status]}
      </div>
    </>
  );
}
