import Link from "next/link";

import type { LearningWorld } from "@/types";

const zoneIcons = ["✦", "◆", "●", "▲", "★"] as const;

interface ZoneCardProps {
  index: number;
  name: string;
  world: LearningWorld;
}

export function ZoneCard({ index, name, world }: ZoneCardProps) {
  const locked = index > 1;

  return (
    <article className={`zone-card${locked ? " locked" : ""}`}>
      {locked && (
        <span className="lock-badge" aria-label="Belum dibuka">
          🔒
        </span>
      )}
      <div className="zone-icon" aria-hidden="true">
        {zoneIcons[index]}
      </div>
      <span className="world-number">Kawasan {index + 1}</span>
      <h3>{name}</h3>
      <p>
        {index === 0
          ? "Permulaan yang seronok bersama Pandi."
          : "Cabaran baharu menanti selepas kawasan sebelumnya."}
      </p>
      {locked ? (
        <span className="button button-soft">Belum dibuka</span>
      ) : (
        <Link className="button button-primary" href={`/games/${world.gameId}`}>
          {index === 0 ? "Mula" : "Teruskan"} →
        </Link>
      )}
    </article>
  );
}
