import type { MathForestQuestion, VisualObject } from "@/types/math-forest";

interface VisualExplanationProps {
  question: MathForestQuestion;
}

const objectEmoji: Record<VisualObject, string> = {
  apple: "🍎",
  star: "⭐",
  leaf: "🍃",
  flower: "🌸",
  block: "🟩"
};

function renderObjects(count: number, object: VisualObject): string {
  return Array.from({ length: count })
    .map(() => objectEmoji[object])
    .join(" ");
}

export function VisualExplanation({ question }: VisualExplanationProps) {
  const [firstGroup, secondGroup] = question.visualGroups;

  return (
    <div className="visual-explanation" aria-label="Penerangan bergambar">
      <div className="visual-object-group">
        <span>{renderObjects(firstGroup, question.visualObject)}</span>
        <small>{firstGroup}</small>
      </div>
      {secondGroup ? (
        <>
          <b>{question.topic === "subtraction" ? "−" : "+"}</b>
          <div className="visual-object-group">
            <span>{renderObjects(secondGroup, question.visualObject)}</span>
            <small>{secondGroup}</small>
          </div>
          <b>=</b>
        </>
      ) : null}
      <div className="visual-object-group answer-group">
        <span>{renderObjects(question.correctAnswer, question.visualObject)}</span>
        <small>{question.correctAnswer}</small>
      </div>
    </div>
  );
}
