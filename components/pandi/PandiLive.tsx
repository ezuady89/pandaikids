import Image from "next/image";

import { getPandiPoseSrc, type PandiPose } from "@/lib/pandi-assets";

interface PandiLiveProps {
  alt?: string;
  className?: string;
  pose?: PandiPose;
  priority?: boolean;
  sizes?: string;
}

const defaultAltByPose: Record<PandiPose, string> = {
  idle: "Pandi si panda sedang tersenyum",
  wave: "Pandi si panda sedang tersenyum dan melambai",
  happy: "Pandi si panda sedang gembira",
  teacher: "Pandi si panda sedang mengajar dengan lembut",
  thinking: "Pandi si panda sedang berfikir",
  celebrate: "Pandi si panda sedang meraikan kejayaan",
  reading: "Pandi si panda sedang membaca",
  explorer: "Pandi si panda bersedia untuk mengembara",
  flag: "Pandi si panda memegang bendera",
  blindbox: "Pandi si panda membuka Blind Box"
};

export function PandiLive({
  alt,
  className = "",
  pose = "idle",
  priority = false,
  sizes = "(max-width: 680px) 72vw, 520px"
}: PandiLiveProps) {
  return (
    <div
      className={`pandi-live pandi-live--${pose} ${className}`.trim()}
      data-pandi-pose={pose}
    >
      <Image
        alt={alt ?? defaultAltByPose[pose]}
        className="pandi-live__image"
        height={1254}
        priority={priority}
        sizes={sizes}
        src={getPandiPoseSrc(pose)}
        width={1254}
      />
      <span className="pandi-live__blink" aria-hidden="true" />
      <span className="pandi-live__wave" aria-hidden="true" />
    </div>
  );
}
