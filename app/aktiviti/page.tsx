"use client";

import { useState } from "react";
import styles from "./page.module.css";

const answers = ["Saya", "Dia", "Kami", "Mereka"];

export default function AktivitiPage() {
  const [choice, setChoice] = useState<number | null>(null);
  const isCorrect = choice === 1;

  return <main className={styles.page}>
    <header className={styles.header}>
      <a href="/" className={styles.logo}><img src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" /></a>
      <a href="/" className={styles.exit}>← Kembali</a>
    </header>
    <section className={styles.shell}>
      <div className={styles.title}><span>AKTIVITI SIAP</span><h1>Bahasa Melayu · Tahun 3</h1></div>
      <article className={styles.card}>
        <div className={styles.progressRow}><b>Soalan 3 daripada 10</b><div className={styles.progress}><i /><i /><i className={styles.current} /><i /><i /><i /><i /><i /><i /><i /></div></div>
        <h2>Pilih kata ganti nama<br />yang betul.</h2>
        <p className={styles.question}>Aina membawa buku ke sekolah.<br /><strong>______ suka membaca.</strong></p>
        <div className={styles.answers}>{answers.map((answer, index) => {
          const state = choice === null ? "" : index === 1 ? styles.correct : choice === index ? styles.wrong : "";
          return <button className={`${styles.answer} ${state}`} key={answer} onClick={() => setChoice(index)}><b>{String.fromCharCode(65 + index)}</b>{answer}{index === 1 && choice !== null ? <span>✓</span> : null}</button>;
        })}</div>
        {choice !== null ? <p className={`${styles.feedback} ${isCorrect ? styles.good : styles.tryAgain}`}>{isCorrect ? "Betul! Bagus, teruskan." : "Cuba lagi — baca ayat sekali lagi."}</p> : null}
        <button className={styles.next} disabled={!isCorrect} onClick={() => setChoice(null)}>Seterusnya <span>→</span></button>
      </article>
      <p className={styles.note}>Ini contoh aktiviti percuma. Cikgu boleh kongsi pautan dengan murid.</p>
    </section>
  </main>;
}
