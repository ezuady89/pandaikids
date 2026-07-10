import {
  defaultSchoolLevel,
  getSchoolLevelFromAge,
  normalizeSchoolLevel
} from "@/lib/learning-levels";
import type { GameId, LearnerProfile, SchoolLevel } from "@/types";
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
  age: "",
  schoolLevel: defaultSchoolLevel
};

const mathForestProgressKeys = [
  "preschool",
  "year1",
  "year2",
  "year3",
  "year4",
  "year5",
  "year6"
] as const satisfies readonly SchoolLevel[];

function getProfileSchoolLevel(
  saved: Partial<LearnerProfile>
): SchoolLevel {
  if (saved.age) return getSchoolLevelFromAge(saved.age);
  return normalizeSchoolLevel(saved.schoolLevel);
}

function getMathForestProgressKey(
  level: SchoolLevel = defaultSchoolLevel
): string {
  return `${MATH_FOREST_PROGRESS_KEY}-${level}`;
}

function getEmptyMathForestProgress(): MathForestProgressSnapshot {
  return {
    completedQuestions: 0,
    correctAnswers: 0,
    collectedRewards: []
  };
}

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
      age: saved.age ?? "",
      schoolLevel: getProfileSchoolLevel(saved)
    };
  } catch {
    return emptyProfile;
  }
}

export function saveProfile(profile: LearnerProfile): void {
  const normalizedProfile: LearnerProfile = {
    ...profile,
    schoolLevel: profile.age
      ? getSchoolLevelFromAge(profile.age)
      : normalizeSchoolLevel(profile.schoolLevel)
  };

  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(normalizedProfile));
}

export function resetLearningProfile(): void {
  window.localStorage.removeItem(PROFILE_KEY);
  window.localStorage.removeItem(ONBOARDING_XP_KEY);
  window.localStorage.removeItem(MATH_FOREST_PROGRESS_KEY);
  mathForestProgressKeys.forEach((level) => {
    window.localStorage.removeItem(getMathForestProgressKey(level));
  });
}

export function saveOnboardingXp(xp: number): void {
  window.localStorage.setItem(ONBOARDING_XP_KEY, String(xp));
}

export function saveGameScore(gameId: GameId, score: number): void {
  window.localStorage.setItem(`pandaikids-${gameId}-score`, String(score));
}

export function readMathForestProgress(
  level: SchoolLevel = defaultSchoolLevel
): MathForestProgressSnapshot {
  if (typeof window === "undefined") {
    return getEmptyMathForestProgress();
  }

  try {
    const progressKey = getMathForestProgressKey(level);
    const rawProgress =
      window.localStorage.getItem(progressKey) ??
      (level === defaultSchoolLevel
        ? window.localStorage.getItem(MATH_FOREST_PROGRESS_KEY)
        : null) ??
      "{}";
    const saved = JSON.parse(
      rawProgress
    ) as Partial<MathForestProgressSnapshot>;

    return {
      completedQuestions: saved.completedQuestions ?? 0,
      correctAnswers: saved.correctAnswers ?? 0,
      collectedRewards: saved.collectedRewards ?? [],
      completedAt: saved.completedAt
    };
  } catch {
    return getEmptyMathForestProgress();
  }
}

export function saveMathForestProgress(
  snapshot: MathForestProgressSnapshot,
  level: SchoolLevel = defaultSchoolLevel
): void {
  window.localStorage.setItem(
    getMathForestProgressKey(level),
    JSON.stringify(snapshot)
  );
}

export function addMathForestReward(
  rewardId: MathForestRewardId,
  level: SchoolLevel = defaultSchoolLevel
): void {
  const progress = readMathForestProgress(level);
  const collectedRewards = progress.collectedRewards.includes(rewardId)
    ? progress.collectedRewards
    : [...progress.collectedRewards, rewardId];

  saveMathForestProgress({
    ...progress,
    collectedRewards
  }, level);
}
