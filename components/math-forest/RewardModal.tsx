interface RewardModalProps {
  completedQuestions: number;
  onContinue: () => void;
}

const milestoneCopy: Record<number, { title: string; text: string; reward: string }> = {
  5: {
    title: "Bunga hutan mekar!",
    text: "Pandi dapat beg kecil. Hutan Matematik nampak lebih ceria.",
    reward: "🎒"
  },
  10: {
    title: "Cahaya hutan kembali!",
    text: "Pandi dapat topi explorer. Ada Blind Box menanti selepas ini.",
    reward: "🧢"
  },
  15: {
    title: "Sungai mula bersinar!",
    text: "Air sungai mengalir lebih cerah. Pandi dapat lencana pengembara.",
    reward: "🏅"
  },
  20: {
    title: "Misi pertama selesai!",
    text: "Hutan Matematik kembali hidup. Pandi sangat bangga.",
    reward: "🌈"
  }
};

export function RewardModal({
  completedQuestions,
  onContinue
}: RewardModalProps) {
  const copy = milestoneCopy[completedQuestions] ?? milestoneCopy[5];

  return (
    <div className="forest-modal-backdrop" role="dialog" aria-modal="true">
      <section className="forest-modal reward-modal">
        <div className="reward-icon" aria-hidden="true">
          {copy.reward}
        </div>
        <span className="math-forest-eyebrow">Ganjaran Hutan</span>
        <h2>{copy.title}</h2>
        <p>{copy.text}</p>
        <button className="button button-primary" type="button" onClick={onContinue}>
          Teruskan pengembaraan →
        </button>
      </section>
    </div>
  );
}
