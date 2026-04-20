
import { useEffect, useRef } from "react";

export function useQuestionTTL({ enabled, ttlMs, watchValue, onExpire }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled || !ttlMs) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onExpire?.(), ttlMs);
    return () => clearTimeout(timerRef.current);
  }, [enabled, ttlMs, onExpire, watchValue]);
}
