"use client";

import Script from "next/script";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import baseStyles from "./page.module.css";
import extraStyles from "./player-extras.module.css";

const styles = { ...baseStyles, ...extraStyles };

type Question = { id: string; subject: string; year: number; topic: string; question: string; choices: string[]; answer: string; explanation: string };
type QuestionEdit = Pick<Question, "question" | "choices" | "answer" | "explanation">;
type AccessMode = "open" | "delima";
type GoogleIdentity = { accounts: { id: { initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void; renderButton: (element: HTMLElement, options: Record<string, unknown>) => void } } };

const example: Question = { id: "contoh", subject: "Bahasa Melayu", year: 3, topic: "Kata ganti nama", question: "Aina membawa buku ke sekolah. ______ suka membaca.", choices: ["Saya", "Dia", "Kami", "Mereka"], answer: "B", explanation: "Aina dirujuk dengan kata ganti nama “Dia”." };
const themes = [{ id: "coral", label: "Oren" }, { id: "ocean", label: "Biru" }, { id: "mint", label: "Hijau" }, { id: "sun", label: "Kuning" }, { id: "berry", label: "Merah jambu" }];

function cleanQuestion(text: string) { return text.replace(/^[^:]{0,220}:\s*/, "").trim(); }
function cleanDisplayName(value: string) {
  return value.replace(/\s+KPM[-\s]*(?:Murid|Pelajar|Guru)\s*$/i, "").replace(/\s+/g, " ").trim();
}
function getGreetingName(value: string) {
  return value.split(/\s+(?:BIN|BINTI|A\/?L|A\/?P)\s+/i)[0] || value;
}
function readEdits(encoded: string | null): Record<string, QuestionEdit> {
  if (!encoded) return {};
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0))));
  } catch { return {}; }
}

