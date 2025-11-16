"use client";
import { useEffect, useRef } from "react";

export function usePolling(callback, interval) {
  const savedCallback = useRef();
  const intervalId = useRef(null);

  useEffect(() => {
    savedCallback.current = callback;
  });

  const startPolling = () => {
    if (intervalId.current) return; 
    const tick = () => savedCallback.current();
    tick(); 
    intervalId.current = setInterval(tick, interval);
  };

  const stopPolling = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  useEffect(() => {
    if (!interval) return;

    startPolling();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [interval]);
}
