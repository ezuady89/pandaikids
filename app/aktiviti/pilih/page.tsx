"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Question = { id: string; subject: string; year: number; topic: string; topicCode: string; set: number; question: string; choices: string[]; answer: string; explanation: string };
type Bank = { key: string; questions: Question[] };
type Manifest = { questionCount: number; subjects: string[] };

const subjectColours: Record<string, string> = { Matematik: "math", "Bahasa Melayu": "bm", Sains: "science", "Bahasa Inggeris": "english", "Pendidikan Islam": "islam" };

function cleanQuestion(question: Question) {
  return question.question.replace(/^.*?Tahun\s+\d+[^:]*,\s*Set\s+\d+\s*:\s*/i, "").trim();
}

export default function PilihAktivitiPage() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [bank, setBank] = useState<Bank | null>(null);
  const [subject, setSubject] = useState("Matematik");
  const [year, setYear] = useState(1);
  const [topic, setTopic] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const bankKey = `${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-tahun-${year}`;

  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get("subjek");
    if (preset) setSubject(preset);
    fetch("/data/cikgu-bank/manifest.json").then((response) => response.json()).then(setManifest).catch(() => undefined);
  }, []);

  useEffect(() => {
    setBank(null);
    fetch(`/data/cikgu-bank/${bankKey}.json`).then((response) => response.json()).then(setBank).catch(() => undefined);
  }, [bankKey]);

  const yearQuestions = bank?.questions ?? [];
  const topics = useMemo(() => Array.from(new Map(yearQuestions.map((question) => [question.topicCode, question.topic])).entries()).map(([id, name]) => ({ id, name })), [yearQuestions]);

  useEffect(() => {
    setTopic(topics[0]?.id ?? "");
    setPreviewIndex(0);
    setSelected([]);
    setShowAnswer(false);
  }, [bankKey, topics]);

  const questions = useMemo(() => yearQuestions.filter((question) => question.topicCode === topic), [yearQuestions, topic]);
  const question = questions[previewIndex];
  const selectedHere = question ? selected.includes(question.id) : false;

  const chooseSubject = (item: string) => setSubject(item);
  const chooseYear = (item: number) => setYear(item);
  const chooseTopic = (item: string) => { setTopic(item); setPreviewIndex(0); setShowAnswer(false); };
  const toggleCurrent = () => question && setSelected((current) => current.includes(question.id) ? current.filter((id) => id !== question.id) : [...current, question.id]);
  const selectAll = () => setSelected((current) => Array.from(new Set([...current, ...questions.map((item) => item.id)])));
  const move = (amount: number) => { setPreviewIndex((current) => Math.max(0, Math.min(questions.length - 1, current + amount))); setShowAnswer(false); };
  const launch = () => { if (selected.length) window.location.href = `/aktiviti/?bank=${bankKey}&soalan=${selected.join(",")}`; };

  if (!manifest || !bank || !question) return <main className={styles.loading}>Memuatkan bank soalan Pandaikids…</main>;

  return <main className={styles.page}>
    <header className={styles.header}><a href="/" className={styles.logo}><img src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" /></a><a href="/" className={styles.exit}>← Kembali</a></header>
    <section className={styles.hero}><span>AKTIVITI SIAP PANDAIKIDS</span><h1>Pilih soalan seperti<br />murid akan melihatnya.</h1><p>{manifest.questionCount.toLocaleString("ms-MY")} soalan untuk Tahun 1 hingga 6.</p></section>
    <section className={styles.workspace}>
      <div className={styles.filters}>
        <div><b>1</b><span>Subjek</span><div className={styles.subjects}>{manifest.subjects.map((item) => <button key={item} onClick={() => chooseSubject(item)} className={`${subject === item ? styles.active : ""} ${styles[subjectColours[item]]}`}>{item}</button>)}</div></div>
        <div><b>2</b><span>Tahun</span><div className={styles.years}>{[1, 2, 3, 4, 5, 6].map((item) => <button key={item} onClick={() => chooseYear(item)} className={year === item ? styles.active : ""}>Tahun {item}</button>)}</div></div>
      </div>
      <div className={styles.topicBlock}><div className={styles.stepTitle}><b>3</b><span>Pilih tajuk</span></div><div className={styles.topics}>{topics.map((item) => <button key={item.id} onClick={() => chooseTopic(item.id)} className={topic === item.id ? styles.active : ""}>{item.name}<small>{yearQuestions.filter((questionItem) => questionItem.topicCode === item.id).length} soalan</small></button>)}</div></div>
      <article className={styles.preview}>
        <div className={styles.previewTop}><div><span>{question.topic}</span><p>Soalan {previewIndex + 1} daripada {questions.length}</p></div><div className={styles.previewActions}><button className={styles.selectAll} onClick={selectAll}>Tambah semua</button><button className={`${styles.addQuestion} ${selectedHere ? styles.added : ""}`} onClick={toggleCurrent}>{selectedHere ? "✓ Dalam kuiz" : "+ Masukkan ke kuiz"}</button></div></div>
        <div className={styles.studentCard}>
          <p className={styles.studentLabel}>PAPARAN MURID</p><h2>{cleanQuestion(question)}</h2>
          <div className={styles.answers}>{question.choices.map((answer, answerIndex) => <div key={answer} className={`${styles.answer} ${showAnswer && answerIndex === question.answer.charCodeAt(0) - 65 ? styles.correct : ""}`}><b>{String.fromCharCode(65 + answerIndex)}</b><span>{answer}</span>{showAnswer && answerIndex === question.answer.charCodeAt(0) - 65 ? <i>✓</i> : null}</div>)}</div>
          <button className={styles.answerToggle} onClick={() => setShowAnswer((current) => !current)}>{showAnswer ? "Sembunyikan jawapan" : "Tunjuk jawapan"}</button>
          {showAnswer ? <p className={styles.explanation}>{question.explanation}</p> : null}
        </div>
        <div className={styles.previewNav}><button disabled={previewIndex === 0} onClick={() => move(-1)}>← Sebelum</button><div>{previewIndex + 1} / {questions.length}</div><button disabled={previewIndex + 1 === questions.length} onClick={() => move(1)}>Seterusnya →</button></div>
        {subject === "Pendidikan Islam" ? <p className={styles.reviewNote}>Semak kandungan dahulu sebelum dikongsi kepada murid.</p> : null}
      </article>
    </section>
    <footer className={styles.bottomBar}><div><strong>{selected.length}</strong> soalan dipilih <span>· Cikgu boleh pilih dari lebih satu tajuk</span></div><button disabled={!selected.length} onClick={launch}>Buka kuiz pilihan cikgu <b>→</b></button></footer>
  </main>;
}
