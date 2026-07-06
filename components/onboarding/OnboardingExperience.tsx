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
  saveOnboardingXp,
  saveProfile
} from "@/lib/storage";
import type { LearnerProfile, StateSlug } from "@/types";

const storySteps = [1, 2, 3, 3, 4, 5, 6, 7, 8] as const;
const stepLabels = [
  "Mari berkenalan",
  "Nama kamu",
  "Tempat kamu",
  "Umur kamu",
  "Kita sudah berkawan",
  "Soalan pertama",
  "Pandi tunjukkan",
  "Bintang pertama",
  "Ringkasan hari ini"
] as const;

function messageForStep(step: number, profile: LearnerProfile): string {
  switch (step) {
    case 0:
      return profile.name ? `Hai kembali, ${profile.name}!` : "Hai, kawan baru!";
    case 1:
      return "Pandi nak kenal kamu!";
    case 2:
      return `Seronok kenal ${profile.name || "kamu"}!`;
    case 3:
      return `Wah, ${profile.state || "Malaysia"}!`;
    case 4:
      return `Assalamualaikum, ${profile.name}!`;
    case 5:
      return "Kita kira bersama!";
    case 6:
      return "Tak apa, kita belajar!";
    case 7:
      return `Hebat, ${profile.name}!`;
    case 8:
      return "Pandi bangga dengan kamu!";
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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

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
  const onboardingStyle = {
    "--onboarding-scene": `url("${scene}")`
  } as CSSProperties;

  function updateProfile(nextProfile: LearnerProfile): void {
    setProfile(nextProfile);
    saveProfile(nextProfile);
  }

  function showStep(nextStep: number): void {
    setMessageOverride("");
    setSelectedAnswer(null);
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

  function handleAnswer(answer: number): void {
    setSelectedAnswer(answer);
    if (answer === 5) {
      saveOnboardingXp(20);
      window.setTimeout(() => showStep(7), 450);
      return;
    }

    window.setTimeout(() => showStep(6), 450);
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
        </div>

        <section className="pandi-guide" aria-label="Pandi, rakan belajar kamu">
          <div className="pandi-aura" />
          <div className="pandi-message">
            {messageOverride || messageForStep(step, profile)}
          </div>
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
            <span className="step-count">{storyStep} / 8</span>
          </div>
          <div className="step-track" aria-hidden="true">
            <span style={{ width: `${(storyStep / 8) * 100}%` }} />
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
                    : "Nama Pandi. Siapa nama kamu?"}
                </h1>
                <p>
                  {profile.name
                    ? "Kita boleh sambung perjalanan atau berkenalan semula."
                    : "Pandi akan jadi rakan belajar kamu. Kita kenal satu sama lain dahulu, ya?"}
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
                <h1>Apa nama kamu?</h1>
                <p>Tulis nama yang kamu suka dipanggil.</p>
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
                <h1>Kamu tinggal di negeri mana?</h1>
                <p>
                  Pilih negeri atau wilayah kamu. Pandi akan bersiap khas
                  untukmu.
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
                  Supaya soalan sesuai untukmu
                </span>
                <h1>Berapa umur kamu?</h1>
                <p>Pilih umur kamu. Tiada jawapan yang salah di sini.</p>
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
                  Pandi sudah ingat kamu
                </span>
                <h1>Hai, {profile.name}!</h1>
                <p>
                  Kawan Pandi dari <strong>{profile.state}</strong>, umur{" "}
                  <strong>{profile.age} tahun</strong>. Hari ini kita belajar
                  satu perkara kecil dahulu.
                </p>
                <div className="profile-ribbon">
                  <span>♥ {profile.name}</span>
                  <span>⌂ {profile.state}</span>
                  <span>★ {profile.age} tahun</span>
                </div>
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => showStep(5)}
                >
                  Jom cuba satu soalan <span aria-hidden="true">→</span>
                </button>
              </>
            )}

            {step === 5 && (
              <>
                <span className="onboarding-kicker">
                  Matematik · Soalan mudah
                </span>
                <h1>Berapa jumlah semuanya?</h1>
                <div
                  className="object-question"
                  aria-label="Dua epal tambah tiga epal"
                >
                  <span>🍎 🍎</span>
                  <b>+</b>
                  <span>🍎 🍎 🍎</span>
                </div>
                <div className="onboarding-answers">
                  {[4, 5, 6].map((answer) => (
                    <button
                      className={
                        selectedAnswer === answer
                          ? answer === 5
                            ? "correct-choice"
                            : "wrong-choice"
                          : undefined
                      }
                      key={answer}
                      type="button"
                      onClick={() => handleAnswer(answer)}
                    >
                      {answer}
                    </button>
                  ))}
                </div>
                <p className="answer-hint">Tekan jawapan yang betul.</p>
              </>
            )}

            {step === 6 && (
              <>
                <span className="onboarding-kicker teaching">
                  Cuba lihat begini
                </span>
                <h1>Dua kumpulan menjadi satu</h1>
                <div className="teaching-visual">
                  <div>
                    <span>🍎 🍎</span>
                    <small>2 epal</small>
                  </div>
                  <b>+</b>
                  <div>
                    <span>🍎 🍎 🍎</span>
                    <small>3 epal</small>
                  </div>
                  <b>=</b>
                  <div className="answer-group">
                    <span>🍎 🍎 🍎 🍎 🍎</span>
                    <small>5 epal</small>
                  </div>
                </div>
                <p>
                  Apabila kita kira semua epal satu demi satu, jawapannya ialah{" "}
                  <strong>5</strong>.
                </p>
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => showStep(5)}
                >
                  Saya faham, cuba lagi <span aria-hidden="true">↻</span>
                </button>
              </>
            )}

            {step === 7 && (
              <>
                <div className="reward-burst" aria-hidden="true">
                  <span>★</span>
                  <span>✦</span>
                  <span>★</span>
                </div>
                <span className="onboarding-kicker success">
                  Jawapan betul!
                </span>
                <h1>Kamu berjaya!</h1>
                <p>
                  Kamu sudah mengambil langkah pertama bersama Pandi.
                </p>
                <div className="xp-award">
                  <span className="xp-star">★</span>
                  <div>
                    <strong>+20 XP</strong>
                    <small>Bintang pembelajaran pertama</small>
                  </div>
                </div>
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => showStep(8)}
                >
                  Lihat ringkasan <span aria-hidden="true">→</span>
                </button>
              </>
            )}

            {step === 8 && (
              <>
                <span className="onboarding-kicker">
                  Perjalanan sudah bermula
                </span>
                <h1>Syabas, {profile.name}!</h1>
                <p>
                  Hari ini kamu sudah berkenalan dengan Pandi dan
                  menyelesaikan soalan pertama.
                </p>
                <div className="today-summary">
                  <div>
                    <span>✓</span>
                    <p>
                      <strong>1 soalan</strong>
                      <small>diselesaikan</small>
                    </p>
                  </div>
                  <div>
                    <span>★</span>
                    <p>
                      <strong>20 XP</strong>
                      <small>dikumpul</small>
                    </p>
                  </div>
                </div>
                <Link
                  className="button button-primary journey-button"
                  href="/journey"
                >
                  Mulakan perjalanan saya <span aria-hidden="true">→</span>
                </Link>
                <Link className="quiet-link" href="/world/ganjaran">
                  Lihat bintang dan ganjaran
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
