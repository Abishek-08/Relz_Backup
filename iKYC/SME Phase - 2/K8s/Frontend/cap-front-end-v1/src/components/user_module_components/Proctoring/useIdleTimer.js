import { useState, useEffect, useRef, useCallback } from "react";

const useIdleTimer = (timeout = 3000, setOpen) => {
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    setIsIdle(false);
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
      setOpen(true); // Open the modal when idle
    }, timeout);
  }, [timeout, setOpen]);

  useEffect(() => {
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("click", resetIdleTimer);

    resetIdleTimer();

    return () => {
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("click", resetIdleTimer);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [resetIdleTimer]);

  return { isIdle };
};

export default useIdleTimer;
