export type MathQuestionTopic =
  | "number-recognition"
  | "counting"
  | "addition"
  | "subtraction"
  | "comparison"
  | "sequence";

export type VisualObject = "apple" | "star" | "leaf" | "flower" | "block";

export interface MathForestQuestion {
  id: string;
  topic: MathQuestionTopic;
  zone: string;
  question: string;
  options: readonly number[];
  answer: number;
  explanation: string;
  visualHint?: string;
  visualObject: VisualObject;
  visualGroups: readonly number[];
}

export type MathForestRewardId =
  | "pandi-explorer"
  | "pandi-teacher"
  | "pandi-scientist"
  | "pandi-chef"
  | "secret-pandi";

export interface MathForestReward {
  id: MathForestRewardId;
  name: string;
  description: string;
  emoji: string;
}

export interface MathForestProgressSnapshot {
  completedQuestions: number;
  correctAnswers: number;
  collectedRewards: MathForestRewardId[];
  completedAt?: string;
}
