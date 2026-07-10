interface ForestProgressProps {
  completedQuestions: number;
  totalQuestions: number;
}

const forestStages = [
  "Pokok nombor tidur",
  "Bunga makin mekar",
  "Burung kembali",
  "Hutan kembali ceria"
] as const;

function getStageIndex(completedQuestions: number): number {
  if (completedQuestions >= 12) return 3;
  if (completedQuestions >= 8) return 2;
  if (completedQuestions >= 4) return 1;
  return 0;
}

export function ForestProgress({
  completedQuestions,
  totalQuestions
}: ForestProgressProps) {
  const progress = Math.round((completedQuestions / totalQuestions) * 100);
  const stageIndex = getStageIndex(completedQuestions);

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
        Soalan {completedQuestions} / {totalQuestions}
      </p>
    </section>
  );
}
