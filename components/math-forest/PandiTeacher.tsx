import Image from "next/image";

import { withBasePath } from "@/lib/paths";
import type { LearnerProfile } from "@/types";

interface PandiTeacherProps {
  message: string;
  profile: LearnerProfile;
  mood?: "guide" | "teacher" | "celebrate";
}

export function PandiTeacher({
  message,
  mood = "guide",
  profile
}: PandiTeacherProps) {
  const pandiScene = profile.stateSlug
    ? `/assets/states/pandi/${profile.stateSlug}.webp`
    : "/assets/states/pandi/default.webp";

  return (
    <aside className={`pandi-teacher ${mood}`}>
      <div className="pandi-scene-preview">
        <Image
          alt="Pandi membimbing pembelajaran"
          fill
          priority
          sizes="(max-width: 680px) 150px, 300px"
          src={withBasePath(pandiScene)}
        />
        <span className="pandi-accessory" aria-hidden="true">
          {mood === "teacher" ? "👓" : mood === "celebrate" ? "🎒" : "🌿"}
        </span>
      </div>
      <div className="pandi-teacher-bubble">
        <span>{mood === "teacher" ? "Pandi ajar" : "Pandi kata"}</span>
        <p>{message}</p>
      </div>
    </aside>
  );
}
