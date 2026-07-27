"use client";

import { useEffect, useState } from "react";

const UPKK_TARGET = new Date("2026-11-02T00:00:00+08:00").getTime();
const DAY_MS = 24 * 60 * 60 * 1000;

function daysUntilUpkk() {
  const remaining = UPKK_TARGET - Date.now();
  return remaining > 0 ? Math.ceil(remaining / DAY_MS) : null;
}

export default function UrgencyStrip() {
  const [days, setDays] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const update = () => setDays(daysUntilUpkk());
    update();
    setMounted(true);

    const timer = window.setInterval(update, DAY_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="urgency-strip" role="status" aria-live="polite">
      {!mounted
        ? "UPKK bertulis 2 Nov 2026"
        : days === null
          ? "UPKK bertulis sedang berlangsung"
        : `UPKK bertulis 2 Nov 2026 • ${days} hari lagi`}
    </div>
  );
}
