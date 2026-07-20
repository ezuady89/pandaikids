"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type CSSProperties, useEffect, useMemo, useState } from "react";

import { malaysianStates, getState } from "@/data/states";
import { getPandiPoseSrc } from "@/lib/pandi-assets";
import { withBasePath } from "@/lib/paths";
import { emptyProfile, readProfile, resetLearningProfile, saveProfile } from "@/lib/storage";
import type { LearnerProfile, StateSlug } from "@/types";

import styles from "./PandaiKidsOnboarding.module.css";

type Step = "name" | "state" | "age" | "ready";
type ModalType = "collection" | "parent" | null;

const STEP_ORDER: Step[] = ["name", "state", "age", "ready"];
const FEATURE_STATES: StateSlug[] = [
  "johor",
  "kedah",
  "kelantan",
  "terengganu",
  "sabah",
  "sarawak"
];

const stateColors: Record<StateSlug | "default", { primary: string; secondary: string; accent: string }> = {
  default: { primary: "#168a47", secondary: "#f7c948", accent: "#ffffff" },
  johor: { primary: "#123d8c", secondary: "#d91f3a", accent: "#ffffff" },
  kedah: { primary: "#d91f3a", secondary: "#f7c948", accent: "#157a3b" },
  kelantan: { primary: "#d91f3a", secondary: "#ffffff", accent: "#d91f3a" },
  melaka: { primary: "#1746a2", secondary: "#f7c948", accent: "#e53935" },
  "negeri-sembilan": { primary: "#f7c948", secondary: "#111827", accent: "#e53935" },
  pahang: { primary: "#111827", secondary: "#ffffff", accent: "#111827" },
  perak: { primary: "#ffffff", secondary: "#111827", accent: "#f7c948" },
  perlis: { primary: "#f7c948", secondary: "#1f2937", accent: "#ffffff" },
  "pulau-pinang": { primary: "#2563eb", secondary: "#f7c948", accent: "#ffffff" },
  sabah: { primary: "#3b82f6", secondary: "#ef4444", accent: "#ffffff" },
  sarawak: { primary: "#f7c948", secondary: "#111827", accent: "#ef4444" },
  selangor: { primary: "#ef4444", secondary: "#f7c948", accent: "#ffffff" },
  terengganu: { primary: "#111827", secondary: "#ffffff", accent: "#111827" },
  "kuala-lumpur": { primary: "#2563eb", secondary: "#ef4444", accent: "#f7c948" },
  labuan: { primary: "#ffffff", secondary: "#ef4444", accent: "#2563eb" },
  putrajaya: { primary: "#f7c948", secondary: "#2563eb", accent: "#ffffff" }
};

const homepageWallpaper = withBasePath("/assets/backgrounds/pandaikids-world-journey-v1.webp");
const pandiWave = getPandiPoseSrc("wave");
const ages = [6, 7, 8, 9, 10, 11, 12];

function stepNumber(step: Step): number {
  return STEP_ORDER.indexOf(step) + 1;
}

function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

