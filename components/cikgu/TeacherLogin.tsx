"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import styles from "./TeacherAccount.module.css";

type GoogleIdentity = { accounts: { id: { initialize: (config: { client_id: string; callback: (response: { credential: string }) => void; auto_select?: boolean }) => void; renderButton: (element: HTMLElement, options: Record<string, unknown>) => void } } };

export function TeacherLogin({ nextPath, googleClientId }: { nextPath: string; googleClientId: string }) {
  const button = useRef<HTMLDivElement>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/teacher/", { cache: "no-store" }).then((response) => {
      if (response.ok) window.location.replace(nextPath);
      else setBusy(false);
    }).catch(() => setBusy(false));
  }, [nextPath]);

  useEffect(() => {
    if (!googleReady || busy || !googleClientId || !button.current) return;
    const google = (window as Window & { google?: GoogleIdentity }).google;
    if (!google) return;
    google.accounts.id.initialize({
      client_id: googleClientId,
      auto_select: false,
      callback: async ({ credential }) => {
        setBusy(true); setMessage("Sedang mengesahkan akaun cikgu…");
        try {
          const response = await fetch("/api/auth/teacher/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential }),
          });
          const result = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(result.error ?? "Akaun belum dapat disahkan.");
          window.location.replace(nextPath);
        } catch (error) {
          setBusy(false);
          setMessage(error instanceof Error ? error.message : "Akaun belum dapat disahkan.");
        }
      },
    });
    button.current.replaceChildren();
    google.accounts.id.renderButton(button.current, { type: "standard", theme: "outline", size: "large", shape: "pill", text: "continue_with", width: 320 });
  }, [busy, googleClientId, googleReady, nextPath]);

  return <main className={styles.page}>
    {googleClientId ? <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setGoogleReady(true)} /> : null}
    <header className={styles.header}>
      <Link className={styles.logo} href="/"><Image src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" width={240} height={64} priority /></Link>
      <Link className={styles.back} href="/">← Kembali</Link>
    </header>
    <section className={styles.shell}>
      <article className={styles.card}>
        <span className={styles.eyebrow}>AKAUN PANDAIKIDS CIKGU</span>
        <h1>Log masuk untuk teruskan.</h1>
        <p className={styles.lead}>Pilih akaun Google cikgu. Pembayaran dan pakej akan disimpan pada akaun ini.</p>
        {busy ? <div className={styles.spinner} aria-label="Sedang memuatkan" /> : null}
        {!busy && googleClientId ? <div className={styles.googleButton} ref={button} /> : null}
        {!busy && !googleClientId ? <p className={styles.error}>Log masuk Google belum diaktifkan.</p> : null}
        {message ? <p className={message.includes("belum") ? styles.error : styles.message}>{message}</p> : null}
        <small className={styles.privacy}>Pandaikids tidak menerima atau menyimpan kata laluan Google cikgu.</small>
      </article>
    </section>
  </main>;
}
