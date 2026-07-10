"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useMemo, useState } from "react";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { DailySummary } from "@/components/math-forest/DailySummary";
import { ForestProgress } from "@/components/math-forest/ForestProgress";
import { MathQuestionCard } from "@/components/math-forest/MathQuestionCard";
import { PandiTeacher } from "@/components/math-forest/PandiTeacher";
import { VisualExplanation } from "@/components/math-forest/VisualExplanation";
import { getMathematicsQuestionsForLevel } from "@/data/questions/mathematics";
import {
  getSchoolLevelFromProfile,
  schoolLevelLabels
} from "@/lib/learning-levels";
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
  | "summary";

interface MilestoneCopy {
  title: string;
  text: string;
}

function getMilestoneQuestions(totalQuestions: number): readonly number[] {
  if (totalQuestions >= 12) return [4, 8, totalQuestions];

  return Array.from(
    new Set(
      [
        Math.ceil(totalQuestions / 3),
        Math.ceil((totalQuestions * 2) / 3),
        totalQuestions
      ].filter((value) => value > 0)
    )
  );
}

function getMilestoneCopy(
  completedQuestions: number,
  totalQuestions: number
): MilestoneCopy | undefined {
  const milestoneIndex = getMilestoneQuestions(totalQuestions).indexOf(
    completedQuestions
  );

  if (milestoneIndex === 0) {
    return {
      title: "Bunga mula mekar 🌸",
      text: "Bagus! Jawapan awak buat laluan hutan nampak lebih ceria."
    };
  }

  if (milestoneIndex === 1) {
    return {
      title: "Burung mula kembali ke hutan 🐦",
      text: "Hebat! Hutan Matematik semakin hidup kerana awak terus mencuba."
    };
  }

  if (milestoneIndex === 2) {
    return {
      title: "Hutan Matematik kembali ceria!",
      text: "Terima kasih kerana bantu Pandi sampai habis pengembaraan kecil ini."
    };
  }

  return undefined;
}

function getForestMood(
  completedQuestions: number,
  totalQuestions: number
): string {
  if (totalQuestions > 0 && completedQuestions >= totalQuestions) {
    return "forest-complete";
  }

  const progress = totalQuestions > 0 ? completedQuestions / totalQuestions : 0;

  if (progress >= 2 / 3) return "forest-awake";
  if (progress >= 1 / 3) return "forest-growing";
  return "forest-sleepy";
}

function getPandiMessage(
  phase: ForestPhase,
  profile: LearnerProfile,
  completedQuestions: number,
  totalQuestions: number
): string {
  const childName = profile.name || "kawan Pandi";
  const firstMilestone = Math.ceil(totalQuestions / 3);
  const secondMilestone = Math.ceil((totalQuestions * 2) / 3);

  if (phase === "intro") {
    return `${childName}... Pokok Nombor sedang tidur. Jom bantu Pandi.`;
  }

  if (phase === "teaching") {
    return "Tak apa 😊 Jom Pandi tunjuk cara.";
  }

  if (phase === "correct") {
    return "Hebatnya! Pandi bangga dengan awak.";
  }

  if (phase === "milestone") {
    return "Wah, hutan semakin ceria!";
  }

  if (phase === "summary") {
    return `Pandi bangga sebab ${childName} terus mencuba.`;
  }

  if (completedQuestions >= secondMilestone) {
    return "Dengar tak? Hutan sudah mula hidup semula.";
  }

  if (completedQuestions >= firstMilestone) {
    return "Bunga sudah mekar. Jom teruskan.";
  }

  return "Pilih jawapan besar di bawah ya.";
}

