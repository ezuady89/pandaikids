import Image from "next/image";

import { getPandiPoseSrc } from "@/lib/pandi-assets";

interface RewardModalProps {
  completedQuestions: number;
  onContinue: () => void;
}

const milestoneCopy: Record<
  number,
  { title: string; text: string; reward: string }
> = {
  4: {
    title: "Bunga hutan mekar!",
    text: "Pandi dapat beg kecil. Bunga ajaib mula tumbuh di tepi laluan.",
    reward: "🎒"
  },
  8: {
    title: "Cahaya hutan kembali!",
    text: "Pandi dapat topi explorer. Pokok mula bercahaya dan Blind Box menanti selepas ini.",
    reward: "🧢"
  },
  12: {
    title: "Misi pertama selesai!",
    text: "Hutan Matematik kembali hidup. Sungai bersinar, rama-rama terbang dan Pandi sangat bangga.",
    reward: "🌈"
  }
};

export function RewardModal({
  completedQuestions,
  onContinue
}: RewardModalProps) {
  const copy = milestoneCopy[completedQuestions] ?? milestoneCopy[4];

  return (
    <div className="forest-modal-backdrop" role="dialog" aria-modal="true">
      <section className="forest-modal reward-modal">
        <Image
          alt="Pandi meraikan ganjaran"
          className="modal-pandi"
          height={1254}
          sizes="150px"
          src={getPandiPoseSrc("celebrate")}
          width={1254}
        />
        <div className="reward-icon" aria-hidden="true">
          {copy.reward}
        </div>
        <span className="math-forest-eyebrow">Ganjaran Hutan</span>
        <h2>{copy.title}</h2>
        <p>{copy.text}</p>
        <button
          className="button button-primary"
          type="button"
          onClick={onContinue}
        >
          Teruskan pengembaraan →
        </button>
      </section>
    </div>
  );
}
