import Image from "next/image";

import { getPandiPoseSrc, type PandiPose } from "@/lib/pandi-assets";

type LivingPandiLayer = "body" | "head" | "rightArm" | "eyesOpen" | "eyesClosed";

interface LivingPandiLayers {
  body?: string;
  eyesClosed?: string;
  eyesOpen?: string;
  head?: string;
  rightArm?: string;
}

interface LivingPandiProps {
  alt?: string;
  className?: string;
  layers?: LivingPandiLayers;
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

const layerOrder: LivingPandiLayer[] = [
  "body",
  "head",
  "rightArm",
  "eyesOpen",
  "eyesClosed"
];

export function LivingPandi({
  alt,
  className = "",
  layers,
  pose = "idle",
  priority = false,
  sizes = "(max-width: 680px) 74vw, 570px"
}: LivingPandiProps) {
  const hasLayeredPandi =
    Boolean(layers?.body) && Boolean(layers?.head ?? layers?.rightArm);

  return (
    <div
      className={`living-pandi living-pandi--${pose} ${className}`.trim()}
      data-layered={hasLayeredPandi ? "true" : "false"}
      data-pandi-pose={pose}
    >
      {hasLayeredPandi ? (
        <div className="living-pandi__stage" aria-label={alt ?? defaultAltByPose[pose]}>
          {layerOrder.map((layerName) => {
            const layerSrc = layers?.[layerName];

            if (!layerSrc) return null;

            return (
              <Image
                alt=""
                aria-hidden="true"
                className={`living-pandi__layer living-pandi__layer--${layerName}`}
                fill
                key={layerName}
                sizes={sizes}
                src={layerSrc}
              />
            );
          })}
        </div>
      ) : (
        <Image
          alt={alt ?? defaultAltByPose[pose]}
          className="living-pandi__fallback"
          height={1400}
          priority={priority}
          sizes={sizes}
          src={getPandiPoseSrc(pose)}
          width={1400}
        />
      )}
      <span className="living-pandi__blink" aria-hidden="true" />
      <span className="living-pandi__wave" aria-hidden="true" />
    </div>
  );
}
