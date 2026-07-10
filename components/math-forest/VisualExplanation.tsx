import type { MathForestQuestion, VisualObject } from "@/types/math-forest";

interface VisualExplanationProps {
  question: MathForestQuestion;
}

const objectLabel: Record<VisualObject, string> = {
  apple: "epal",
  star: "bintang",
  leaf: "daun",
  flower: "bunga",
  block: "blok"
};

const maxRenderedObjects = 20;

function renderObjects(count: number, object: VisualObject) {
  const visibleObjects = Math.min(count, maxRenderedObjects);

  return (
    <>
      {Array.from({ length: visibleObjects }, (_, index) => (
        <i
          aria-hidden="true"
          className={`visual-object visual-object-${object}`}
          key={`${object}-${count}-${index}`}
        />
      ))}
      {count > maxRenderedObjects ? (
        <em aria-hidden="true" className="visual-object-more">
          +{count - maxRenderedObjects}
        </em>
      ) : null}
    </>
  );
}

export function VisualExplanation({ question }: VisualExplanationProps) {
  const [firstGroup, secondGroup] = question.visualGroups;
  const operator = question.topic === "subtraction" ? "−" : "+";

  return (
    <div className="visual-explanation" aria-label="Penerangan bergambar">
      <div className="visual-object-group">
        <span aria-label={`${firstGroup} ${objectLabel[question.visualObject]}`}>
          {renderObjects(firstGroup, question.visualObject)}
        </span>
        <small>{firstGroup}</small>
      </div>
      {secondGroup ? (
        <>
          <b>{operator}</b>
          <div className="visual-object-group">
            <span
              aria-label={`${secondGroup} ${objectLabel[question.visualObject]}`}
            >
              {renderObjects(secondGroup, question.visualObject)}
            </span>
            <small>{secondGroup}</small>
          </div>
          <b>=</b>
        </>
      ) : null}
      <div className="visual-object-group answer-group">
        <span aria-label={`${question.answer} ${objectLabel[question.visualObject]}`}>
          {renderObjects(question.answer, question.visualObject)}
        </span>
        <small>{question.answer}</small>
      </div>
      {question.visualHint ? (
        <p className="visual-hint">{question.visualHint}</p>
      ) : null}
    </div>
  );
}
