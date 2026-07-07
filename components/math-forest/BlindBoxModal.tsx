import { useMemo, useState } from "react";

import { mathForestRewards } from "@/data/questions/math-year1";
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
    () =>
      mathForestRewards[
        completedQuestions === 20 ? 4 : completedQuestions % mathForestRewards.length
      ],
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
        <span className="math-forest-eyebrow">Blind Box Belajar</span>
        <h2>{opened ? "Hadiah Pandi dibuka!" : "Ketuk kotak ajaib"}</h2>
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
            <p>{reward.description}</p>
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
