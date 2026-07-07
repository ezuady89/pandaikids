import type { GameId, LearnerProfile } from "@/types";
import type {
  MathForestProgressSnapshot,
  MathForestRewardId
} from "@/types/math-forest";

const PROFILE_KEY = "pandaikids-profile";
const ONBOARDING_XP_KEY = "pandaikids-onboarding-xp";
const MATH_FOREST_PROGRESS_KEY = "pandaikids-math-forest-progress";

export const emptyProfile: LearnerProfile = {
  name: "",
  state: "",
  stateSlug: "",
  age: ""
};

export function readProfile(): LearnerProfile {
  if (typeof window === "undefined") return emptyProfile;

  try {
    const saved = JSON.parse(
      window.localStorage.getItem(PROFILE_KEY) ?? "{}"
    ) as Partial<LearnerProfile>;

    return {
      name: saved.name ?? "",
      state: saved.state ?? "",
      stateSlug: saved.stateSlug ?? "",
      age: saved.age ?? ""
    };
  } catch {
    return emptyProfile;
  }
}

export function saveProfile(profile: LearnerProfile): void {
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function resetLearningProfile(): void {
  window.localStorage.removeItem(PROFILE_KEY);
  window.localStorage.removeItem(ONBOARDING_XP_KEY);
  window.localStorage.removeItem(MATH_FOREST_PROGRESS_KEY);
}

export function saveOnboardingXp(xp: number): void {
  window.localStorage.setItem(ONBOARDING_XP_KEY, String(xp));
}

export function saveGameScore(gameId: GameId, score: number): void {
  window.localStorage.setItem(`pandaikids-${gameId}-score`, String(score));
}

export function readMathForestProgress(): MathForestProgressSnapshot {
  if (typeof window === "undefined") {
    return {
      completedQuestions: 0,
      correctAnswers: 0,
      collectedRewards: []
    };
  }

  try {
    const saved = JSON.parse(
      window.localStorage.getItem(MATH_FOREST_PROGRESS_KEY) ?? "{}"
    ) as Partial<MathForestProgressSnapshot>;

    return {
      completedQuestions: saved.completedQuestions ?? 0,
      correctAnswers: saved.correctAnswers ?? 0,
      collectedRewards: saved.collectedRewards ?? [],
      completedAt: saved.completedAt
    };
  } catch {
    return {
      completedQuestions: 0,
      correctAnswers: 0,
      collectedRewards: []
    };
  }
}

export function saveMathForestProgress(
  snapshot: MathForestProgressSnapshot
): void {
  window.localStorage.setItem(
    MATH_FOREST_PROGRESS_KEY,
    JSON.stringify(snapshot)
  );
}

export function addMathForestReward(rewardId: MathForestRewardId): void {
  const progress = readMathForestProgress();
  const collectedRewards = progress.collectedRewards.includes(rewardId)
    ? progress.collectedRewards
    : [...progress.collectedRewards, rewardId];

  saveMathForestProgress({
    ...progress,
    collectedRewards
  });
}
