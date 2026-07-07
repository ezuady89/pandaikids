interface ForestProgressProps {
  completedQuestions: number;
  totalQuestions: number;
}

const forestStages = [
  "Pokok mula bangun",
  "Bunga makin mekar",
  "Sungai makin cerah",
  "Hutan kembali ajaib"
] as const;

export function ForestProgress({
  completedQuestions,
  totalQuestions
}: ForestProgressProps) {
  const progress = Math.round((completedQuestions / totalQuestions) * 100);
  const stageIndex = Math.min(
    forestStages.length - 1,
    Math.max(0, Math.ceil(completedQuestions / 5) - 1)
  );

  return (
    <section className="forest-progress-card" aria-label="Kemajuan hutan">
      <div>
        <span className="math-forest-eyebrow">Hutan Matematik</span>
        <strong>{forestStages[stageIndex]}</strong>
      </div>
      <div className="forest-progress-track">
        <span style={{ width: `${progress}%` }} />
      </div>
      <p>
        {completedQuestions}/{totalQuestions} pokok nombor dibantu
      </p>
    </section>
  );
}