export function MathForestExperience() {
  const [profile, setProfile] = useState<LearnerProfile>(emptyProfile);
  const [phase, setPhase] = useState<ForestPhase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const activeLevel = useMemo(
    () => getSchoolLevelFromProfile(profile),
    [profile]
  );
  const missionQuestions = useMemo(
    () => getMathematicsQuestionsForLevel(activeLevel),
    [activeLevel]
  );
  const totalQuestions = missionQuestions.length;
  const milestoneQuestions = useMemo(
    () => getMilestoneQuestions(totalQuestions),
    [totalQuestions]
  );
  const questionTopics = useMemo(
    () => new Set(missionQuestions.map((question) => question.topic)).size,
    [missionQuestions]
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedProfile = readProfile();
      const savedLevel = getSchoolLevelFromProfile(savedProfile);
      const savedQuestions = getMathematicsQuestionsForLevel(savedLevel);
      const savedTotalQuestions = savedQuestions.length;
      const savedProgress = readMathForestProgress(savedLevel);

      setProfile(savedProfile);
      setCompletedQuestions(
        Math.min(savedProgress.completedQuestions, savedTotalQuestions)
      );
      setCorrectAnswers(
        Math.min(savedProgress.correctAnswers, savedTotalQuestions)
      );

      if (savedProgress.completedQuestions >= savedTotalQuestions) {
        setQuestionIndex(Math.max(savedTotalQuestions - 1, 0));
        setPhase("summary");
        return;
      }

      setQuestionIndex(
        Math.min(savedProgress.completedQuestions, savedTotalQuestions - 1)
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const currentQuestion = missionQuestions[questionIndex];
  const forestMood = getForestMood(completedQuestions, totalQuestions);
  const profileScene = profile.stateSlug
    ? `/assets/states/pandi/${profile.stateSlug}.webp`
    : "/assets/states/pandi/default.webp";
  const pageStyle = {
    "--math-forest-scene": `url("${withBasePath(profileScene)}")`
  } as CSSProperties;
  const pandiMessage = useMemo(
    () => getPandiMessage(phase, profile, completedQuestions, totalQuestions),
    [completedQuestions, phase, profile, totalQuestions]
  );
  const milestone = getMilestoneCopy(completedQuestions, totalQuestions);

  function startAdventure(): void {
    setPhase("question");
  }

  function saveProgress(nextCompleted: number, nextCorrect: number): void {
    const progress = readMathForestProgress(activeLevel);

    saveMathForestProgress(
      {
        completedQuestions: nextCompleted,
        correctAnswers: nextCorrect,
        collectedRewards: progress.collectedRewards,
        completedAt:
          nextCompleted >= totalQuestions ? new Date().toISOString() : undefined
      },
      activeLevel
    );
  }

  function answerQuestion(answer: number): void {
    if (phase !== "question") return;

    if (answer !== currentQuestion.answer) {
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
    if (milestoneQuestions.includes(completedQuestions)) {
      setPhase("milestone");
      return;
    }

    goToNextQuestion();
  }

  function continueAfterMilestone(): void {
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
    const progress = readMathForestProgress(activeLevel);

    setQuestionIndex(0);
    setCompletedQuestions(0);
    setCorrectAnswers(0);
    saveMathForestProgress(
      {
        completedQuestions: 0,
        correctAnswers: 0,
        collectedRewards: progress.collectedRewards
      },
      activeLevel
    );
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
          <span className="forest-butterfly butterfly-a" />
          <span className="forest-butterfly butterfly-b" />
          <span className="forest-sparkle sparkle-a" />
          <span className="forest-sparkle sparkle-b" />
          <span className="forest-glow-tree tree-glow-a" />
          <span className="forest-glow-tree tree-glow-b" />
          <span className="forest-flowerbed flowerbed-a" />
          <span className="forest-flowerbed flowerbed-b" />
          <span className="forest-leaf leaf-a" />
          <span className="forest-leaf leaf-b" />
          <span className="forest-bird bird-one" />
          <span className="forest-bird bird-two" />
          <span className="forest-rainbow" />
          <span className="forest-river" />
        </div>

        <div className="math-forest-topbar">
          <Link href="/" aria-label="Kembali ke laman utama">
            ← Laman Utama
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
            pose={
              phase === "teaching"
                ? "teacher"
                : phase === "correct" || phase === "milestone"
                  ? "celebrate"
                  : phase === "intro"
                    ? "explorer"
                    : "thinking"
            }
          />

          {phase === "intro" ? (
            <section className="forest-story-card">
              <span className="math-forest-eyebrow">
                Misi {schoolLevelLabels[activeLevel]}
              </span>
              <h1>Jom hidupkan Hutan Matematik</h1>
              <div className="story-lines">
                <p>Pandi nampak Pokok Nombor sedang tidur.</p>
                <p>Jom bantu Pandi hidupkan Hutan Matematik.</p>
                <p>
                  Setiap soalan yang awak jawab akan buat hutan ini semakin
                  ceria.
                </p>
              </div>
              <button
                className="button button-primary"
                type="button"
                onClick={startAdventure}
              >
                Jom Mula Belajar
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
              <h2>Tak apa 😊</h2>
              <p>Jom Pandi tunjuk cara.</p>
              <p>{currentQuestion.explanation}</p>
              <VisualExplanation question={currentQuestion} />
              <button
                className="button button-primary"
                type="button"
                onClick={retryQuestion}
              >
                Saya faham 😊
              </button>
            </section>
          ) : null}

          {phase === "correct" ? (
            <section className="correct-panel">
              <span className="math-forest-eyebrow">Jawapan betul</span>
              <h2>Hebatnya!</h2>
              <p>Pandi bangga dengan awak. Hutan semakin ceria!</p>
              <button
                className="button button-primary"
                type="button"
                onClick={continueAfterCorrect}
              >
                Soalan seterusnya →
              </button>
            </section>
          ) : null}

          {phase === "milestone" ? (
            <section className="milestone-panel">
              <span className="math-forest-eyebrow">Hutan berubah</span>
              <h2>{milestone?.title}</h2>
              <p>{milestone?.text}</p>
              <button
                className="button button-primary"
                type="button"
                onClick={continueAfterMilestone}
              >
                {completedQuestions >= totalQuestions
                  ? "Lihat ringkasan"
                  : "Teruskan belajar →"}
              </button>
            </section>
          ) : null}

          {phase === "summary" ? (
            <DailySummary
              correctAnswers={correctAnswers}
              onRestart={restartMission}
              profile={profile}
              schoolLevelLabel={schoolLevelLabels[activeLevel]}
              topicCount={questionTopics}
              totalQuestions={totalQuestions}
            />
          ) : null}
        </section>
      </main>
    </div>
  );
}
