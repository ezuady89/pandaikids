"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useMemo,
  useState
} from "react";

import { StateSelector } from "@/components/onboarding/StateSelector";
import { Brand } from "@/components/ui/Brand";
import {
  defaultPandiScene,
  getState,
  malaysianStates
} from "@/data/states";
import {
  emptyProfile,
  readProfile,
  resetLearningProfile,
  saveProfile
} from "@/lib/storage";
import type { LearnerProfile, StateSlug } from "@/types";

const storySteps = [1, 2, 3, 4, 5] as const;
const stepLabels = [
  "Mari berkenalan",
  "Nama kamu",
  "Tempat kamu",
  "Umur kamu",
  "Sedia mengembara"
] as const;

const totalStorySteps = storySteps.length;

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
      return profile.name ? `Hai kembali, ${profile.name}!` : "👋 Hai! Saya Pandi.";
    case 1:
      return "Siapa nama awak?";
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
  const storyStep = storySteps[step];
  const scene = activeState?.pandiScene ?? defaultPandiScene;
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
    const nextScene = getState(slug)?.pandiScene ?? defaultPandiScene;
    const preload = new window.Image();

    preload.onload = () => {
      setSceneChanging(true);
      window.setTimeout(() => {
        setSceneSlug(slug);
        setSceneChanging(false);
      }, 180);
    };
    preload.onerror = () => {
      setSceneSlug("");
      setSceneChanging(false);
    };
    preload.src = nextScene;
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

      <main className="onboarding" id="onboarding" style={onboardingStyle}>
        <div
          className={`pandi-scene-layer${
            sceneChanging ? " is-changing" : ""
          }`}
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
            className={`modern-state-outfit${
              activeState ? " show" : ""
            }`}
            aria-hidden="true"
          >
            <span className="modern-hoodie-band" />
            <span className="modern-chest-badge">P</span>
            <span className="modern-sneaker-glow" />
          </div>
          <span className="pandi-ground-shadow" aria-hidden="true" />
          <span className="pandi-breath-highlight" aria-hidden="true" />
          <span className="pandi-blink-line" aria-hidden="true" />
          <span className="pandi-map-card" aria-hidden="true">✦</span>
          <span className="pandi-wave-spark" aria-hidden="true">✨</span>
          <Image
            alt="Pandi si panda sedang tersenyum dan melambai"
            height={1254}
            priority
            sizes="(max-width: 680px) 260px, 570px"
            src={defaultPandiScene}
            width={1254}
          />
          <div
            className={`held-flag${activeState ? " show" : ""}`}
            aria-hidden="true"
          >
            <span />
            {activeState && (
              <Image
                alt=""
                height={50}
                src={activeState.flag}
                width={78}
              />
            )}
          </div>
          <div className="teacher-badge">
            <span aria-hidden="true">♥</span> Rakan belajar kamu
          </div>
        </section>

        <section
          className="onboarding-panel step-enter"
          data-step={step}
          aria-live="polite"
        >
          <div className="step-top">
            <span className="step-label">{stepLabels[step]}</span>
            <span className="step-count">
              {storyStep} / {totalStorySteps}
            </span>
          </div>
          <div className="step-track" aria-hidden="true">
            <span style={{ width: `${(storyStep / totalStorySteps) * 100}%` }} />
          </div>
          <div className="step-content" key={step}>
            {step === 0 && (
              <>
                <span className="onboarding-kicker">
                  Selamat datang ke PandaiKids
                </span>
                <h1>
                  {profile.name
                    ? `Pandi rindu ${profile.name}!`
                    : "👋 Hai! Saya Pandi."}
                </h1>
                <p>
                  {profile.name
                    ? "Kita boleh sambung perjalanan atau berkenalan semula."
                    : "Siapa nama awak? Pandi nak jadi kawan belajar awak."}
                </p>
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => showStep(profile.name ? 4 : 1)}
                >
                  {profile.name ? "Sambung bersama Pandi" : "Hai Pandi!"}
                  <span aria-hidden="true">→</span>
                </button>
              </>
            )}

            {step === 1 && (
              <>
                <span className="onboarding-kicker">
                  Kawan baharu Pandi
                </span>
                <h1>Siapa nama awak?</h1>
                <p>Tulis nama yang awak suka dipanggil.</p>
                <form
                  className="onboarding-form"
                  onSubmit={handleNameSubmit}
                >
                  <label className="big-input">
                    <span>Nama saya</span>
                    <input
                      autoComplete="given-name"
                      maxLength={20}
                      placeholder="Contoh: Aisyah"
                      required
                      value={nameInput}
                      onChange={(event) => setNameInput(event.target.value)}
                    />
                  </label>
                  <button className="button button-primary" type="submit">
                    Itulah nama saya <span aria-hidden="true">→</span>
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <span className="onboarding-kicker">
                  Malaysia rumah kita
                </span>
                <h1>Awak tinggal di negeri mana?</h1>
                <p>
                  Pilih negeri atau wilayah awak. Pandi akan bersiap khas
                  untuk awak.
                </p>
                <StateSelector
                  selectedState={profile.stateSlug}
                  onSelect={handleStateSelect}
                />
              </>
            )}

            {step === 3 && (
              <>
                <span className="onboarding-kicker">
                  Supaya sesuai untuk awak
                </span>
                <h1>Berapa umur awak?</h1>
                <p>Pilih umur awak. Tiada jawapan yang salah di sini.</p>
                <div className="age-grid">
                  {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((age) => (
                    <button
                      className={`age-button${
                        Number(profile.age) === age ? " selected" : ""
                      }`}
                      key={age}
                      type="button"
                      onClick={() => handleAgeSelect(age)}
                    >
                      {age}
                      <small>tahun</small>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <span className="onboarding-kicker">
                  Yeay, kita dah jadi kawan!
                </span>
                <h1>Awak dah bersedia?</h1>
                <p>
                  {profile.name
                    ? `Yeay, ${profile.name}! 🎉`
                    : "Yeay! Kita dah jadi kawan! 🎉"}{" "}
                  Jom kita mulakan pengembaraan pertama bersama!
                </p>
                <div className="profile-ribbon">
                  <span>♥ {profile.name}</span>
                  <span>⌂ {profile.state}</span>
                  <span>★ {profile.age} tahun</span>
                </div>
                <div
                  className="adventure-preview"
                  aria-label="Pandi mengajak ke Hutan Matematik"
                >
                  <p>Nampak hutan tu?</p>
                  <p>Pokok nombor sedang tidur...</p>
                  <p>Jom kita bantu hidupkan semula!</p>
                </div>
                <Link
                  className="button button-primary journey-button"
                  href="/world/mathematics"
                >
                  Saya Dah Bersedia! <span aria-hidden="true">🚀</span>
                </Link>
              </>
            )}
          </div>
          <p className="privacy-note">
            <span aria-hidden="true">●</span> Maklumat disimpan pada peranti
            ini sahaja.
          </p>
        </section>
      </main>
    </div>
  );
}
