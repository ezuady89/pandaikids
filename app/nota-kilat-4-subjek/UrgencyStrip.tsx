"use client";

import { useEffect, useState } from "react";

const UPKK_DATE_UTC = Date.UTC(2026, 10, 2);
const DAY_MS = 86_400_000;

function getMalaysiaDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  return Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
  );
}

function getDaysUntilUpkk() {
  const remainingDays = Math.floor((UPKK_DATE_UTC - getMalaysiaDate()) / DAY_MS);
  return remainingDays > 0 ? remainingDays : null;
}

export default function UrgencyStrip() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setDaysLeft(getDaysUntilUpkk());
    update();

    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="urgency-strip" aria-live="polite">
      {daysLeft === null
        ? "UPKK 2 Nov 2026"
        : `UPKK 2 Nov 2026 • ${daysLeft} hari lagi`}
    </div>
  );
}
