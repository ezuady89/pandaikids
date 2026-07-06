import Image from "next/image";

import { withBasePath } from "@/lib/paths";

interface MascotImageProps {
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function MascotImage({
  alt = "Pandi",
  className,
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
      src={withBasePath("/assets/mascot/pandi-master.png")}
      width={1254}
    />
  );
}
