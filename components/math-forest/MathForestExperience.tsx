"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useMemo, useState } from "react";

import { DailySummary } from "@/components/math-forest/DailySummary";
import { BlindBoxModal } from "@/components/math-forest/BlindBoxModal";
import { ForestProgress } from "@/components/math-forest/ForestProgress";
import { MathQuestionCard } from "@/components/math-forest/MathQuestionCard";
import { PandiTeacher } from "@/components/math-forest/PandiTeacher";
import { RewardModal } from "@/components/math-forest/RewardModal";
import { VisualExplanation } from "@/components/math-forest/VisualExplanation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { mathForestFirstMissionQuestions } from "@/data/questions/math-year1";
import { withBasePath } from "@/lib/paths";
import {
  emptyProfile,
  readMathForestProgress,
  readProfile,
  saveMathForestProgress
} from "@/lib/storage";
import type { LearnerProfile } from "@/types";

type ForestPhase =
  | "intro"
  | "question"
  | "teaching"
  | "correct"
  | "milestone"
  | "blindbox"
  | "summary";

const missionQuestions = mathForestFirstMissionQuestions;
const totalQuestions = missionQuestions.length;

const completedMilestones: readonly number[] = [4, 8, 12];

function getForestMood(completedQuestions: number): string {
  if (completedQuestions >= 12) return "forest-complete";
  if (completedQuestions >= 8) return "forest-awake";
  if (completedQuestions >= 4) return "forest-growing";
  return "forest-sleepy";
}

function getPandiMessage(
  phase: ForestPhase,
  profile: LearnerProfile,
  completedQuestions: number
): string {
  const childName = profile.name || "kawan Pandi";

  if (phase === "intro") {
    return `${childName}... pokok nombor sedang tidur. Jom bantu Pandi.`;
  }

  if (phase === "teaching") {
    return `Ia tidak mengapa, ${childName} 😊 Pandi tunjuk cara.`;
  }

  if (phase === "correct") {
    return "Hebat! Hutan semakin ceria.";
  }

  if (phase === "milestone") {
    return "Wah! Hutan berubah kerana awak terus mencuba.";
  }

  if (phase === "blindbox") {
    return "Ada kotak ajaib! Ketuk perlahan-lahan.";
  }

  if (phase === "summary") {
    return `Pandi bangga dengan ${childName}!`;
  }

  if (completedQuestions >= 8) {
    return "Dengar tak? Sungai ilmu sudah mula bersinar!";
  }

  if (completedQuestions >= 4) {
    return "Bunga sudah mekar. Pandi suka sangat!";
  }

  return "Pilih jawapan besar di bawah ya. Pandi tunggu.";
}

