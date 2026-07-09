"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  OnboardingCard,
  type OnboardingCardStep
} from "@/components/onboarding/OnboardingCard";
import { LivingPandi } from "@/components/pandi/LivingPandi";
import { Brand } from "@/components/ui/Brand";
import { getState, malaysianStates } from "@/data/states";
import { withBasePath } from "@/lib/paths";
import {
  emptyProfile,
  readProfile,
  resetLearningProfile,
  saveProfile
} from "@/lib/storage";
import type { LearnerProfile, StateSlug } from "@/types";

const totalStorySteps = 4;

const cardStepLabels: Record<OnboardingCardStep, string> = {
  name: "Mari berkenalan",
  state: "Tempat kamu",
  age: "Umur kamu",
  ready: "Sedia mengembara"
};

const cardStepNumbers: Record<OnboardingCardStep, number> = {
  name: 1,
  state: 2,
  age: 3,
  ready: 4
};

const homepageWorldScene = withBasePath(
  "/assets/backgrounds/homepage-mobile-clean.png"
);

const stateThemeColors: Record<
  StateSlug | "default",
  { primary: string; secondary: string; accent: string }
> = {
  default: { primary: "#16a34a", secondary: "#facc15", accent: "#ffffff" },
  johor: { primary: "#0b3b8f", secondary: "#e11d48", accent: "#ffffff" },
  kedah: { primary: "#d71920", secondary: "#f4c542", accent: "#157a3b" },
  kelantan: { primary: "#d71920", secondary: "#f4c542", accent: "#ffffff" },
  melaka: { primary: "#1d4ed8", secondary: "#f5d547", accent: "#e11d48" },
  "negeri-sembilan": {
    primary: "#facc15",
    secondary: "#111827",
    accent: "#ef4444"
  },
  pahang: { primary: "#111827", secondary: "#ffffff", accent: "#facc15" },
  perak: { primary: "#ffffff", secondary: "#111827", accent: "#facc15" },
  perlis: { primary: "#facc15", secondary: "#1f2937", accent: "#ffffff" },
  "pulau-pinang": {
    primary: "#2563eb",
    secondary: "#facc15",
    accent: "#ffffff"
  },
  sabah: { primary: "#60a5fa", secondary: "#ef4444", accent: "#ffffff" },
  sarawak: { primary: "#facc15", secondary: "#ef4444", accent: "#111827" },
  selangor: { primary: "#ef4444", secondary: "#facc15", accent: "#ffffff" },
  terengganu: { primary: "#111827", secondary: "#ffffff", accent: "#facc15" },
  "kuala-lumpur": {
    primary: "#2563eb",
    secondary: "#ef4444",
    accent: "#facc15"
  },
  labuan: { primary: "#ffffff", secondary: "#ef4444", accent: "#2563eb" },
  putrajaya: { primary: "#facc15", secondary: "#2563eb", accent: "#ffffff" }
};

function messageForStep(step: number, profile: LearnerProfile): string {
  switch (step) {
    case 0:
    case 1:
      return profile.name
        ? `Hai kembali, ${profile.name}!`
        : "👋 Hai! Saya Pandi.\nSiapa nama awak?";
    case 2:
      return `Seronok kenal ${profile.name || "kamu"}!`;
    case 3:
      return `Wah, ${profile.state || "Malaysia"}!`;
    case 4:
      return "Kita dah jadi kawan!";
    default:
      return "Hai, kawan baru!";
  }
}

function cardStepForStoryStep(step: number): OnboardingCardStep {
  if (step <= 1) return "name";
  if (step === 2) return "state";
  if (step === 3) return "age";
  return "ready";
}

