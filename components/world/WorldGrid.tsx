import { WorldCard } from "@/components/world/WorldCard";
import { learningWorlds } from "@/data/worlds";

export function WorldGrid() {
  return (
    <div className="world-grid" aria-live="polite">
      {learningWorlds.map((world, index) => (
        <WorldCard index={index} key={world.id} world={world} />
      ))}
    </div>
  );
}
