import Image from "next/image";

import { getPandiPoseSrc, type PandiPose } from "@/lib/pandi-assets";

interface MascotImageProps {
  alt?: string;
  className?: string;
  pose?: PandiPose;
  priority?: boolean;
  sizes?: string;
}

export function MascotImage({
  alt = "Pandi",
  className,
  pose = "wave",
  priority = false,
  sizes = "(max-width: 680px) 150px, 230px"
}: MascotImageProps) {
  return (
    <Image
      alt={alt}
      className={className}
      height={1254}
      priority={priority}
      sizes={sizes}
      src={getPandiPoseSrc(pose)}
      width={1254}
    />
  );
}
