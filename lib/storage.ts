import type { GameId, LearnerProfile } from "@/types";

const PROFILE_KEY = "pandaikids-profile";
const ONBOARDING_XP_KEY = "pandaikids-onboarding-xp";

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
}

export function saveOnboardingXp(xp: number): void {
  window.localStorage.setItem(ONBOARDING_XP_KEY, String(xp));
}

export function saveGameScore(gameId: GameId, score: number): void {
  window.localStorage.setItem(`pandaikids-${gameId}-score`, String(score));
}
