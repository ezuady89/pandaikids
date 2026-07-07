import Image from "next/image";

import { withBasePath } from "@/lib/paths";
import type { LearnerProfile } from "@/types";

interface PandiTeacherProps {
  completedQuestions?: number;
  message: string;
  profile: LearnerProfile;
  mood?: "guide" | "teacher" | "celebrate";
}

export function PandiTeacher({
  completedQuestions = 0,
  message,
  mood = "guide",
  profile
}: PandiTeacherProps) {
  const pandiScene = profile.stateSlug
    ? `/assets/states/pandi/${profile.stateSlug}.webp`
    : "/assets/states/pandi/default.webp";
  const accessory =
    mood === "teacher"
      ? "👓"
      : mood === "celebrate"
        ? "🎉"
        : completedQuestions >= 8
          ? "🧢"
          : completedQuestions >= 4
            ? "🎒"
            : "🌿";

  return (
    <aside className={`pandi-teacher ${mood} reward-${completedQuestions}`}>
      <div className="pandi-scene-preview">
        <Image
          alt="Pandi membimbing pembelajaran"
          fill
          priority
          sizes="(max-width: 680px) 150px, 300px"
          src={withBasePath(pandiScene)}
        />
        <span className="pandi-accessory" aria-hidden="true">
          {accessory}
        </span>
        {completedQuestions >= 4 ? (
          <span className="pandi-earned-item item-backpack" aria-hidden="true">
            🎒
          </span>
        ) : null}
        {completedQuestions >= 8 ? (
          <span className="pandi-earned-item item-hat" aria-hidden="true">
            🧢
          </span>
        ) : null}
      </div>
      <div className="pandi-teacher-bubble">
        <span>{mood === "teacher" ? "Pandi ajar" : "Pandi kata"}</span>
        <p>{message}</p>
      </div>
    </aside>
  );
}
