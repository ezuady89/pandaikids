"use client";

import Link from "next/link";
import type { FormEvent } from "react";

import { StateSelector } from "@/components/onboarding/StateSelector";
import {
  getSchoolLevelFromAge,
  schoolLevelLabels
} from "@/lib/learning-levels";
import type { LearnerProfile, StateSlug } from "@/types";

export type OnboardingCardStep = "name" | "state" | "age" | "ready";

interface OnboardingCardProps {
  numericStep: number;
  profile: LearnerProfile;
  step: OnboardingCardStep;
  stepLabel: string;
  stepNumber: number;
  totalSteps: number;
  nameInput: string;
  onAgeSelect: (age: number) => void;
  onNameInputChange: (value: string) => void;
  onNameSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSavedProfileContinue: () => void;
  onStateSelect: (stateSlug: StateSlug) => void;
}

const childAges = [5, 6, 7, 8, 9, 10, 11, 12] as const;

export function OnboardingCard({
  numericStep,
  profile,
  step,
  stepLabel,
  stepNumber,
  totalSteps,
  nameInput,
  onAgeSelect,
  onNameInputChange,
  onNameSubmit,
  onSavedProfileContinue,
  onStateSelect
}: OnboardingCardProps) {
  const progressWidth = `${(stepNumber / totalSteps) * 100}%`;
  const levelLabel = profile.age
    ? schoolLevelLabels[getSchoolLevelFromAge(profile.age)]
    : schoolLevelLabels[profile.schoolLevel];

  return (
    <section
      className="onboarding-panel onboarding-card step-enter"
      data-card-step={step}
      data-step={numericStep}
      aria-live="polite"
    >
      <div className="step-top">
        <span className="step-label">{stepLabel}</span>
        <span className="step-count">
          {stepNumber} / {totalSteps}
        </span>
      </div>
      <div className="step-track" aria-hidden="true">
        <span style={{ width: progressWidth }} />
      </div>

      <div className="step-content" key={step}>
        {step === "name" && (
          <>
            <span className="onboarding-kicker">
              Selamat datang ke PandaiKids
            </span>
            <h1>
              {profile.name ? `Pandi rindu ${profile.name}!` : "👋 Hai! Saya Pandi."}
            </h1>
            {profile.name ? (
              <p>Kita boleh sambung perjalanan atau berkenalan semula.</p>
            ) : (
              <>
                <p className="onboarding-subtitle">Siapa nama awak?</p>
                <p className="onboarding-helper">
                  Pandi nak jadi kawan belajar awak.
                </p>
              </>
            )}
            {profile.name ? (
              <button
                className="button button-primary"
                type="button"
                onClick={onSavedProfileContinue}
              >
                Sambung bersama Pandi <span aria-hidden="true">→</span>
              </button>
            ) : (
              <form
                className="onboarding-form welcome-name-form"
                onSubmit={onNameSubmit}
              >
                <label className="big-input">
                  <span>Nama saya</span>
                  <input
                    autoComplete="given-name"
                    maxLength={20}
                    placeholder="Contoh: Aisyah"
                    required
                    value={nameInput}
                    onChange={(event) => onNameInputChange(event.target.value)}
                  />
                </label>
                <button className="button button-primary" type="submit">
                  Jom Kenal Pandi! <span aria-hidden="true">→</span>
                </button>
              </form>
            )}
          </>
        )}

        {step === "state" && (
          <>
            <span className="onboarding-kicker">Malaysia rumah kita</span>
            <h1>Awak tinggal di negeri mana?</h1>
            <p>
              Pilih negeri atau wilayah awak. Pandi akan bersiap khas untuk
              awak.
            </p>
            <StateSelector
              selectedState={profile.stateSlug}
              onSelect={onStateSelect}
            />
          </>
        )}

        {step === "age" && (
          <>
            <span className="onboarding-kicker">
              Supaya sesuai untuk awak
            </span>
            <h1>Berapa umur awak?</h1>
            <p>Pilih umur awak. Tiada jawapan yang salah di sini.</p>
            <div className="age-grid">
              {childAges.map((age) => (
                <button
                  className={`age-button${
                    Number(profile.age) === age ? " selected" : ""
                  }`}
                  key={age}
                  type="button"
                  onClick={() => onAgeSelect(age)}
                >
                  {age}
                  <small>tahun</small>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "ready" && (
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
              {profile.state
                ? ` Pengembaraan kita bermula dari ${profile.state}!`
                : ""}
            </p>
            <div className="profile-ribbon">
              <span>♥ {profile.name}</span>
              <span>⌂ {profile.state}</span>
              <span>
                ★ {profile.age} tahun · {levelLabel}
              </span>
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
        <span aria-hidden="true">●</span> Maklumat disimpan pada peranti ini
        sahaja.
      </p>
    </section>
  );
}
