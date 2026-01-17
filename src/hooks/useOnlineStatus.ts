"use client";

import { useState, useEffect } from "react";
import { useSyncStore } from "@/stores";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const setStoreOnline = useSyncStore((state) => state.setIsOnline);
  const processQueue = useSyncStore((state) => state.processQueue);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      setStoreOnline(online);

      if (online) {
        processQueue();
      }
    };

    setIsOnline(navigator.onLine);
    setStoreOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [setStoreOnline, processQueue]);

  return isOnline;
}
