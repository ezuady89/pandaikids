"use client";

import Link from "next/link";
import { type CSSProperties, useState } from "react";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { MascotImage } from "@/components/mascot/MascotImage";
import { learningGames } from "@/data/games";
import { withBasePath } from "@/lib/paths";
import { saveGameScore } from "@/lib/storage";
import type { GameId } from "@/types";

interface AnswerState {
  selected: number;
  correct: number;
}

interface GameExperienceProps {
  gameId: GameId;
}

const gameStyle = {
  "--learning-background": `url("${withBasePath(
    "/assets/backgrounds/pandaikids-learning-valley-v1.webp"
  )}")`
} as CSSProperties;

export function GameExperience({ gameId }: GameExperienceProps) {
  const game = learningGames[gameId];
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState | null>(null);
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);
  const [coachMessage, setCoachMessage] = useState("Pandi teman kamu!");

  const question = game.questions[questionIndex];

  function selectAnswer(answerIndex: number): void {
    if (answerState || finished) return;

    const correct = answerIndex === question.correctAnswer;
    const nextScore = correct ? score + 1 : score;

    setAnswerState({
      selected: answerIndex,
      correct: question.correctAnswer
    });
    setScore(nextScore);
    setCoachMessage(
      correct ? "Hebat! Pandi bangga!" : "Tak apa, kita cuba lagi!"
    );
    setFeedback(
      correct
        ? "Hebat! Jawapan tepat! ✦"
        : `Hampir! Jawapannya ialah ${
            question.answers[question.correctAnswer]
          }.`
    );

    window.setTimeout(() => {
      setFeedback("");
      setCoachMessage("Pandi teman kamu!");
      setAnswerState(null);

      if (questionIndex + 1 < game.questions.length) {
        setQuestionIndex((index) => index + 1);
        return;
      }

      setFinished(true);
      saveGameScore(gameId, nextScore);
    }, 900);
  }

  function replay(): void {
    setQuestionIndex(0);
    setScore(0);
    setAnswerState(null);
    setFeedback("");
    setFinished(false);
    setCoachMessage("Pandi teman kamu!");
  }

  const progress = finished
    ? 100
    : (questionIndex / game.questions.length) * 100;

  return (
    <div className="game-page" style={gameStyle}>
      <SiteHeader compact />
      <aside className="game-pandi" aria-label="Pandi ialah guru kamu">
        <span>{coachMessage}</span>
        <MascotImage
          alt="Pandi"
          priority
          sizes="(max-width: 680px) 88px, 185px"
        />
      </aside>
      <main className="game-shell">
        <div className="game-top">
          <Link href="/journey" aria-label="Keluar">
            ←
          </Link>
          <div className="game-progress" aria-label="Kemajuan permainan">
            <span style={{ width: `${progress}%` }} />
          </div>
          <strong>
            {questionIndex + 1}/{game.questions.length}
          </strong>
          <div className="stars">
            ★ <span>{score}</span>
          </div>
        </div>
        <section className={`game-main${finished ? " finished" : ""}`}>
          <div className="play-area">
            <span className="game-kicker">{game.kicker}</span>
            <h1>{game.title}</h1>
            <p>{game.intro}</p>
            <div className="question-card">
              <div
                className={`question${question.compact ? " small" : ""}`}
              >
                {question.question}
              </div>
            </div>
            <div className="answers">
              {question.answers.map((answer, answerIndex) => {
                let answerClass = "answer";
                if (answerState?.selected === answerIndex) {
                  answerClass +=
                    answerIndex === answerState.correct ? " correct" : " wrong";
                } else if (
                  answerState &&
                  answerState.correct === answerIndex
                ) {
                  answerClass += " correct";
                }

                return (
                  <button
                    className={answerClass}
                    key={answer}
                    type="button"
                    onClick={() => selectAnswer(answerIndex)}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>
            <div
              className={`feedback${
                feedback
                  ? answerState?.selected === answerState?.correct
                    ? " success"
                    : " error"
                  : ""
              }`}
              aria-live="polite"
            >
              {feedback}
            </div>
          </div>
          <div className={`game-finish${finished ? " show" : ""}`}>
            <div className="trophy" aria-hidden="true">
              🏆
            </div>
            <span className="eyebrow">Misi Selesai</span>
            <h1>Kamu memang hebat!</h1>
            <p>
              Kamu mendapat{" "}
              <strong>
                {score} daripada {game.questions.length}
              </strong>{" "}
              bintang.
            </p>
            <button
              className="button button-primary"
              type="button"
              onClick={replay}
            >
              Main Lagi ↻
            </button>{" "}
            <Link className="button button-soft" href="/journey">
              Pilih Dunia
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
