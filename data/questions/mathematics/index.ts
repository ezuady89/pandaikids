import { defaultSchoolLevel } from "@/lib/learning-levels";
import type { SchoolLevel } from "@/types";
import type { MathForestQuestion } from "@/types/math-forest";

import { preschoolMathematicsQuestions } from "./preschool";
import { year1MathematicsQuestions } from "./year1";
import { year2MathematicsQuestions } from "./year2";
import { year3MathematicsQuestions } from "./year3";
import { year4MathematicsQuestions } from "./year4";
import { year5MathematicsQuestions } from "./year5";
import { year6MathematicsQuestions } from "./year6";

export const mathematicsQuestionsByLevel: Record<
  SchoolLevel,
  readonly MathForestQuestion[]
> = {
  preschool: preschoolMathematicsQuestions,
  year1: year1MathematicsQuestions,
  year2: year2MathematicsQuestions,
  year3: year3MathematicsQuestions,
  year4: year4MathematicsQuestions,
  year5: year5MathematicsQuestions,
  year6: year6MathematicsQuestions
};

export function getMathematicsQuestionsForLevel(
  level: SchoolLevel
): readonly MathForestQuestion[] {
  return (
    mathematicsQuestionsByLevel[level] ??
    mathematicsQuestionsByLevel[defaultSchoolLevel]
  );
}

export { mathForestRewards, year1MathematicsQuestions } from "./year1";
export { preschoolMathematicsQuestions } from "./preschool";
export { year2MathematicsQuestions } from "./year2";
export { year3MathematicsQuestions } from "./year3";
export { year4MathematicsQuestions } from "./year4";
export { year5MathematicsQuestions } from "./year5";
export { year6MathematicsQuestions } from "./year6";
