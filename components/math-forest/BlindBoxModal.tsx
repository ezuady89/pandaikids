import { useMemo, useState } from "react";
import Image from "next/image";

import { mathForestRewards } from "@/data/questions/math-year1";
import { getPandiPoseSrc } from "@/lib/pandi-assets";
import { addMathForestReward } from "@/lib/storage";
import type { MathForestReward } from "@/types/math-forest";

interface BlindBoxModalProps {
  completedQuestions: number;
  onContinue: (reward: MathForestReward) => void;
}

export function BlindBoxModal({
  completedQuestions,
  onContinue
}: BlindBoxModalProps) {
  const [opened, setOpened] = useState(false);
  const reward = useMemo(
    () => mathForestRewards[completedQuestions >= 12 ? 4 : 0],
    [completedQuestions]
  );

  function openBox(): void {
    if (opened) return;
    setOpened(true);
    addMathForestReward(reward.id);
  }

  return (
    <div className="forest-modal-backdrop" role="dialog" aria-modal="true">
      <section className="forest-modal blindbox-modal">
        <Image
          alt="Pandi membuka Blind Box"
          className="modal-pandi"
          height={1254}
          sizes="150px"
          src={getPandiPoseSrc("blindbox")}
          width={1254}
        />
        <span className="math-forest-eyebrow">Blind Box Belajar</span>
        <h2>{opened ? "Pandi dapat hadiah ajaib!" : "Ketuk kotak ajaib"}</h2>
        <div className="blindbox-sparkles" aria-hidden="true">
          <span>✦</span>
          <span>★</span>
          <span>✦</span>
        </div>
        <button
          className={`blindbox ${opened ? "opened" : ""}`}
          type="button"
          onClick={openBox}
          aria-label="Buka Blind Box"
        >
          {opened ? reward.emoji : "🎁"}
        </button>
        {opened ? (
          <>
            <h3>{reward.name}</h3>
            <p>{reward.description} Pandi melompat gembira!</p>
            <button
              className="button button-primary"
              type="button"
              onClick={() => onContinue(reward)}
            >
              Simpan hadiah →
            </button>
          </>
        ) : (
          <p>Blind Box ini hanya diperoleh kerana awak belajar dengan Pandi.</p>
        )}
      </section>
    </div>
  );
}
