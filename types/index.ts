export type StateSlug =
  | "johor"
  | "kedah"
  | "kelantan"
  | "melaka"
  | "negeri-sembilan"
  | "pahang"
  | "perak"
  | "perlis"
  | "pulau-pinang"
  | "sabah"
  | "sarawak"
  | "selangor"
  | "terengganu"
  | "kuala-lumpur"
  | "labuan"
  | "putrajaya";

export interface MalaysianState {
  slug: StateSlug;
  name: string;
  shortName: string;
  flag: string;
  crest: string;
  pandiScene: string;
}

export interface LearnerProfile {
  name: string;
  state: string;
  stateSlug: StateSlug | "";
  age: string;
}

export type WorldId =
  | "abc"
  | "matematik"
  | "jawi"
  | "sains"
  | "angkasa"
  | "iq"
  | "kreatif"
  | "islam"
  | "ganjaran";

export type GameId = "nombor" | "abc" | "sains";

export interface LearningWorld {
  id: WorldId;
  name: string;
  icon: string;
  color: string;
  tag: string;
  description: string;
  zones: readonly string[];
  gameId: GameId;
}

export interface GameQuestion {
  question: string;
  answers: readonly string[];
  correctAnswer: number;
  compact?: boolean;
}

export interface LearningGame {
  id: GameId;
  title: string;
  kicker: string;
  intro: string;
  questions: readonly GameQuestion[];
}
