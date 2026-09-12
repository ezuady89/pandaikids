"use client";

import { useState } from "react";
import styles from "./QuickTeacherFeedback.module.css";

type Props = { open: boolean; onClose: () => void };

const helpfulOptions = [
  { value: "AI", label: "AI jana soalan" },
  { value: "KUIZ_SIAP", label: "Kuiz siap" },
  { value: "REKOD_MURID", label: "Rekod murid" },
];

export function QuickTeacherFeedback({ open, onClose }: Props) {
  const [rating, setRating] = useState(0);
  const [helpful, setHelpful] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!rating || !helpful || sending) {
      setError("Pilih bintang dan bahagian yang paling membantu.");
      return;
    }
    setSending(true);
    setError("");
    const response = await fetch("/api/feedback/quick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, helpful, message }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(result.error ?? "Maklum balas belum dapat dihantar.");
      setSending(false);
      return;
    }
    setSent(true);
    setTimeout(onClose, 1400);
  };

  return (
    <div className={styles.backdrop} role="presentation">
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="quick-feedback-title">
        {sent ? (
          <div className={styles.thanks}>
            <span>✓</span>
            <h2>Terima kasih, cikgu!</h2>
            <p>Pandangan cikgu sudah diterima.</p>
          </div>
        ) : (
          <>
            <p className={styles.eyebrow}>30 SAAT SAHAJA</p>
            <h2 id="quick-feedback-title">Cikgu, boleh bantu kami?</h2>
            <p className={styles.lead}>Selepas kuiz pertama ini, bagaimana pengalaman cikgu?</p>

            <fieldset className={styles.fieldset}>
              <legend>Mudah tak guna Pandaikids?</legend>
              <div className={styles.stars} aria-label="Penilaian satu hingga lima bintang">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" className={value <= rating ? styles.starActive : ""} onClick={() => setRating(value)} aria-label={`${value} bintang`}>★</button>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend>Bahagian paling membantu?</legend>
              <div className={styles.options}>
                {helpfulOptions.map((option) => (
                  <button key={option.value} type="button" className={helpful === option.value ? styles.optionActive : ""} onClick={() => setHelpful(option.value)}>{option.label}</button>
                ))}
              </div>
            </fieldset>

            <label className={styles.comment}>Apa yang patut kami baiki? <small>(pilihan)</small>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={300} placeholder="Tulis ringkas di sini…" />
            </label>
            {error ? <p className={styles.error}>{error}</p> : null}
            <div className={styles.actions}>
              <button type="button" className={styles.later} onClick={onClose}>Nanti dahulu</button>
              <button type="button" className={styles.send} disabled={sending} onClick={submit}>{sending ? "Menghantar…" : "Hantar pendapat"}</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
