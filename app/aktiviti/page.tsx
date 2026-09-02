"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Question = { id: string; subject: string; year: number; topic: string; question: string; choices: string[]; answer: string; explanation: string };
const example: Question = { id: "contoh", subject: "Bahasa Melayu", year: 3, topic: "Kata ganti nama", question: "Aina membawa buku ke sekolah. ______ suka membaca.", choices: ["Saya", "Dia", "Kami", "Mereka"], answer: "B", explanation: "Aina dirujuk dengan kata ganti nama “Dia”." };

export default function AktivitiPage() {
  const [questions, setQuestions] = useState<Question[]>([example]);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("soalan")?.split(",").filter(Boolean) ?? [];
    const bankKey = params.get("bank");
    if (!ids.length || !bankKey) return;
    fetch(`/data/cikgu-bank/${bankKey}.json`).then((response) => response.json()).then((bank) => {
      const map = new Map<string, Question>(bank.questions.map((question: Question) => [question.id, question]));
      const selected = ids.map((id) => map.get(id)).filter(Boolean) as Question[];
      if (selected.length) setQuestions(selected);
    }).catch(() => undefined);
  }, []);

  const question = questions[index] ?? example;
  const correctIndex = question.answer.charCodeAt(0) - 65;
  const isCorrect = choice === correctIndex;
  const title = useMemo(() => `${question.subject} · Tahun ${question.year}`, [question]);
  const next = () => {
    if (!isCorrect) return;
    if (index + 1 === questions.length) setFinished(true);
    else { setIndex(index + 1); setChoice(null); }
  };

  if (finished) return <main className={styles.page}><section className={styles.finish}><span>✦</span><h1>Kuiz selesai!</h1><p>Bagus kerana menjawab semua {questions.length} soalan.</p><a href="/">Kembali ke Pandaikids Cikgu</a></section></main>;
  return <main className={styles.page}>
    <header className={styles.header}><a href="/" className={styles.logo}><img src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" /></a><a href="/aktiviti/pilih/" className={styles.exit}>← Pilih soalan</a></header>
    <section className={styles.shell}>
      <div className={styles.title}><span>AKTIVITI PILIHAN CIKGU</span><h1>{title}</h1></div>
      <article className={styles.card}>
        <div className={styles.progressRow}><b>Soalan {index + 1} daripada {questions.length}</b><div className={styles.progress} style={{ "--progress": `${((index + 1) / questions.length) * 100}%` } as React.CSSProperties}><i /></div></div>
        <h2>{question.topic}</h2><p className={styles.question}>{question.question}</p>
        <div className={styles.answers}>{question.choices.map((answer, answerIndex) => {
          const state = choice === null ? "" : answerIndex === correctIndex ? styles.correct : choice === answerIndex ? styles.wrong : "";
          return <button className={`${styles.answer} ${state}`} key={answer} onClick={() => setChoice(answerIndex)}><b>{String.fromCharCode(65 + answerIndex)}</b>{answer}{answerIndex === correctIndex && choice !== null ? <span>✓</span> : null}</button>;
        })}</div>
        {choice !== null ? <p className={`${styles.feedback} ${isCorrect ? styles.good : styles.tryAgain}`}>{isCorrect ? `Betul! ${question.explanation}` : "Cuba lagi — baca soalan sekali lagi."}</p> : null}
        <button className={styles.next} disabled={!isCorrect} onClick={next}>{index + 1 === questions.length ? "Selesai" : "Seterusnya"} <span>→</span></button>
      </article>
    </section>
  </main>;
}
