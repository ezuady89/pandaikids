"use client";

import { useEffect } from "react";

type ClickAction = "MANUAL" | "AI" | "READY";

export function trackWebsiteClick(action: ClickAction) {
  fetch("/api/analytics/click/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, path: window.location.pathname }),
    keepalive: true,
  }).catch(() => undefined);
}

export function ClickTracker() {
  useEffect(() => {
    const track = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-track-click]") : null;
      const action = target?.dataset.trackClick as ClickAction | undefined;
      if (action) trackWebsiteClick(action);
    };
    document.addEventListener("click", track);
    return () => document.removeEventListener("click", track);
  }, []);

  return null;
}