export default function AktivitiPage() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  const googleButton = useRef<HTMLDivElement>(null);
  const [questions, setQuestions] = useState<Question[]>([example]);
  const [sourceBank, setSourceBank] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [theme, setTheme] = useState("coral");
  const [loading, setLoading] = useState(true);
  const [quizId, setQuizId] = useState("");
  const [accessMode, setAccessMode] = useState<AccessMode>("open");
  const [studentName, setStudentName] = useState("");
  const [googleCredential, setGoogleCredential] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [authStatus, setAuthStatus] = useState<"idle" | "checking" | "error">("idle");
  const [authMessage, setAuthMessage] = useState("");
  const [started, setStarted] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [rank, setRank] = useState<number | null>(null);
  const [participantCount, setParticipantCount] = useState<number | null>(null);
  const [resultStatus, setResultStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("soalan")?.split(",").filter(Boolean) ?? [];
    const bankKey = params.get("bank");
    const edits = readEdits(params.get("ubah"));
    const loadQuestions = (selectedBank: string, selectedIds: string[], selectedEdits: Record<string, QuestionEdit>, selectedTheme?: string) => {
      setSourceBank(selectedBank);
      if (selectedTheme && themes.some((item) => item.id === selectedTheme)) setTheme(selectedTheme);
      fetch(`/data/cikgu-bank/${selectedBank}.json`).then((response) => response.json()).then((bank) => {
        const map = new Map<string, Question>(bank.questions.map((question: Question) => [question.id, question]));
        const selected = selectedIds.map((id) => { const original = map.get(id); return original ? { ...original, ...selectedEdits[id] } : undefined; }).filter(Boolean) as Question[];
        if (selected.length) setQuestions(selected);
      }).catch(() => undefined).finally(() => setLoading(false));
    };
    const publishedId = params.get("kuiz");
    if (publishedId) {
      setQuizId(publishedId);
      fetch(`/api/cikgu-quiz/${publishedId}`).then((response) => response.ok ? response.json() : undefined).then((quiz) => {
        if (!quiz) { setLoading(false); return; }
        setAccessMode(quiz.access_mode === "delima" ? "delima" : "open");
        setTeacherName(String(quiz.teacher_name ?? ""));
        if (quiz.source_bank === "custom" && Array.isArray(quiz.questions) && quiz.questions.length) {
          setSourceBank("custom"); setQuestions(quiz.questions); setTheme(quiz.theme ?? "coral"); setLoading(false);
        } else loadQuestions(quiz.source_bank, quiz.question_ids, quiz.question_overrides ?? {}, quiz.theme);
      }).catch(() => setLoading(false));
      return;
    }
    if (ids.length && bankKey) loadQuestions(bankKey, ids, edits);
    else setLoading(false);
  }, []);

  useEffect(() => {
    if (!googleReady || accessMode !== "delima" || started || !googleClientId || !googleButton.current) return;
    const google = (window as Window & { google?: GoogleIdentity }).google;
    if (!google) return;
    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async ({ credential }) => {
        setAuthStatus("checking"); setAuthMessage("");
        try {
          const response = await fetch("/api/auth/delima/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credential }) });
          const result = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(result.error ?? "Akaun DELIMa belum dapat disahkan.");
          setStudentName(result.name); setGoogleCredential(credential); setStartedAt(Date.now()); setStarted(true); setAuthStatus("idle");
        } catch (error) { setAuthStatus("error"); setAuthMessage(error instanceof Error ? error.message : "Akaun DELIMa belum dapat disahkan."); }
      },
    });
    googleButton.current.replaceChildren();
    google.accounts.id.renderButton(googleButton.current, { type: "standard", theme: "outline", size: "large", shape: "pill", text: "continue_with", width: 320 });
  }, [accessMode, googleClientId, googleReady, started]);

  const question = questions[index] ?? example;
  const correctIndex = question.answer.charCodeAt(0) - 65;
  const isCorrect = choice === correctIndex;
  const title = useMemo(() => `${question.subject} · Tahun ${question.year}`, [question]);
  const visibleQuestion = sourceBank === "custom" ? question.question.trim() : cleanQuestion(question.question);
  const choose = (answerIndex: number) => {
    if (choice !== null) return;
    setChoice(answerIndex);
    if (answerIndex === correctIndex) setScore((current) => current + 1);
  };
  const next = () => {
    if (choice === null) return;
    if (index + 1 === questions.length) {
      const seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      setDurationSeconds(seconds); setFinished(true);
      if (quizId) {
        setResultStatus("saving");
        fetch(`/api/cikgu-quiz/${quizId}/attempts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentName, googleCredential, score, total: questions.length, durationSeconds: seconds }) })
          .then(async (response) => { if (!response.ok) throw new Error("Keputusan belum dapat disimpan."); const result = await response.json(); setRank(result.rank); setParticipantCount(result.participantCount); setResultStatus("saved"); })
          .catch(() => setResultStatus("error"));
      }
    } else { setIndex(index + 1); setChoice(null); }
  };

  const percentage = Math.round((score / Math.max(1, questions.length)) * 100);
  const encouragement = percentage >= 80 ? "Hebat! Teruskan usaha!" : percentage >= 50 ? "Bagus! Kamu semakin pandai!" : "Usaha yang baik—cuba lagi!";
  const formattedTime = `${String(Math.floor(durationSeconds / 60)).padStart(2, "0")}:${String(durationSeconds % 60).padStart(2, "0")}`;
  const displayName = cleanDisplayName(studentName) || "Murid DELIMa";
  const greetingName = getGreetingName(displayName).toLocaleUpperCase("ms-MY");
  const resultName = getGreetingName(displayName);
  const teacherCredit = teacherName ? `Aktiviti oleh Cikgu ${teacherName.replace(/^Cikgu\s+/i, "")}` : "";
  const hasRanking = Boolean(rank && participantCount && participantCount >= 3);

  if (loading) return <main className={styles.page} data-theme={theme}><section className={styles.finish}><span>✦</span><h1>Memuatkan kuiz…</h1></section></main>;
  if (!started) return <main className={styles.page} data-theme={theme}>
    {accessMode === "delima" && googleClientId ? <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setGoogleReady(true)} /> : null}
    <header className={styles.header}><a href="/" className={styles.logo}><img src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" /></a><a href="/" className={styles.exit}>Pandaikids Cikgu</a></header>
    <section className={styles.startShell}>{accessMode === "delima" ? <article className={styles.startCard}><span>✦</span>{teacherCredit ? <p className={styles.teacherCredit}>{teacherCredit}</p> : null}<small>SAHKAN AKAUN MURID</small><h1>{title}</h1><p>Pilih akaun DELIMa supaya nama dan keputusan kamu direkodkan dengan betul.</p>{googleClientId ? <><div className={styles.googleButton} ref={googleButton} />{authStatus === "checking" ? <p className={styles.authMessage}>Sedang mengesahkan akaun…</p> : null}{authMessage ? <p className={styles.authError}>{authMessage}</p> : null}<small className={styles.privacyNote}>Pandaikids tidak menerima kata laluan akaun kamu.</small></> : <div className={styles.authUnavailable}><b>Sambungan DELIMa belum diaktifkan.</b><span>Minta cikgu terbitkan kuiz sebagai “Latihan terbuka” buat sementara.</span></div>}</article> : <form className={styles.startCard} onSubmit={(event) => { event.preventDefault(); if (!studentName.trim()) return; setStudentName(studentName.trim()); setStartedAt(Date.now()); setStarted(true); }}><span>✦</span>{teacherCredit ? <p className={styles.teacherCredit}>{teacherCredit}</p> : null}<small>SEDIA UNTUK BERMULA?</small><h1>{title}</h1><p>Masukkan nama supaya markah dan ranking kamu boleh direkodkan.</p><label>Nama murid<input value={studentName} onChange={(event) => setStudentName(event.target.value)} maxLength={60} placeholder="Contoh: Aisyah" autoComplete="name" required /></label><button type="submit">Mula jawab <b>→</b></button></form>}</section>
  </main>;
  if (finished) return <main className={styles.page} data-theme={theme}>
    <section className={styles.resultShell}>
      <article className={styles.resultCard}>
        <span className={styles.resultSpark}>
          <Image
            src="/assets/cikgu/result/kuiz-selesai.webp"
            alt="Kuiz berjaya diselesaikan"
            width={200}
            height={200}
            priority
          />
        </span>
        {teacherCredit ? <p className={styles.teacherCredit}>{teacherCredit}</p> : null}
        <small>SYABAS, {greetingName}!</small>
        <h1>{encouragement}</h1>
        <p>Kamu telah menamatkan {questions.length} soalan.</p>
        <div className={styles.resultGrid}>
          <div className={styles.scoreBox}><small>MARKAH</small><strong>{score}<i>/{questions.length}</i></strong><span>{percentage}% betul</span></div>
          <div className={styles.nameBox}><small>NAMA</small><strong>{resultName}</strong></div>
          <div className={styles.timeBox}><small>MASA</small><strong>{formattedTime}</strong></div>
          <div className={styles.rankBox}>
            <small>RANKING</small>
            <strong>{hasRanking ? `#${rank}` : "—"}</strong>
            <span>{hasRanking ? `daripada ${participantCount} murid` : resultStatus === "saving" ? "Sedang dikira…" : resultStatus === "error" ? "Belum dapat direkod" : quizId ? "Ranking muncul selepas 3 murid" : "Kuiz percubaan"}</span>
          </div>
        </div>
        <div className={styles.resultActions}><button type="button" onClick={() => window.location.reload()}>Jawab semula</button><a href="/">Kembali ke Pandaikids</a></div>
      </article>
    </section>
  </main>;
  return <main className={styles.page} data-theme={theme}>
    <header className={styles.header}><a href="/" className={styles.logo}><img src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" /></a><a href="/" className={styles.exit}>Pandaikids Cikgu</a></header>
    <section className={styles.shell}><div className={styles.title}><span>{teacherCredit || "KUIZ PILIHAN CIKGU"}</span><h1>{title}</h1><div className={styles.themes} aria-label="Pilih warna kuiz"><small>Pilih warna</small>{themes.map((item) => <button key={item.id} type="button" aria-label={item.label} title={item.label} className={theme === item.id ? styles.themeActive : ""} data-colour={item.id} onClick={() => setTheme(item.id)} />)}</div></div><article className={styles.card}><div className={styles.progressRow}><b>Soalan {index + 1} daripada {questions.length}</b><div className={styles.progress} style={{ "--progress": `${((index + 1) / questions.length) * 100}%` } as React.CSSProperties}><i /></div></div><h2>{question.topic}</h2><p className={styles.question}>{visibleQuestion}</p><div className={styles.answers}>{question.choices.map((answer, answerIndex) => { const state = choice === null ? "" : answerIndex === correctIndex ? styles.correct : choice === answerIndex ? styles.wrong : ""; return <button className={`${styles.answer} ${state}`} key={`${answerIndex}-${answer}`} disabled={choice !== null} onClick={() => choose(answerIndex)}><b>{String.fromCharCode(65 + answerIndex)}</b><em>{answer}</em>{answerIndex === correctIndex && choice !== null ? <span>✓</span> : null}</button>; })}</div>{choice !== null ? <><p className={`${styles.feedback} ${isCorrect ? styles.good : styles.tryAgain}`}>{isCorrect ? `Betul! ${question.explanation}` : `Jawapan yang betul ialah ${question.answer}.`}</p><button className={styles.next} onClick={next}>{index + 1 === questions.length ? "Selesai" : "Seterusnya"} <span>→</span></button></> : null}</article></section>
  </main>;
}
