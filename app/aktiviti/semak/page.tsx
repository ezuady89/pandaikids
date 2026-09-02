"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Question = { id: string; subject: string; year: number; topic: string; question: string; choices: string[]; answer: string; explanation: string };
type QuestionEdit = Pick<Question, "question" | "choices" | "answer" | "explanation">;

function cleanQuestion(text: string) { return text.replace(/^[^:]{0,220}:\s*/, "").trim(); }
function encodeEdits(edits: Record<string, QuestionEdit>) {
  const bytes = new TextEncoder().encode(JSON.stringify(edits));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export default function SemakAktivitiPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bankKey, setBankKey] = useState("");
  const [index, setIndex] = useState(0);
  const [edits, setEdits] = useState<Record<string, QuestionEdit>>({});
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("bank") ?? "";
    const ids = params.get("soalan")?.split(",").filter(Boolean) ?? [];
    if (!key || !ids.length) return;
    setBankKey(key);
    fetch(`/data/cikgu-bank/${key}.json`).then((response) => response.json()).then((bank) => {
      const source = new Map<string, Question>(bank.questions.map((item: Question) => [item.id, item]));
      setQuestions(ids.map((id) => source.get(id)).filter(Boolean) as Question[]);
    }).catch(() => undefined);
  }, []);

  const question = questions[index];
  const current = useMemo(() => question ? { ...question, ...edits[question.id] } : undefined, [question, edits]);
  const quizUrl = useMemo(() => {
    if (typeof window === "undefined" || !questions.length || !bankKey) return "";
    const url = new URL("/aktiviti/", window.location.origin);
    url.searchParams.set("bank", bankKey);
    url.searchParams.set("soalan", questions.map((item) => item.id).join(","));
    if (Object.keys(edits).length) url.searchParams.set("ubah", encodeEdits(edits));
    return url.toString();
  }, [bankKey, edits, questions]);
  const saveEdit = (formData: FormData) => {
    if (!question) return;
    const choices = ["A", "B", "C", "D"].map((letter) => String(formData.get(`choice-${letter}`) ?? "").trim());
    setEdits((all) => ({ ...all, [question.id]: { question: String(formData.get("question") ?? "").trim(), choices, answer: String(formData.get("answer") ?? "A"), explanation: String(formData.get("explanation") ?? "").trim() } }));
    setEditing(false);
  };
  const copyLink = async () => {
    if (!quizUrl) return;
    try { await navigator.clipboard.writeText(quizUrl); } catch { window.prompt("Salin pautan kuiz ini", quizUrl); }
    setCopied(true); window.setTimeout(() => setCopied(false), 3000);
  };

  if (!current) return <main className={styles.loading}>Memuatkan kuiz cikgu…</main>;
  return <main className={styles.page}>
    <header className={styles.header}><a href="/" className={styles.logo}><img src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" /></a><a className={styles.exit} href="/aktiviti/pilih/">← Pilih semula</a></header>
    <section className={styles.shell}>
      <div className={styles.intro}><span>LANGKAH AKHIR</span><h1>Semak sebelum kongsi.</h1><p>Kuiz ini akan dibuka oleh murid melalui pautan DELIMa.</p></div>
      <article className={styles.card}>
        <div className={styles.cardTop}><div><span>{current.topic}</span><p>Soalan {index + 1} daripada {questions.length}</p></div><button className={styles.editButton} onClick={() => setEditing(true)}>✎ Edit soalan</button></div>
        {editing ? <form className={styles.editor} action={saveEdit}><label>Soalan<textarea name="question" defaultValue={cleanQuestion(current.question)} required /></label><div className={styles.choiceEditor}>{["A", "B", "C", "D"].map((letter, itemIndex) => <label key={letter}><b>{letter}</b><input name={`choice-${letter}`} defaultValue={current.choices[itemIndex]} required /></label>)}</div><label className={styles.answerField}>Jawapan betul<select name="answer" defaultValue={current.answer}><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></label><label>Penerangan ringkas (pilihan)<input name="explanation" defaultValue={current.explanation} /></label><div className={styles.editorActions}><button type="button" onClick={() => setEditing(false)}>Batal</button><button type="submit">Simpan versi cikgu</button></div></form> : <><div className={styles.studentCard}><p>PAPARAN MURID</p><h2>{cleanQuestion(current.question)}</h2><div className={styles.answers}>{current.choices.map((answer, answerIndex) => <div key={answer}><b>{String.fromCharCode(65 + answerIndex)}</b>{answer}</div>)}</div></div><p className={styles.keepNote}>Pembetulan cikgu kekal dalam pautan kuiz ini.</p></>}
        <div className={styles.navigation}><button disabled={index === 0} onClick={() => { setIndex((value) => value - 1); setEditing(false); }}>← Sebelum</button><span>{index + 1} / {questions.length}</span><button disabled={index + 1 === questions.length} onClick={() => { setIndex((value) => value + 1); setEditing(false); }}>Seterusnya →</button></div>
      </article>
      <section className={styles.publish}><div><span>SIAP UNTUK DELIMA</span><h2>Terbitkan pautan untuk murid.</h2><p>Salin pautan ini, kemudian tampal pada tugasan atau bahan dalam DELIMa.</p></div><div className={styles.publishActions}><a href={quizUrl} target="_blank" rel="noreferrer">Lihat sebagai murid ↗</a><button onClick={copyLink}>{copied ? "✓ Pautan disalin" : "Salin pautan DELIMa"} <b>→</b></button></div></section>
    </section>
  </main>;
}
