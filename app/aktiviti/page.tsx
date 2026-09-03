"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Question = { id: string; subject: string; year: number; topic: string; question: string; choices: string[]; answer: string; explanation: string };
type QuestionEdit = Pick<Question, "question" | "choices" | "answer" | "explanation">;
const example: Question = { id: "contoh", subject: "Bahasa Melayu", year: 3, topic: "Kata ganti nama", question: "Aina membawa buku ke sekolah. ______ suka membaca.", choices: ["Saya", "Dia", "Kami", "Mereka"], answer: "B", explanation: "Aina dirujuk dengan kata ganti nama “Dia”." };

function cleanQuestion(text: string) {
  return text.replace(/^[^:]{0,220}:\s*/, "").trim();
}

function readEdits(encoded: string | null): Record<string, QuestionEdit> {
  if (!encoded) return {};
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0))));
  } catch { return {}; }
}

const themes = [
  { id: "coral", label: "Oren" }, { id: "ocean", label: "Biru" }, { id: "mint", label: "Hijau" },
  { id: "sun", label: "Kuning" }, { id: "berry", label: "Merah jambu" },
];

export default function AktivitiPage() {
  const [questions, setQuestions] = useState<Question[]>([example]);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [theme, setTheme] = useState("coral");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("soalan")?.split(",").filter(Boolean) ?? [];
    const bankKey = params.get("bank");
    const edits = readEdits(params.get("ubah"));
    const loadQuestions = (selectedBank: string, selectedIds: string[], selectedEdits: Record<string, QuestionEdit>, selectedTheme?: string) => {
      if (selectedTheme && themes.some((item) => item.id === selectedTheme)) setTheme(selectedTheme);
      fetch(`/data/cikgu-bank/${selectedBank}.json`).then((response) => response.json()).then((bank) => {
        const map = new Map<string, Question>(bank.questions.map((question: Question) => [question.id, question]));
        const selected = selectedIds.map((id) => {
        const original = map.get(id);
          return original ? { ...original, ...selectedEdits[id] } : undefined;
        }).filter(Boolean) as Question[];
        if (selected.length) setQuestions(selected);
      }).catch(() => undefined);
    };
    const quizId = params.get("kuiz");
    if (quizId) {
      fetch(`/api/cikgu-quiz/${quizId}`).then((response) => response.ok ? response.json() : undefined).then((quiz) => {
        if (quiz) loadQuestions(quiz.source_bank, quiz.question_ids, quiz.question_overrides ?? {}, quiz.theme);
      }).catch(() => undefined);
      return;
    }
    if (ids.length && bankKey) loadQuestions(bankKey, ids, edits);
  }, []);

  const question = questions[index] ?? example;
  const correctIndex = question.answer.charCodeAt(0) - 65;
  const isCorrect = choice === correctIndex;
  const title = useMemo(() => `${question.subject} · Tahun ${question.year}`, [question]);
  const choose = (answerIndex: number) => {
    if (choice !== null) return;
    setChoice(answerIndex);
    if (answerIndex === correctIndex) setScore((current) => current + 1);
  };
  const next = () => {
    if (choice === null) return;
    if (index + 1 === questions.length) setFinished(true);
    else { setIndex(index + 1); setChoice(null); }
  };

  if (finished) return <main className={styles.page} data-theme={theme}><section className={styles.finish}><span>✦</span><h1>Kuiz selesai!</h1><p>Markah anda: <strong>{score}/{questions.length}</strong></p><a href="/">Kembali ke Pandaikids Cikgu</a></section></main>;
  return <main className={styles.page} data-theme={theme}>
    <header className={styles.header}><a href="/" className={styles.logo}><img src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" /></a><a href="/aktiviti/pilih/" className={styles.exit}>← Pilih soalan</a></header>
    <section className={styles.shell}>
      <div className={styles.title}><span>KUIZ PILIHAN CIKGU</span><h1>{title}</h1><div className={styles.themes} aria-label="Pilih warna kuiz"><small>Pilih warna</small>{themes.map((item) => <button key={item.id} type="button" aria-label={item.label} title={item.label} className={theme === item.id ? styles.themeActive : ""} data-colour={item.id} onClick={() => setTheme(item.id)} />)}</div></div>
      <article className={styles.card}>
        <div className={styles.progressRow}><b>Soalan {index + 1} daripada {questions.length}</b><div className={styles.progress} style={{ "--progress": `${((index + 1) / questions.length) * 100}%` } as React.CSSProperties}><i /></div></div>
        <h2>{question.topic}</h2><p className={styles.question}>{cleanQuestion(question.question)}</p>
        <div className={styles.answers}>{question.choices.map((answer, answerIndex) => {
          const state = choice === null ? "" : answerIndex === correctIndex ? styles.correct : choice === answerIndex ? styles.wrong : "";
          return <button className={`${styles.answer} ${state}`} key={answer} disabled={choice !== null} onClick={() => choose(answerIndex)}><b>{String.fromCharCode(65 + answerIndex)}</b>{answer}{answerIndex === correctIndex && choice !== null ? <span>✓</span> : null}</button>;
        })}</div>
        {choice !== null ? <><p className={`${styles.feedback} ${isCorrect ? styles.good : styles.tryAgain}`}>{isCorrect ? `Betul! ${question.explanation}` : `Jawapan yang betul ialah ${question.answer}.`}</p><button className={styles.next} onClick={next}>{index + 1 === questions.length ? "Selesai" : "Seterusnya"} <span>→</span></button></> : null}
      </article>
    </section>
  </main>;
}
