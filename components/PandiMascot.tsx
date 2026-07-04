type PandiMascotProps = {
  mood?: "main" | "wave" | "happy" | "excited" | "focus" | "think" | "sad" | "surprised" | "goodjob";
  className?: string;
};

const moodMap: Record<NonNullable<PandiMascotProps["mood"]>, string> = {
  main: "/pandi-main.png",
  wave: "/pandi-wave.png",
  happy: "/pandi-happy.png",
  excited: "/pandi-excited.png",
  focus: "/pandi-focus.png",
  think: "/pandi-think.png",
  sad: "/pandi-sad.png",
  surprised: "/pandi-surprised.png",
  goodjob: "/pandi-goodjob.png",
};

export function PandiMascot({ mood = "main", className = "" }: PandiMascotProps) {
  return <img className={className} src={moodMap[mood]} alt="Pandi mascot" />;
}

export function PandaMascot({ mood = "main", className = "" }: PandiMascotProps) {
  return <PandiMascot mood={mood} className={className} />;
}