export function PandaiKidsOnboarding() {
  const router = useRouter();
  const [profile, setProfile] = useState<LearnerProfile>(emptyProfile);
  const [nameInput, setNameInput] = useState("");
  const [step, setStep] = useState<Step>("name");
  const [showAllStates, setShowAllStates] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [spark, setSpark] = useState(false);

  useEffect(() => {
    const saved = readProfile();
    setProfile(saved);
    setNameInput(saved.name);
    if (saved.name && !saved.stateSlug) setStep("state");
    if (saved.name && saved.stateSlug && !saved.age) setStep("age");
    if (saved.name && saved.stateSlug && saved.age) setStep("ready");
  }, []);

  const activeState = useMemo(() => getState(profile.stateSlug), [profile.stateSlug]);
  const theme = stateColors[profile.stateSlug || "default"];
  const availableStates = showAllStates
    ? malaysianStates
    : malaysianStates.filter((state) => FEATURE_STATES.includes(state.slug));

  const pageStyle = {
    "--pk-wallpaper": `url("${homepageWallpaper}")`,
    "--state-primary": theme.primary,
    "--state-secondary": theme.secondary,
    "--state-accent": theme.accent
  } as CSSProperties;

  function commitProfile(nextProfile: LearnerProfile) {
    setProfile(nextProfile);
    saveProfile(nextProfile);
  }

  function reset() {
    resetLearningProfile();
    setProfile(emptyProfile);
    setNameInput("");
    setStep("name");
    setShowAllStates(false);
    setModal(null);
  }

  function submitName() {
    const cleanName = nameInput.trim();
    if (!isValidName(cleanName)) return;
    commitProfile({ ...profile, name: cleanName });
    setStep("state");
  }

  function selectState(slug: StateSlug) {
    const state = getState(slug);
    if (!state) return;
    commitProfile({ ...profile, state: state.name, stateSlug: state.slug });
    setSpark(true);
    window.setTimeout(() => setSpark(false), 900);
    window.setTimeout(() => setStep("age"), 360);
  }

  function selectAge(age: number) {
    commitProfile({ ...profile, age: String(age) });
    setStep("ready");
  }

  function startAdventure() {
    router.push("/world/mathematics");
  }

  const displayName = profile.name || "kawan baru";
  const stateLabel = activeState?.shortName ?? "Malaysia";

  return (
    <main className={styles.page} style={pageStyle}>
      <div className={styles.wallpaper} aria-hidden="true" />
      <div className={styles.depthShade} aria-hidden="true" />
      <div className={styles.lifeLayer} aria-hidden="true">
        <span className={`${styles.cloud} ${styles.cloudOne}`} />
        <span className={`${styles.cloud} ${styles.cloudTwo}`} />
        <span className={`${styles.bird} ${styles.birdOne}`}>⌁</span>
        <span className={`${styles.bird} ${styles.birdTwo}`}>⌁</span>
        <span className={`${styles.butterfly} ${styles.butterflyOne}`}>◆</span>
        <span className={`${styles.butterfly} ${styles.butterflyTwo}`}>◆</span>
        <span className={`${styles.sparkle} ${styles.sparkleOne}`}>✦</span>
        <span className={`${styles.sparkle} ${styles.sparkleTwo}`}>✦</span>
      </div>

      <header className={styles.header}>
        <button className={styles.logo} type="button" onClick={() => setStep("name")} aria-label="PandaiKids laman utama">
          <span className={styles.logoMark}>●</span>
          <strong>Pandai<span>Kids</span></strong>
        </button>
        <button className={styles.resetButton} type="button" onClick={reset}>
          Mula semula
        </button>
      </header>

      <section className={styles.stage} aria-label="Homepage PandaiKids">
        <div className={`${styles.pandiWrap} ${spark ? styles.pandiSpark : ""}`}>
          <div className={styles.speechBubble}>
            {step === "name" && (
              <>
                <strong>👋 Hai! Saya Pandi.</strong>
                <span>Siapa nama awak?</span>
              </>
            )}
            {step === "state" && (
              <>
                <strong>Seronok kenal {displayName}!</strong>
                <span>Pandi nak pakai warna negeri awak.</span>
              </>
            )}
            {step === "age" && (
              <>
                <strong>{activeState ? `Wah, ${stateLabel}!` : "Jom pilih cabaran."}</strong>
                <span>Berapa umur awak?</span>
              </>
            )}
            {step === "ready" && (
              <>
                <strong>Yeay, {displayName}! 🎉</strong>
                <span>Jom mula pengembaraan.</span>
              </>
            )}
          </div>

          <div className={styles.pandiShadow} aria-hidden="true" />
          <div className={styles.pandiGlow} aria-hidden="true" />
          <div className={styles.stateJacket} aria-hidden="true">
            <span />
          </div>
          <Image
            className={styles.pandi}
            src={pandiWave}
            alt="Pandi sedang melambai di dunia PandaiKids"
            width={1254}
            height={1254}
            priority
            sizes="(max-width: 720px) 44vw, 560px"
          />
          {activeState && (
            <span className={styles.stateBadge} aria-hidden="true">
              <Image src={activeState.flag} alt="" width={54} height={36} />
            </span>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.cardTopline}>
            <span>{step === "ready" ? "Sedia mengembara" : "Mari berkenalan"}</span>
            <strong>{stepNumber(step)} / {STEP_ORDER.length}</strong>
          </div>
          <div className={styles.progress} aria-hidden="true">
            <span style={{ width: `${(stepNumber(step) / STEP_ORDER.length) * 100}%` }} />
          </div>

          {step === "name" && (
            <div className={styles.cardBody}>
              <p className={styles.kicker}>Selamat datang ke PandaiKids</p>
              <h1>Jom mulakan pengembaraan belajar!</h1>
              <label className={styles.inputLabel}>
                <span>Masukkan nama awak</span>
                <input
                  value={nameInput}
                  onChange={(event) => setNameInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submitName();
                  }}
                  maxLength={20}
                  placeholder="Nama awak"
                  autoComplete="given-name"
                />
              </label>
              <button className={styles.primaryButton} type="button" onClick={submitName} disabled={!isValidName(nameInput)}>
                Jom Kenal Pandi! <span>→</span>
              </button>
            </div>
          )}

          {step === "state" && (
            <div className={styles.cardBody}>
              <p className={styles.kicker}>Malaysia rumah kita</p>
              <h1>Awak dari negeri mana?</h1>
              <div className={styles.stateGrid}>
                {availableStates.map((state) => (
                  <button
                    key={state.slug}
                    className={`${styles.stateCard} ${profile.stateSlug === state.slug ? styles.selectedState : ""}`}
                    type="button"
                    onClick={() => selectState(state.slug)}
                  >
                    <Image src={state.flag} alt="" width={42} height={28} />
                    <span>{state.shortName}</span>
                  </button>
                ))}
                {!showAllStates && (
                  <button className={styles.stateCard} type="button" onClick={() => setShowAllStates(true)}>
                    <span className={styles.mapIcon}>🗺️</span>
                    <span>Lain-lain</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {step === "age" && (
            <div className={styles.cardBody}>
              <p className={styles.kicker}>Cabaran sesuai untuk awak</p>
              <h1>Berapa umur awak?</h1>
              <div className={styles.ageRow}>
                {ages.map((age) => (
                  <button
                    key={age}
                    className={`${styles.agePill} ${profile.age === String(age) ? styles.selectedAge : ""}`}
                    type="button"
                    onClick={() => selectAge(age)}
                  >
                    <strong>{age}</strong>
                    <span>tahun</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "ready" && (
            <div className={styles.cardBody}>
              <p className={styles.kicker}>Kita dah jadi kawan!</p>
              <h1>Awak dah bersedia?</h1>
              <p className={styles.storyText}>
                Nampak hutan di sana? Pokok nombor sedang tidur. Jom bantu Pandi hidupkan semula!
              </p>
              <div className={styles.profileChips}>
                <span>🐼 {displayName}</span>
                <span>🏡 {stateLabel}</span>
                {profile.age && <span>⭐ {profile.age} tahun</span>}
              </div>
              <button className={styles.primaryButton} type="button" onClick={startAdventure}>
                Saya Dah Bersedia! 🚀
              </button>
            </div>
          )}

          <p className={styles.privacy}>🔒 Maklumat disimpan pada peranti ini sahaja.</p>
        </div>
      </section>

      <nav className={styles.dock} aria-label="Navigasi PandaiKids">
        <button type="button" onClick={() => router.push("/world/mathematics")}>
          <span>❔</span>
          <strong>Quiz</strong>
          <small>Jawab & Belajar</small>
        </button>
        <button type="button" onClick={() => router.push("/journey")}>
          <span>🌍</span>
          <strong>Dunia</strong>
          <small>Teroka & Main</small>
        </button>
        <button type="button" onClick={() => setModal("collection")}>
          <span>🎒</span>
          <strong>Koleksi</strong>
          <small>Item & Pencapaian</small>
        </button>
        <button type="button" onClick={() => setModal("parent")}>
          <span>👨‍👩‍👧</span>
          <strong>Ibu Bapa</strong>
          <small>Pantau & Laporan</small>
        </button>
      </nav>

      {modal && (
        <div className={styles.modalBackdrop} role="presentation" onClick={() => setModal(null)}>
          <section className={styles.modal} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button className={styles.closeModal} type="button" onClick={() => setModal(null)} aria-label="Tutup">
              ×
            </button>
            {modal === "collection" && (
              <>
                <h2>🎒 Koleksi Pandi</h2>
                <p>Di sini nanti anak boleh lihat pakaian, badge dan hadiah Pandi yang dibuka melalui pembelajaran.</p>
                <button className={styles.primaryButton} type="button" onClick={() => setModal(null)}>
                  Faham
                </button>
              </>
            )}
            {modal === "parent" && (
              <>
                <h2>👨‍👩‍👧 Ruang Ibu Bapa</h2>
                <p>Bahagian ini akan memaparkan perkembangan anak, masa belajar, topik kuat dan topik yang perlu dibimbing.</p>
                <button className={styles.primaryButton} type="button" onClick={() => setModal(null)}>
                  Baik
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
