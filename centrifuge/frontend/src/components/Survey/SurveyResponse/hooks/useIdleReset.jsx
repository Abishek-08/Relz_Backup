
import { useEffect, useRef } from "react";

export function useIdleReset({ enabled = true, timeoutMs = 60000, onIdle }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onIdle?.();
      }, timeoutMs);
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));

    resetTimer();
    return () => {
      clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [enabled, timeoutMs, onIdle]);
}
