"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Mode = "choose" | "manual" | "material";
type DraftQuestion = { id: string; question: string; choices: string[]; answer: "A" | "B" | "C" | "D"; explanation: string };
type GeneratedQuestion = Omit<DraftQuestion, "id">;
type Quota = { plan: { name: string; manualLimit: number; aiLimit: number; questionLimit: number }; manualRemaining: number; aiRemaining: number };

const subjects = ["Bahasa Melayu", "Bahasa Inggeris", "Matematik", "Sains", "Pendidikan Islam"];
const letters = ["A", "B", "C", "D"] as const;
const blankQuestion = (id = "manual-1"): DraftQuestion => ({ id, question: "", choices: ["", "", ""], answer: "A", explanation: "" });

export default function BinaKuizPage() {
  const [mode, setMode] = useState<Mode>("choose");
  const [subject, setSubject] = useState("Bahasa Melayu");
  const [year, setYear] = useState(1);
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<DraftQuestion[]>([blankQuestion()]);
  const [active, setActive] = useState(0);
  const [material, setMaterial] = useState("");
  const [count, setCount] = useState(10);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [quota, setQuota] = useState<Quota | null>(null);
  const [creationMethod, setCreationMethod] = useState<"manual" | "ai">("manual");
  const [aiReceipt, setAiReceipt] = useState("");

  useEffect(() => {
    fetch("/api/cikgu-quota").then((response) => response.ok ? response.json() : undefined)
      .then((result) => { if (result?.quota) setQuota(result.quota); })
      .catch(() => undefined);
  }, []);

  const current = questions[active];
  const updateCurrent = (patch: Partial<DraftQuestion>) => setQuestions((all) => all.map((question, index) => index === active ? { ...question, ...patch } : question));
  const updateChoice = (choiceIndex: number, value: string) => updateCurrent({ choices: current.choices.map((choice, index) => index === choiceIndex ? value : choice) });

  const validateMetadata = () => {
    if (!topic.trim()) { setMessage("Masukkan tajuk pembelajaran dahulu."); return false; }
    return true;
  };

  const reviewQuestions = (drafts: DraftQuestion[]) => {
    if (!validateMetadata()) return;
    const complete = drafts.every((question) => question.question.trim() && question.choices.every((choice) => choice.trim()));
    if (!complete) { setMessage("Lengkapkan soalan dan semua pilihan jawapan."); return; }
    const fullQuestions = drafts.map((question) => ({ ...question, subject, year, topic: topic.trim() }));
    window.sessionStorage.setItem("pandaikids-cikgu-custom-draft", JSON.stringify({ questions: fullQuestions, creationMethod, aiReceipt }));
    window.location.href = "/aktiviti/semak/?draf=custom";
  };

  const addQuestion = () => {
    const limit = quota?.plan.questionLimit ?? 20;
    if (questions.length >= limit) { setMessage(`Pakej ${quota?.plan.name ?? "Percuma"} membenarkan maksimum ${limit} soalan untuk satu kuiz.`); return; }
    setQuestions((all) => [...all, blankQuestion(crypto.randomUUID())]);
    setActive(questions.length);
    setMessage("");
  };

  const removeQuestion = () => {
    if (questions.length === 1) return;
    setQuestions((all) => all.filter((_, index) => index !== active));
    setActive((value) => Math.max(0, value - 1));
  };

  const generateQuestions = async () => {
    if (!validateMetadata() || busy) return;
    if (file && file.size > 4 * 1024 * 1024) { setMessage("Fail terlalu besar. Gunakan fail tidak melebihi 4 MB."); return; }
    setBusy(true); setMessage("Sedang membaca bahan dan menyusun soalan…");
    const form = new FormData();
    form.set("subject", subject); form.set("year", String(year)); form.set("topic", topic.trim());
    form.set("material", material.trim()); form.set("count", String(count));
    if (file) form.set("file", file);
    try {
      const response = await fetch("/api/cikgu-ai", { method: "POST", body: form });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? "Soalan belum dapat dihasilkan.");
      const generated = (result.questions as GeneratedQuestion[]).map((question) => ({ ...question, id: crypto.randomUUID() }));
      setQuestions(generated); setActive(0); setMode("manual"); setCreationMethod("ai"); setAiReceipt(String(result.aiReceipt ?? ""));
      if (result.quota) setQuota(result.quota);
      setMessage(`${generated.length} soalan sudah disediakan. Cikgu boleh semak dan ubah sebelum diterbitkan.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Soalan belum dapat dihasilkan.");
    } finally { setBusy(false); }
  };

  return <main className={styles.page}>
    <header className={styles.header}><a href="/"><img src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" /></a><a href="/">← Kembali</a></header>
    <section className={styles.shell}>
      <div className={styles.intro}><span>BINA IKUT CARA CIKGU</span><h1>Pilih cara bina kuiz.</h1><p>Taip sendiri atau biar AI bantu.</p></div>

      {mode === "choose" ? <div className={styles.modeGrid}>
        <button type="button" onClick={() => { setMode("manual"); setCreationMethod("manual"); setAiReceipt(""); }}><span className={styles.modeIcon}><Image src="/assets/cikgu/modes/buat-sendiri.webp" alt="" width={160} height={160} /></span><small>CARA 1 · BUAT SENDIRI</small><h2>Taip Soalan Sendiri</h2><p>Mulakan dengan 3 pilihan jawapan. Tambah jawapan D jika perlu.</p><strong className={styles.quotaBadge}>{quota ? `${quota.manualRemaining}/${quota.plan.manualLimit} kuiz percuma berbaki` : "5 kuiz percuma sebulan"}</strong><b>Bina sendiri <span>→</span></b></button>
        <button type="button" onClick={() => setMode("material")}><span className={styles.modeIcon}><Image src="/assets/cikgu/modes/guna-ai.webp" alt="" width={160} height={160} /></span><small>CARA 2 · GUNA AI</small><h2>Jana Soalan dengan AI</h2><p>Masukkan tajuk atau muat naik nota, gambar dan PDF. AI akan menyediakan soalannya.</p><strong className={styles.quotaBadge}>{quota ? `${quota.aiRemaining}/${quota.plan.aiLimit} penggunaan AI berbaki` : "3 penggunaan AI sebulan"}</strong><b>Jana dengan AI <span>→</span></b></button>
      </div> : <>
        <div className={styles.modeSwitch}><button className={mode === "manual" ? styles.active : ""} onClick={() => setMode("manual")}>Buat sendiri</button><button className={mode === "material" ? styles.active : ""} onClick={() => setMode("material")}>Guna AI</button></div>
        <section className={styles.workspace}>
          <div className={styles.metaGrid}><label>Subjek<select value={subject} onChange={(event) => setSubject(event.target.value)}>{subjects.map((item) => <option key={item}>{item}</option>)}</select></label><label>Tahun<select value={year} onChange={(event) => setYear(Number(event.target.value))}>{[1,2,3,4,5,6].map((item) => <option key={item} value={item}>Tahun {item}</option>)}</select></label><label className={styles.topic}>Tajuk pembelajaran<input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Contoh: Kata ganti nama" maxLength={160} /></label></div>

          {mode === "material" ? <div className={styles.materialPanel}>
            <div className={styles.materialTop}><div><small>AI BANTU CIKGU</small><h2>AI hasilkan soalan secara automatik.</h2><p className={styles.quotaLine}>{quota ? `Baki AI bulan ini: ${quota.aiRemaining} daripada ${quota.plan.aiLimit}` : "Pakej Percuma: 3 penggunaan AI sebulan"}</p></div><label>Bilangan<select value={count} onChange={(event) => setCount(Number(event.target.value))}>{[5,10,15,20].map((item) => <option key={item} value={item}>{item} soalan</option>)}</select></label></div>
            <label>Nota atau kandungan teks <textarea value={material} onChange={(event) => setMaterial(event.target.value)} placeholder="Tampal kandungan nota di sini, atau hanya masukkan tajuk di atas…" maxLength={16000} /></label>
            <div className={styles.uploadRow}><label className={styles.upload}><input type="file" accept=".pdf,.txt,image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /><span>＋ Pilih gambar, PDF atau teks</span><small>{file ? file.name : "Maksimum 4 MB"}</small></label><button className={styles.generate} disabled={busy || quota?.aiRemaining === 0} type="button" onClick={generateQuestions}>{busy ? "Sedang menghasilkan…" : quota?.aiRemaining === 0 ? "Kuota AI bulan ini habis" : "Jana Soalan dengan AI"} <span>✦</span></button></div>
          </div> : <div className={styles.manualPanel}>
            <div className={styles.questionNav}><div><small>SOALAN {active + 1} DARIPADA {questions.length}</small><div>{questions.map((question, index) => <button type="button" aria-label={`Soalan ${index + 1}`} className={index === active ? styles.currentPill : question.question.trim() ? styles.donePill : ""} key={question.id} onClick={() => setActive(index)}>{index + 1}</button>)}</div></div><button type="button" disabled={questions.length >= (quota?.plan.questionLimit ?? 20)} onClick={addQuestion}>＋ Tambah soalan</button></div>
            <label>Soalan<textarea value={current.question} onChange={(event) => updateCurrent({ question: event.target.value })} placeholder="Taip soalan di sini…" maxLength={500} /></label>
            <div className={styles.choiceGrid}>{letters.slice(0, current.choices.length).map((letter, index) => <label key={letter}><b>{letter}</b><input value={current.choices[index]} onChange={(event) => updateChoice(index, event.target.value)} placeholder={`Jawapan ${letter}`} maxLength={180} /></label>)}</div>
            {current.choices.length < 4 ? <button className={styles.addChoice} type="button" onClick={() => updateCurrent({ choices: [...current.choices, ""] })}>＋ Tambah jawapan D</button> : null}
            <div className={styles.answerRow}><label>Jawapan betul<select value={current.answer} onChange={(event) => updateCurrent({ answer: event.target.value as DraftQuestion["answer"] })}>{letters.slice(0, current.choices.length).map((letter) => <option key={letter}>{letter}</option>)}</select></label><label>Penerangan ringkas <input value={current.explanation} onChange={(event) => updateCurrent({ explanation: event.target.value })} placeholder="Pilihan" maxLength={350} /></label></div>
            <div className={styles.manualActions}><button type="button" disabled={questions.length === 1} onClick={removeQuestion}>Padam soalan</button><button type="button" onClick={() => reviewQuestions(questions)}>Semak Kuiz <span>→</span></button></div>
          </div>}
          {message ? <p className={styles.message}>{message}</p> : null}
        </section>
      </>}
      <p className={styles.safeNote}>Cikgu boleh menyemak dan mengubah semua soalan sebelum pautan dikongsi.</p>
    </section>
  </main>;
}
