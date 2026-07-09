import { withBasePath } from "@/lib/paths";

export type PandiPose =
  | "idle"
  | "wave"
  | "happy"
  | "teacher"
  | "thinking"
  | "celebrate"
  | "reading"
  | "explorer"
  | "flag"
  | "blindbox";

const PANDI_POSE_FILES: Record<PandiPose, string> = {
  idle: "/assets/pandi/pandi-happy.png",
  wave: "/assets/pandi/pandi-wave.png",
  happy: "/assets/pandi/pandi-happy.png",
  teacher: "/assets/pandi/pandi-teacher.png",
  thinking: "/assets/pandi/pandi-thinking.png",
  celebrate: "/assets/pandi/pandi-celebrate.png",
  reading: "/assets/pandi/pandi-reading.png",
  explorer: "/assets/pandi/pandi-explorer.png",
  flag: "/assets/pandi/pandi-flag.png",
  blindbox: "/assets/pandi/pandi-blindbox.png"
};

export function getPandiPoseSrc(pose: PandiPose): string {
  return withBasePath(PANDI_POSE_FILES[pose]);
}
