"use client";

import { useEffect, useState } from "react";
import styles from "./landing.module.css";

const PROMO_END_MS = Date.parse("2026-07-26T23:59:59+08:00");
type TimeLeft = { days: number; hours: number; minutes: number; seconds: number; ended: boolean };

function getTimeLeft(): TimeLeft {
  const remaining = Math.max(0, PROMO_END_MS - Date.now());
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
    ended: remaining === 0,
  };
}

const initialTime: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, ended: false };

export default function PromoCountdown() {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const firstUpdate = getTimeLeft();
    setTimeLeft(firstUpdate);
    if (firstUpdate.ended) return;

    const intervalId = window.setInterval(() => {
      const nextTime = getTimeLeft();
      setTimeLeft(nextTime);
      if (nextTime.ended) window.clearInterval(intervalId);
    }, 1_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const units = [[timeLeft.days, "Hari"], [timeLeft.hours, "Jam"], [timeLeft.minutes, "Minit"], [timeLeft.seconds, "Saat"]] as const;
  return (
    <aside className={styles.promoCountdown} aria-live="polite">
      <strong className={styles.promoCountdownTitle}>🔥 PROMOSI 3 HARI SAHAJA</strong>
      <span className={styles.promoCountdownLabel}>{timeLeft.ended ? "Promosi telah tamat" : "Tawaran tamat dalam:"}</span>
      <div className={styles.promoCountdownUnits}>
        {units.map(([value, label], index) => (
          <span className={styles.promoCountdownUnit} key={label}>
            <b>{String(value).padStart(2, "0")}</b><small>{label}</small>
            {index < units.length - 1 && <i aria-hidden="true">:</i>}
          </span>
        ))}
      </div>
    </aside>
  );
}
