import Image from "next/image";

import { getPandiPoseSrc, type PandiPose } from "@/lib/pandi-assets";

interface PandiTeacherProps {
  completedQuestions?: number;
  message: string;
  pose?: PandiPose;
  mood?: "guide" | "teacher" | "celebrate";
}

export function PandiTeacher({
  completedQuestions = 0,
  message,
  mood = "guide",
  pose
}: PandiTeacherProps) {
  const pandiPose =
    pose ??
    (mood === "teacher"
      ? "teacher"
      : mood === "celebrate"
        ? "celebrate"
        : completedQuestions >= 8
          ? "explorer"
          : "thinking");
  const poseLabel =
    mood === "teacher"
      ? "Mengajar"
      : mood === "celebrate"
        ? "Bertepuk"
        : completedQuestions >= 8
          ? "Meneroka"
          : completedQuestions >= 4
            ? "Melambai"
            : "Menunggu";

  return (
    <aside className={`pandi-teacher ${mood} reward-${completedQuestions}`}>
      <div className="pandi-scene-preview">
        <Image
          alt="Pandi membimbing pembelajaran"
          fill
          priority
          sizes="(max-width: 680px) 150px, 300px"
          src={getPandiPoseSrc(pandiPose)}
        />
        <span className="pandi-pose-badge" aria-hidden="true">
          {poseLabel}
        </span>
      </div>
      <div className="pandi-teacher-bubble">
        <span>{mood === "teacher" ? "Pandi ajar" : "Pandi kata"}</span>
        <p>{message}</p>
      </div>
    </aside>
  );
}
