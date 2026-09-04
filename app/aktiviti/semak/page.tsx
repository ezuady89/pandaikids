"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Question = { id: string; subject: string; year: number; topic: string; question: string; choices: string[]; answer: string; explanation: string };
type QuestionEdit = Pick<Question, "question" | "choices" | "answer" | "explanation">;
type AccessMode = "delima" | "open";
type Quota = { plan: { name: string; manualLimit: number; aiLimit: number; questionLimit: number }; manualRemaining: number; aiRemaining: number };

function cleanQuestion(text: string) { return text.replace(/^[^:]{0,220}:\s*/, "").trim(); }
function makeOwnerToken() { return `${crypto.randomUUID()}-${crypto.randomUUID()}`; }

export default function SemakAktivitiPage() {
  const delimaConfigured = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bankKey, setBankKey] = useState("");
  const [index, setIndex] = useState(0);
  const [edits, setEdits] = useState<Record<string, QuestionEdit>>({});
  const [quizId, setQuizId] = useState("");
  const [ownerToken, setOwnerToken] = useState("");
  const [accessMode, setAccessMode] = useState<AccessMode>(delimaConfigured ? "delima" : "open");
  const [editing, setEditing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [quota, setQuota] = useState<Quota | null>(null);
  const [creationMethod, setCreationMethod] = useState<"manual" | "ai" | "ready">("ready");
  const [aiReceipt, setAiReceipt] = useState("");

  useEffect(() => {
    setTeacherName(window.localStorage.getItem("pandaikids-cikgu-display-name") ?? "");
    fetch("/api/cikgu-quota").then((response) => response.ok ? response.json() : undefined)
      .then((result) => { if (result?.quota) setQuota(result.quota); })
      .catch(() => undefined);
    const params = new URLSearchParams(window.location.search);
    const loadBank = async (key: string, ids: string[], savedEdits: Record<string, QuestionEdit> = {}) => {
      setBankKey(key); setEdits(savedEdits);
      try {
        const response = await fetch(`/data/cikgu-bank/${key}.json`);
        if (!response.ok) throw new Error("Bank soalan tidak ditemui.");
        const bank = await response.json();
        const source = new Map<string, Question>(bank.questions.map((item: Question) => [item.id, item]));
        const selected = ids.map((id) => source.get(id)).filter(Boolean) as Question[];
        if (!selected.length) {
          setMessage("Soalan dalam pautan ini tidak sepadan dengan subjek. Sila pilih kuiz semula.");
          return;
        }
        setQuestions(selected);
        if (selected.length !== ids.length) setMessage("Sebahagian soalan tidak ditemui. Sila semak semula sebelum terbitkan.");
      } catch { setMessage("Soalan belum dapat dimuatkan. Sila cuba pilih kuiz semula."); }
    };

    if (params.get("draf") === "custom") {
      try {
        const draft = JSON.parse(window.sessionStorage.getItem("pandaikids-cikgu-custom-draft") ?? "{}");
        if (Array.isArray(draft.questions) && draft.questions.length) {
          setBankKey("custom"); setQuestions(draft.questions);
          setCreationMethod(draft.creationMethod === "ai" ? "ai" : "manual");
          setAiReceipt(String(draft.aiReceipt ?? ""));
          return;
        }
      } catch { /* mesej umum dipaparkan di bawah */ }
      setMessage("Draf kuiz tidak ditemui. Kembali dan bina semula kuiz cikgu.");
      return;
    }

    const savedId = params.get("id");
    if (savedId) {
      setQuizId(savedId);
      setOwnerToken(window.localStorage.getItem(`pandaikids-cikgu-owner:${savedId}`) ?? "");
      fetch(`/api/cikgu-quiz/${savedId}`).then((response) => response.ok ? response.json() : undefined).then((quiz) => {
        if (!quiz) { setMessage("Kuiz tidak ditemui."); return; }
        setAccessMode(quiz.access_mode === "delima" ? "delima" : "open");
        setTeacherName(String(quiz.teacher_name ?? ""));
        if (quiz.source_bank === "custom" && Array.isArray(quiz.questions)) {
          setBankKey("custom"); setQuestions(quiz.questions); setEdits({});
        } else loadBank(quiz.source_bank, quiz.question_ids, quiz.question_overrides ?? {});
      }).catch(() => setMessage("Kuiz belum dapat dimuatkan."));
      return;
    }

    const key = params.get("bank") ?? "";
    const ids = params.get("soalan")?.split(",").filter(Boolean) ?? [];
    if (key && ids.length) loadBank(key, ids);
    else setMessage("Pautan kuiz tidak lengkap. Sila pilih kuiz semula.");
  }, []);

  const question = questions[index];
  const current = useMemo(() => question ? { ...question, ...edits[question.id] } : undefined, [question, edits]);
  const currentQuestions = useMemo(() => questions.map((item) => ({ ...item, ...edits[item.id] })), [questions, edits]);
  const canEdit = !quizId || Boolean(ownerToken);
  const quizUrl = quizId && typeof window !== "undefined" ? new URL(`/aktiviti/?kuiz=${quizId}`, window.location.origin).toString() : "";
  const displayQuestion = (text: string) => bankKey === "custom" ? text.trim() : cleanQuestion(text);

  const saveEdit = (formData: FormData) => {
    if (!question || !current) return;
    const choices = current.choices.map((_, index) => { const letter = String.fromCharCode(65 + index); return String(formData.get(`choice-${letter}`) ?? "").trim(); });
    setEdits((all) => ({ ...all, [question.id]: { question: String(formData.get("question") ?? "").trim(), choices, answer: String(formData.get("answer") ?? "A"), explanation: String(formData.get("explanation") ?? "").trim() } }));
    setEditing(false); setMessage("Perubahan sedia untuk diterbitkan.");
  };

  const corrections = () => bankKey === "custom" ? [] : Object.entries(edits).flatMap(([questionId, corrected]) => {
    const original = questions.find((item) => item.id === questionId);
    return original ? [{ questionId, original, corrected: { ...original, ...corrected } }] : [];
  });

  const publishQuiz = async () => {
    if (!questions.length || !bankKey || publishing) return;
    if (!teacherName.trim()) { setMessage("Masukkan nama cikgu untuk dipaparkan pada kuiz."); return; }
    setPublishing(true); setMessage("");
    const id = quizId || crypto.randomUUID();
    const token = ownerToken || makeOwnerToken();
    const body = { id, ownerToken: token, bankKey, questionIds: currentQuestions.map((item) => item.id), edits: bankKey === "custom" ? {} : edits, customQuestions: bankKey === "custom" ? currentQuestions : undefined, corrections: corrections(), theme: "coral", accessMode, teacherName: teacherName.trim(), creationMethod, aiReceipt };
    const response = await fetch(quizId ? `/api/cikgu-quiz/${id}` : "/api/cikgu-quiz", { method: quizId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { setMessage(result.error ?? "Kuiz belum dapat diterbitkan."); setPublishing(false); return; }
    if (result.quota) setQuota(result.quota);
    window.localStorage.setItem(`pandaikids-cikgu-owner:${id}`, token);
    window.localStorage.setItem("pandaikids-cikgu-display-name", teacherName.trim());
    if (bankKey === "custom") window.sessionStorage.removeItem("pandaikids-cikgu-custom-draft");
    setQuizId(id); setOwnerToken(token);
    window.history.replaceState({}, "", `/aktiviti/semak/?id=${id}`);
    const link = new URL(`/aktiviti/?kuiz=${id}`, window.location.origin).toString();
    try { await navigator.clipboard.writeText(link); setMessage("✓ Pautan kuiz sudah disalin. Tampal terus dalam DELIMa."); }
    catch { window.prompt("Salin pautan kuiz ini", link); setMessage("Pautan kuiz sudah siap."); }
    setPublishing(false);
  };

  if (!current) return <main className={styles.loading}><div><p>{message || "Memuatkan kuiz cikgu…"}</p>{message ? <a className={styles.loadingLink} href="/aktiviti/pilih/">← Pilih kuiz semula</a> : null}</div></main>;
  return <main className={styles.page}>
    <header className={styles.header}><a href="/" className={styles.logo}><img src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" /></a><a className={styles.exit} href={bankKey === "custom" ? "/aktiviti/bina/" : "/aktiviti/pilih/"}>← Kembali</a></header>
    <section className={styles.shell}>
      <div className={styles.intro}><span>LANGKAH AKHIR</span><h1>Semak sebelum kongsi.</h1><p>Cikgu boleh ubah soalan dahulu, kemudian terbitkan satu pautan untuk murid.</p></div>
      <article className={styles.card}>
        <div className={styles.cardTop}><div><span>{current.topic}</span><p>Soalan {index + 1} daripada {questions.length}</p></div><button className={styles.editButton} disabled={!canEdit} onClick={() => setEditing(true)}>✎ Edit soalan</button></div>
        {editing ? <form className={styles.editor} action={saveEdit}><label>Soalan<textarea name="question" defaultValue={displayQuestion(current.question)} required /></label><div className={styles.choiceEditor}>{current.choices.map((_, itemIndex) => String.fromCharCode(65 + itemIndex)).map((letter, itemIndex) => <label key={letter}><b>{letter}</b><input name={`choice-${letter}`} defaultValue={current.choices[itemIndex]} required /></label>)}</div><label className={styles.answerField}>Jawapan betul<select name="answer" defaultValue={current.answer}>{current.choices.map((_, itemIndex) => { const letter = String.fromCharCode(65 + itemIndex); return <option key={letter} value={letter}>{letter}</option>; })}</select></label><label>Penerangan ringkas (pilihan)<input name="explanation" defaultValue={current.explanation} /></label><div className={styles.editorActions}><button type="button" onClick={() => setEditing(false)}>Batal</button><button type="submit">Simpan versi cikgu</button></div></form> : <><div className={styles.studentCard}><p>PAPARAN MURID</p><h2>{displayQuestion(current.question)}</h2><div className={styles.answers}>{current.choices.map((answer, answerIndex) => <div key={`${answerIndex}-${answer}`}><b>{String.fromCharCode(65 + answerIndex)}</b><span>{answer}</span></div>)}</div></div><p className={styles.keepNote}>{canEdit ? "Pembetulan cikgu hanya digunakan dalam kuiz ini dan rekod asal masih disimpan." : "Ini ialah paparan kuiz yang telah diterbitkan."}</p></>}
        <div className={styles.navigation}><button disabled={index === 0} onClick={() => { setIndex((value) => value - 1); setEditing(false); }}>← Sebelum</button><span>{index + 1} / {questions.length}</span><button disabled={index + 1 === questions.length} onClick={() => { setIndex((value) => value + 1); setEditing(false); }}>Seterusnya →</button></div>
      </article>
      <section className={styles.publish}>
        <div className={styles.publishCopy}><span>SIAP UNTUK DIKONGSI</span><h2>Terbitkan pautan untuk murid.</h2><p>Pilih cara murid masuk. Pautan yang sama boleh ditampal pada tugasan atau bahan dalam DELIMa.</p>{!quizId && bankKey === "custom" ? <p className={styles.quotaNotice}>{creationMethod === "ai" ? `Kuiz ini menggunakan kuota AI. Baki: ${quota?.aiRemaining ?? "–"} daripada ${quota?.plan.aiLimit ?? 3}.` : `Kuota hanya ditolak selepas pautan berjaya diterbitkan. Baki Buat Sendiri: ${quota?.manualRemaining ?? "–"} daripada ${quota?.plan.manualLimit ?? 5}.`}</p> : null}<label className={styles.teacherName}>Nama cikgu<input value={teacherName} onChange={(event) => setTeacherName(event.target.value)} placeholder="Contoh: Aisyah" maxLength={80} required /></label>{message ? <p className={styles.publishMessage}>{message}</p> : null}</div>
        <div className={styles.accessModes} aria-label="Cara murid masuk"><button type="button" disabled={!delimaConfigured} className={accessMode === "delima" ? styles.accessActive : ""} onClick={() => setAccessMode("delima")}><b>Akaun DELIMa</b><small>{delimaConfigured ? "Nama dikesan selepas pengesahan" : "Perlu Google Client ID"}</small></button><button type="button" className={accessMode === "open" ? styles.accessActive : ""} onClick={() => setAccessMode("open")}><b>Latihan terbuka</b><small>Murid taip nama sendiri</small></button></div>
        <div className={styles.publishActions}>{quizUrl ? <a href={quizUrl} target="_blank" rel="noreferrer">Lihat sebagai murid ↗</a> : null}<button disabled={!canEdit || publishing} onClick={publishQuiz}>{publishing ? "Menyimpan…" : quizId ? "Simpan & salin pautan" : "Terbitkan & salin pautan"} <b>→</b></button></div>
      </section>
    </section>
  </main>;
}
