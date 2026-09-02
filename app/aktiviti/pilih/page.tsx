"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Question = { id: string; subject: string; year: number; topic: string; topicCode: string; set: number; setName: string; level: string; question: string };
type Bank = { key: string; questions: Question[] };
type Manifest = { questionCount: number; subjects: string[] };
const subjectColours: Record<string, string> = { Matematik: "math", "Bahasa Melayu": "bm", Sains: "science", "Bahasa Inggeris": "english", "Pendidikan Islam": "islam" };

export default function PilihAktivitiPage() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [bank, setBank] = useState<Bank | null>(null);
  const [subject, setSubject] = useState("Matematik");
  const [year, setYear] = useState(1);
  const [topic, setTopic] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const bankKey = `${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-tahun-${year}`;
  useEffect(() => { const preset = new URLSearchParams(window.location.search).get("subjek"); if (preset) setSubject(preset); fetch("/data/cikgu-bank/manifest.json").then((response) => response.json()).then(setManifest).catch(() => undefined); }, []);
  useEffect(() => { setBank(null); fetch(`/data/cikgu-bank/${bankKey}.json`).then((response) => response.json()).then(setBank).catch(() => undefined); }, [bankKey]);
  const yearQuestions = bank?.questions ?? [];
  const topics = useMemo(() => Array.from(new Map(yearQuestions.map((question) => [question.topicCode, question.topic])).entries()).map(([id, name]) => ({ id, name })), [yearQuestions]);
  useEffect(() => { setTopic(topics[0]?.id ?? ""); setSelected([]); }, [subject, year, topics]);
  const questions = useMemo(() => yearQuestions.filter((question) => question.topicCode === topic), [yearQuestions, topic]);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const selectAll = () => setSelected(questions.map((question) => question.id));
  const launch = () => { if (selected.length) window.location.href = `/aktiviti/?bank=${bankKey}&soalan=${selected.join(",")}`; };
  if (!manifest || !bank) return <main className={styles.loading}>Memuatkan bank soalan Pandaikids…</main>;
  return <main className={styles.page}>
    <header className={styles.header}><a href="/" className={styles.logo}><img src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" /></a><a href="/" className={styles.exit}>← Kembali</a></header>
    <section className={styles.hero}><span>AKTIVITI SIAP PANDAIKIDS</span><h1>Pilih soalan ikut<br />tajuk cikgu.</h1><p>{manifest.questionCount.toLocaleString("ms-MY")} soalan untuk Tahun 1 hingga 6. Cikgu tentukan sendiri soalan dalam kuiz.</p></section>
    <section className={styles.workspace}>
      <div className={styles.filters}><div><b>1</b><span>Subjek</span><div className={styles.subjects}>{manifest.subjects.map((item) => <button key={item} onClick={() => setSubject(item)} className={`${subject === item ? styles.active : ""} ${styles[subjectColours[item]]}`}>{item}</button>)}</div></div><div><b>2</b><span>Tahun</span><div className={styles.years}>{[1,2,3,4,5,6].map((item) => <button key={item} onClick={() => setYear(item)} className={year === item ? styles.active : ""}>Tahun {item}</button>)}</div></div></div>
      <div className={styles.topicBlock}><div className={styles.stepTitle}><b>3</b><span>Pilih tajuk</span></div><div className={styles.topics}>{topics.map((item) => <button key={item.id} onClick={() => setTopic(item.id)} className={topic === item.id ? styles.active : ""}>{item.name}<small>{yearQuestions.filter((question) => question.topicCode === item.id).length} soalan</small></button>)}</div></div>
      <div className={styles.questionBlock}><div className={styles.questionHeading}><div><span>4</span><h2>Pilih soalan untuk kuiz</h2><p>{questions.length} soalan tersedia dalam tajuk ini.</p>{subject === "Pendidikan Islam" ? <em>Semak kandungan dahulu sebelum dikongsi kepada murid.</em> : null}</div><button onClick={selectAll}>Pilih semua</button></div><div className={styles.questionList}>{questions.map((question, index) => <button key={question.id} onClick={() => toggle(question.id)} className={`${styles.questionCard} ${selected.includes(question.id) ? styles.selected : ""}`}><i>{selected.includes(question.id) ? "✓" : index + 1}</i><div><small>{question.setName} · {question.level}</small><p>{question.question}</p></div></button>)}</div></div>
    </section>
    <footer className={styles.bottomBar}><div><strong>{selected.length}</strong> soalan dipilih <span>· Pilih sekurang-kurangnya 1 soalan</span></div><button disabled={!selected.length} onClick={launch}>Buka kuiz pilihan cikgu <b>→</b></button></footer>
  </main>;
}
