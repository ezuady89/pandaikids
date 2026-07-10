import Link from "next/link";

import type { LearningWorld } from "@/types";

interface WorldCardProps {
  index: number;
  world: LearningWorld;
}

export function WorldCard({ index, world }: WorldCardProps) {
  return (
    <Link
      className="world-card reveal visible"
      href={`/world/${world.id}`}
      aria-label={`Teroka ${world.name}`}
      style={{ background: world.color }}
    >
      <span className="world-number">
        Dunia {String(index + 1).padStart(2, "0")} · {world.tag}
      </span>
      <span className="world-icon" aria-hidden="true">
        {world.icon}
      </span>
      <h3>{world.name}</h3>
      <p>{world.description}</p>
      <span className="world-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
