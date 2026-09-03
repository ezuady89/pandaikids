"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Question = { id: string; subject: string; year: number; topic: string; question: string; choices: string[]; answer: string; explanation: string };
type QuestionEdit = Pick<Question, "question" | "choices" | "answer" | "explanation">;

function cleanQuestion(text: string) { return text.replace(/^[^:]{0,220}:\s*/, "").trim(); }
function makeOwnerToken() { return `${crypto.randomUUID()}-${crypto.randomUUID()}`; }

export default function SemakAktivitiPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bankKey, setBankKey] = useState("");
  const [index, setIndex] = useState(0);
  const [edits, setEdits] = useState<Record<string, QuestionEdit>>({});
  const [quizId, setQuizId] = useState("");
  const [ownerToken, setOwnerToken] = useState("");
  const [editing, setEditing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loadBank = (key: string, ids: string[], savedEdits: Record<string, QuestionEdit> = {}) => {
      setBankKey(key); setEdits(savedEdits);
      fetch(`/data/cikgu-bank/${key}.json`).then((response) => response.json()).then((bank) => {
        const source = new Map<string, Question>(bank.questions.map((item: Question) => [item.id, item]));
        setQuestions(ids.map((id) => source.get(id)).filter(Boolean) as Question[]);
      }).catch(() => undefined);
    };
    const savedId = params.get("id");
    if (savedId) {
      setQuizId(savedId);
      setOwnerToken(window.localStorage.getItem(`pandaikids-cikgu-owner:${savedId}`) ?? "");
      fetch(`/api/cikgu-quiz/${savedId}`).then((response) => response.ok ? response.json() : undefined).then((quiz) => {
        if (quiz) loadBank(quiz.source_bank, quiz.question_ids, quiz.question_overrides ?? {});
      }).catch(() => undefined);
      return;
    }
    const key = params.get("bank") ?? "";
    const ids = params.get("soalan")?.split(",").filter(Boolean) ?? [];
    if (key && ids.length) loadBank(key, ids);
  }, []);

  const question = questions[index];
  const current = useMemo(() => question ? { ...question, ...edits[question.id] } : undefined, [question, edits]);
  const canEdit = !quizId || Boolean(ownerToken);
  const quizUrl = quizId && typeof window !== "undefined" ? new URL(`/aktiviti/?kuiz=${quizId}`, window.location.origin).toString() : "";
  const saveEdit = (formData: FormData) => {
    if (!question) return;
    const choices = ["A", "B", "C", "D"].map((letter) => String(formData.get(`choice-${letter}`) ?? "").trim());
    setEdits((all) => ({ ...all, [question.id]: { question: String(formData.get("question") ?? "").trim(), choices, answer: String(formData.get("answer") ?? "A"), explanation: String(formData.get("explanation") ?? "").trim() } }));
    setEditing(false); setMessage("Perubahan sedia untuk diterbitkan.");
  };
  const corrections = () => Object.entries(edits).flatMap(([questionId, corrected]) => {
    const original = questions.find((item) => item.id === questionId);
    return original ? [{ questionId, original, corrected: { ...original, ...corrected } }] : [];
  });
  const publishQuiz = async () => {
    if (!questions.length || !bankKey || publishing) return;
    setPublishing(true); setMessage("");
    const id = quizId || crypto.randomUUID();
    const token = ownerToken || makeOwnerToken();
    const body = { id, ownerToken: token, bankKey, questionIds: questions.map((item) => item.id), edits, corrections: corrections(), theme: "coral" };
    const response = await fetch(quizId ? `/api/cikgu-quiz/${id}` : "/api/cikgu-quiz", { method: quizId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { setMessage(result.error ?? "Kuiz belum dapat diterbitkan."); setPublishing(false); return; }
    window.localStorage.setItem(`pandaikids-cikgu-owner:${id}`, token);
    setQuizId(id); setOwnerToken(token);
    window.history.replaceState({}, "", `/aktiviti/semak/?id=${id}`);
    const link = new URL(`/aktiviti/?kuiz=${id}`, window.location.origin).toString();
    try { await navigator.clipboard.writeText(link); setMessage("✓ Pautan DELIMa sudah disalin."); } catch { window.prompt("Salin pautan kuiz ini", link); setMessage("Pautan kuiz sudah siap."); }
    setPublishing(false);
  };

  if (!current) return <main className={styles.loading}>Memuatkan kuiz cikgu…</main>;
  return <main className={styles.page}>
    <header className={styles.header}><a href="/" className={styles.logo}><img src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" /></a><a className={styles.exit} href="/aktiviti/pilih/">← Pilih semula</a></header>
    <section className={styles.shell}>
      <div className={styles.intro}><span>LANGKAH AKHIR</span><h1>Semak sebelum kongsi.</h1><p>Kuiz ini akan dibuka oleh murid melalui pautan DELIMa.</p></div>
      <article className={styles.card}>
        <div className={styles.cardTop}><div><span>{current.topic}</span><p>Soalan {index + 1} daripada {questions.length}</p></div><button className={styles.editButton} disabled={!canEdit} onClick={() => setEditing(true)}>✎ Edit soalan</button></div>
        {editing ? <form className={styles.editor} action={saveEdit}><label>Soalan<textarea name="question" defaultValue={cleanQuestion(current.question)} required /></label><div className={styles.choiceEditor}>{["A", "B", "C", "D"].map((letter, itemIndex) => <label key={letter}><b>{letter}</b><input name={`choice-${letter}`} defaultValue={current.choices[itemIndex]} required /></label>)}</div><label className={styles.answerField}>Jawapan betul<select name="answer" defaultValue={current.answer}><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option></select></label><label>Penerangan ringkas (pilihan)<input name="explanation" defaultValue={current.explanation} /></label><div className={styles.editorActions}><button type="button" onClick={() => setEditing(false)}>Batal</button><button type="submit">Simpan versi cikgu</button></div></form> : <><div className={styles.studentCard}><p>PAPARAN MURID</p><h2>{cleanQuestion(current.question)}</h2><div className={styles.answers}>{current.choices.map((answer, answerIndex) => <div key={answer}><b>{String.fromCharCode(65 + answerIndex)}</b>{answer}</div>)}</div></div><p className={styles.keepNote}>{canEdit ? "Versi cikgu dan rekod pembetulan akan disimpan apabila diterbitkan." : "Ini ialah paparan kuiz yang telah diterbitkan."}</p></>}
        <div className={styles.navigation}><button disabled={index === 0} onClick={() => { setIndex((value) => value - 1); setEditing(false); }}>← Sebelum</button><span>{index + 1} / {questions.length}</span><button disabled={index + 1 === questions.length} onClick={() => { setIndex((value) => value + 1); setEditing(false); }}>Seterusnya →</button></div>
      </article>
      <section className={styles.publish}><div><span>SIAP UNTUK DELIMA</span><h2>Terbitkan pautan untuk murid.</h2><p>Salin pautan ini, kemudian tampal pada tugasan atau bahan dalam DELIMa.</p>{message ? <p className={styles.publishMessage}>{message}</p> : null}</div><div className={styles.publishActions}>{quizUrl ? <a href={quizUrl} target="_blank" rel="noreferrer">Lihat sebagai murid ↗</a> : null}<button disabled={!canEdit || publishing} onClick={publishQuiz}>{publishing ? "Menyimpan…" : quizId ? "Simpan & salin pautan" : "Terbitkan & salin pautan"} <b>→</b></button></div></section>
    </section>
  </main>;
}
