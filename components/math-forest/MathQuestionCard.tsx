import type { MathForestQuestion } from "@/types/math-forest";

interface MathQuestionCardProps {
  disabled?: boolean;
  onAnswer: (answer: number) => void;
  question: MathForestQuestion;
  questionNumber: number;
  totalQuestions: number;
}

export function MathQuestionCard({
  disabled = false,
  onAnswer,
  question,
  questionNumber,
  totalQuestions
}: MathQuestionCardProps) {
  return (
    <section className="math-question-card">
      <div className="question-meta">
        <span>{question.zone}</span>
        <strong>
          Soalan {questionNumber}/{totalQuestions}
        </strong>
      </div>
      <h1>{question.question}</h1>
      <div className="math-answer-grid">
        {question.options.map((option) => (
          <button
            disabled={disabled}
            key={`${question.id}-${option}`}
            type="button"
            onClick={() => onAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