export function MathForestExperience() {
  const [profile, setProfile] = useState<LearnerProfile>(emptyProfile);
  const [phase, setPhase] = useState<ForestPhase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedProfile = readProfile();
      const savedProgress = readMathForestProgress();

      setProfile(savedProfile);
      setCompletedQuestions(
        Math.min(savedProgress.completedQuestions, totalQuestions)
      );
      setCorrectAnswers(Math.min(savedProgress.correctAnswers, totalQuestions));

      if (savedProgress.completedQuestions >= totalQuestions) {
        setQuestionIndex(totalQuestions - 1);
        setPhase("summary");
        return;
      }

      setQuestionIndex(
        Math.min(savedProgress.completedQuestions, totalQuestions - 1)
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const currentQuestion = missionQuestions[questionIndex];
  const childName = profile.name || "kawan Pandi";
  const forestMood = getForestMood(completedQuestions);
  const profileScene = profile.stateSlug
    ? `/assets/states/pandi/${profile.stateSlug}.webp`
    : "/assets/states/pandi/default.webp";
  const pageStyle = {
    "--math-forest-scene": `url("${withBasePath(profileScene)}")`
  } as CSSProperties;
  const pandiMessage = useMemo(
    () => getPandiMessage(phase, profile, completedQuestions),
    [completedQuestions, phase, profile]
  );

  function startAdventure(): void {
    setPhase("question");
  }

  function saveProgress(nextCompleted: number, nextCorrect: number): void {
    saveMathForestProgress({
      completedQuestions: nextCompleted,
      correctAnswers: nextCorrect,
      collectedRewards: readMathForestProgress().collectedRewards,
      completedAt:
        nextCompleted >= totalQuestions ? new Date().toISOString() : undefined
    });
  }

  function answerQuestion(answer: number): void {
    if (phase !== "question") return;

    if (answer !== currentQuestion.correctAnswer) {
      setPhase("teaching");
      return;
    }

    const nextCompleted = Math.max(completedQuestions, questionIndex + 1);
    const nextCorrect = correctAnswers + 1;

    setCompletedQuestions(nextCompleted);
    setCorrectAnswers(nextCorrect);
    saveProgress(nextCompleted, nextCorrect);
    setPhase("correct");
  }

  function continueAfterCorrect(): void {
    if (completedMilestones.includes(completedQuestions)) {
      setPhase("milestone");
      return;
    }

    goToNextQuestion();
  }

  function continueAfterMilestone(): void {
    if (completedQuestions === 8 || completedQuestions === 12) {
      setPhase("blindbox");
      return;
    }

    goToNextQuestion();
  }

  function continueAfterBlindBox(): void {
    if (completedQuestions >= totalQuestions) {
      setPhase("summary");
      return;
    }

    goToNextQuestion();
  }

  function goToNextQuestion(): void {
    if (questionIndex + 1 >= totalQuestions) {
      setPhase("summary");
      return;
    }

    setQuestionIndex((index) => index + 1);
    setPhase("question");
  }

  function retryQuestion(): void {
    setPhase("question");
  }

  function restartMission(): void {
    setQuestionIndex(0);
    setCompletedQuestions(0);
    setCorrectAnswers(0);
    saveMathForestProgress({
      completedQuestions: 0,
      correctAnswers: 0,
      collectedRewards: readMathForestProgress().collectedRewards
    });
    setPhase("intro");
  }

  return (
    <div
      className={`math-forest-page ${forestMood} phase-${phase}`}
      style={pageStyle}
    >
      <SiteHeader compact />
      <main className="math-forest-shell">
        <div className="forest-ambient" aria-hidden="true">
          <span className="forest-sunbeam" />
          <span className="forest-cloud cloud-left" />
          <span className="forest-cloud cloud-right" />
          <span className="forest-butterfly butterfly-a">🦋</span>
          <span className="forest-butterfly butterfly-b">🦋</span>
          <span className="forest-sparkle sparkle-a">✦</span>
          <span className="forest-sparkle sparkle-b">✦</span>
          <span className="forest-glow-tree tree-glow-a">♣</span>
          <span className="forest-glow-tree tree-glow-b">♣</span>
          <span className="forest-flowerbed flowerbed-a">🌸 🌼 🌺</span>
          <span className="forest-flowerbed flowerbed-b">🌷 🌻 🌸</span>
          <span className="forest-leaf leaf-a">🍃</span>
          <span className="forest-leaf leaf-b">🍃</span>
          <span className="forest-bird bird-one">⌁</span>
          <span className="forest-bird bird-two">⌁</span>
          <span className="forest-rainbow" />
          <span className="forest-river" />
        </div>

        <div className="math-forest-topbar">
          <Link href="/journey" aria-label="Kembali ke perjalanan">
            ← Perjalanan
          </Link>
          <ForestProgress
            completedQuestions={completedQuestions}
            totalQuestions={totalQuestions}
          />
        </div>

        <section className={`math-forest-stage phase-${phase}`}>
          <PandiTeacher
            completedQuestions={completedQuestions}
            message={pandiMessage}
            mood={
              phase === "teaching"
                ? "teacher"
                : phase === "correct" || phase === "milestone"
                  ? "celebrate"
                  : "guide"
            }
            profile={profile}
          />

          {phase === "intro" ? (
            <section className="forest-story-card">
              <span className="math-forest-eyebrow">Misi Pertama</span>
              <h1>{childName}... hutan perlukan bantuan</h1>
              <p>
                Pokok nombor sedang tidur. Jom bantu Pandi hidupkan semula
                Hutan Matematik, satu soalan pada satu masa.
              </p>
              <div className="story-points">
                <span>🌳 Bangunkan pokok nombor</span>
                <span>🌸 Mekarkan bunga ajaib</span>
                <span>🎁 Dapat Blind Box belajar</span>
              </div>
              <button
                className="button button-primary"
                type="button"
                onClick={startAdventure}
              >
                Mula bantu Pandi 🚀
              </button>
            </section>
          ) : null}

          {phase === "question" ? (
            <MathQuestionCard
              onAnswer={answerQuestion}
              question={currentQuestion}
              questionNumber={questionIndex + 1}
              totalQuestions={totalQuestions}
            />
          ) : null}

          {phase === "teaching" ? (
            <section className="teaching-panel">
              <span className="math-forest-eyebrow">Pandi tunjuk cara</span>
              <h2>Ia tidak mengapa, {childName} 😊</h2>
              <p>{currentQuestion.teachingText}</p>
              <VisualExplanation question={currentQuestion} />
              <button
                className="button button-primary"
                type="button"
                onClick={retryQuestion}
              >
                Saya faham, cuba lagi 💪
              </button>
            </section>
          ) : null}

          {phase === "correct" ? (
            <section className="correct-panel">
              <div className="correct-stars" aria-hidden="true">
                <span>⭐</span>
                <span>✨</span>
                <span>🌸</span>
              </div>
              <span className="math-forest-eyebrow">Jawapan tepat</span>
              <h2>Hutan makin ceria!</h2>
              <p>
                Pokok nombor bangun sedikit lagi. Lihat, cahaya hutan makin
                hangat.
              </p>
              <button
                className="button button-primary"
                type="button"
                onClick={continueAfterCorrect}
              >
                Teruskan →
              </button>
            </section>
          ) : null}

          {phase === "summary" ? (
            <DailySummary
              correctAnswers={correctAnswers}
              profile={profile}
              totalQuestions={totalQuestions}
            />
          ) : null}
        </section>

        {phase === "milestone" ? (
          <RewardModal
            completedQuestions={completedQuestions}
            onContinue={continueAfterMilestone}
          />
        ) : null}

        {phase === "blindbox" ? (
          <BlindBoxModal
            completedQuestions={completedQuestions}
            onContinue={continueAfterBlindBox}
          />
        ) : null}

        {phase === "summary" ? (
          <button
            className="restart-forest-button"
            type="button"
            onClick={restartMission}
          >
            Ulang misi Hutan Matematik
          </button>
        ) : null}
      </main>
    </div>
  );
}