export function OnboardingExperience() {
  const [profile, setProfile] = useState<LearnerProfile>(emptyProfile);
  const [step, setStep] = useState(0);
  const [sceneSlug, setSceneSlug] = useState<StateSlug | "">("");
  const [sceneChanging, setSceneChanging] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [messageOverride, setMessageOverride] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedProfile = readProfile();
      setProfile(savedProfile);
      setNameInput(savedProfile.name);
      setSceneSlug(savedProfile.stateSlug);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const activeState = useMemo(() => getState(sceneSlug), [sceneSlug]);
  const cardStep = cardStepForStoryStep(step);
  const storyStep = cardStepNumbers[cardStep];
  const scene = homepageWorldScene;
  const stateTheme = stateThemeColors[activeState?.slug ?? "default"];
  const onboardingStyle = {
    "--onboarding-scene": `url("${scene}")`,
    "--state-primary": stateTheme.primary,
    "--state-secondary": stateTheme.secondary,
    "--state-accent": stateTheme.accent
  } as CSSProperties;

  function updateProfile(nextProfile: LearnerProfile): void {
    setProfile(nextProfile);
    saveProfile(nextProfile);
  }

  function showStep(nextStep: number): void {
    setMessageOverride("");
    setStep(nextStep);
  }

  function changePandiScene(slug: StateSlug | ""): void {
    setSceneChanging(true);
    window.setTimeout(() => {
      setSceneSlug(slug);
      setSceneChanging(false);
    }, 180);
  }

  function handleNameSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const name = nameInput.trim();

    if (!name) return;
    updateProfile({ ...profile, name });
    showStep(2);
  }

  function handleStateSelect(stateSlug: StateSlug): void {
    if (stateSlug === profile.stateSlug) return;

    const state = malaysianStates.find((item) => item.slug === stateSlug);
    if (!state) return;

    updateProfile({
      ...profile,
      state: state.name,
      stateSlug: state.slug
    });
    setMessageOverride(`Wah, ${state.name}!`);
    changePandiScene(state.slug);
    window.setTimeout(() => showStep(3), 850);
  }

  function handleAgeSelect(age: number): void {
    updateProfile({ ...profile, age: String(age) });
    showStep(4);
  }

  function restart(): void {
    resetLearningProfile();
    setProfile(emptyProfile);
    setNameInput("");
    changePandiScene("");
    showStep(0);
  }

  return (
    <div className="onboarding-page">
      <a className="skip-link" href="#onboarding">
        Terus ke sesi bersama Pandi
      </a>
      <header className="welcome-header">
        <Brand />
        <div className="welcome-header-actions">
          <span className="safe-note">
            <span aria-hidden="true">✓</span> Ruang selamat untuk belajar
          </span>
          <button className="quiet-button" type="button" onClick={restart}>
            Mula semula
          </button>
        </div>
      </header>

      <main
        className="onboarding"
        id="onboarding"
        data-step={step}
        style={onboardingStyle}
      >
        <div
          className={`pandi-scene-layer${sceneChanging ? " is-changing" : ""}`}
          aria-hidden="true"
          style={{ backgroundImage: `url("${scene}")` }}
        />
        <div className="onboarding-scenery" aria-hidden="true">
          <span className="soft-sun" />
          <span className="mini-cloud cloud-one" />
          <span className="mini-cloud cloud-two" />
          <span className="soft-hill hill-one" />
          <span className="soft-hill hill-two" />
          <span className="tiny-tree tree-one">♣</span>
          <span className="tiny-tree tree-two">♣</span>
          <span className="magic-particle particle-one">✦</span>
          <span className="magic-particle particle-two">●</span>
          <span className="magic-particle particle-three">✦</span>
          <span className="butterfly butterfly-one">🦋</span>
          <span className="butterfly butterfly-two">🦋</span>
          <span className="story-light-ray ray-one" />
          <span className="story-light-ray ray-two" />
          <span className="story-cloud cloud-story-one" />
          <span className="story-cloud cloud-story-two" />
          <span className="story-cloud cloud-story-three" />
          <span className="story-hill hill-far" />
          <span className="story-hill hill-mid" />
          <span className="story-river" />
          <span className="story-bridge" />
          <span className="story-path" />
          <span className="story-tree story-tree-left" />
          <span className="story-tree story-tree-right" />
          <span className="story-flower-bed flower-bed-left">✿ ✽ ❀</span>
          <span className="story-flower-bed flower-bed-right">❀ ✿ ✽</span>
          <span className="story-bird bird-story-one">⌁</span>
          <span className="story-bird bird-story-two">⌁</span>
          <span className="story-leaf leaf-story-one">❧</span>
          <span className="story-leaf leaf-story-two">❧</span>
        </div>

        <section className="pandi-guide" aria-label="Pandi, rakan belajar kamu">
          <div className="pandi-aura" />
          <div className="scene-depth-frame" aria-hidden="true">
            <span className="scene-sky-glow" />
            <span className="scene-path-glow" />
          </div>
          <div className="pandi-message">
            {messageOverride || messageForStep(step, profile)}
          </div>
          <div
            className={`modern-state-outfit${activeState ? " show" : ""}`}
            aria-hidden="true"
          >
            <span className="modern-hoodie-band" />
            <span className="modern-chest-badge">P</span>
            <span className="modern-sneaker-glow" />
          </div>
          <span className="pandi-ground-shadow" aria-hidden="true" />
          <span className="pandi-breath-highlight" aria-hidden="true" />
          <span className="pandi-blink-line" aria-hidden="true" />
          <span className="pandi-map-card" aria-hidden="true">
            ✦
          </span>
          <span className="pandi-wave-spark" aria-hidden="true">
            ✨
          </span>
          <LivingPandi pose="wave" priority />
          <div
            className={`held-flag${activeState ? " show" : ""}`}
            aria-hidden="true"
          >
            <span />
            {activeState && (
              <Image alt="" height={50} src={activeState.flag} width={78} />
            )}
          </div>
          <div className="teacher-badge">
            <span aria-hidden="true">♥</span> Rakan belajar kamu
          </div>
        </section>

        <OnboardingCard
          nameInput={nameInput}
          numericStep={step}
          profile={profile}
          step={cardStep}
          stepLabel={cardStepLabels[cardStep]}
          stepNumber={storyStep}
          totalSteps={totalStorySteps}
          onAgeSelect={handleAgeSelect}
          onNameInputChange={setNameInput}
          onNameSubmit={handleNameSubmit}
          onSavedProfileContinue={() => showStep(4)}
          onStateSelect={handleStateSelect}
        />
      </main>
    </div>
  );
}
