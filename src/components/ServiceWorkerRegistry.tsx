"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistry() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        registration.addEventListener("updatefound", () => {
          const next = registration.installing;
          if (!next) return;
          next.addEventListener("statechange", () => {
            if (next.state === "installed" && navigator.serviceWorker.controller) {
              next.postMessage("skipWaiting");
            }
          });
        });
      } catch {
        /* registro silencioso — sw.js pode não existir em dev */
      }
    };

    register();
  }, []);

  return null;
}
