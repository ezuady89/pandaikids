"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./TeacherAccount.module.css";

type ViewState = "checking" | "paid" | "pending" | "failed" | "error";

export function PaymentStatus({ orderId }: { orderId: string }) {
  const [state, setState] = useState<ViewState>(orderId ? "checking" : "error");
  const [planName, setPlanName] = useState("");
  const [message, setMessage] = useState(orderId ? "Sedang mengesahkan bayaran dengan ToyyibPay…" : "Nombor pesanan tidak ditemui.");

  useEffect(() => {
    let stopped = false;
    let attempts = 0;
    const check = async () => {
      try {
        const response = await fetch(`/api/payments/toyyibpay/status/?order_id=${encodeURIComponent(orderId)}`, { cache: "no-store" });
        if (response.status === 401) {
          const next = `/pembayaran/status/?order_id=${encodeURIComponent(orderId)}`;
          window.location.replace(`/log-masuk/?next=${encodeURIComponent(next)}`);
          return;
        }
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error ?? "Status bayaran belum dapat disemak.");
        if (result.status === "PAID") {
          setPlanName(result.plan?.name ?? "pakej berbayar"); setState("paid"); setMessage("Bayaran berjaya dan pakej cikgu sudah aktif."); return;
        }
        if (result.status === "FAILED" || result.status === "CREATE_FAILED") {
          setState("failed"); setMessage("Bayaran tidak berjaya atau telah dibatalkan."); return;
        }
        attempts += 1;
        if (attempts < 6 && !stopped) { window.setTimeout(check, 2000); return; }
        setState("pending"); setMessage("Bayaran masih diproses. Cikgu boleh semak semula sebentar lagi.");
      } catch (error) {
        setState("error"); setMessage(error instanceof Error ? error.message : "Status bayaran belum dapat disemak.");
      }
    };
    if (orderId) check();
    return () => { stopped = true; };
  }, [orderId]);

  return <main className={styles.page}>
    <header className={styles.header}>
      <Link className={styles.logo} href="/"><Image src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" width={240} height={64} priority /></Link>
      <Link className={styles.back} href="/">Halaman utama</Link>
    </header>
    <section className={styles.shell}>
      <article className={styles.card}>
        {state === "checking" ? <div className={styles.spinner} aria-label="Sedang menyemak" /> : <div className={`${styles.statusIcon} ${state === "pending" ? styles.pending : state === "failed" || state === "error" ? styles.failed : ""}`}>{state === "paid" ? "✓" : state === "pending" ? "…" : "!"}</div>}
        <span className={styles.eyebrow}>STATUS PEMBAYARAN</span>
        <h1>{state === "paid" ? "Bayaran berjaya!" : state === "failed" ? "Bayaran tidak berjaya" : state === "pending" ? "Masih diproses" : state === "error" ? "Belum dapat disemak" : "Sedang menyemak"}</h1>
        <p className={styles.lead}>{message}</p>
        {state === "paid" && planName ? <div className={styles.summary}><div className={styles.summaryRow}><h2>Pakej aktif</h2><strong>{planName}</strong></div></div> : null}
        <div className={styles.actions}>
          {state === "paid" ? <Link className={styles.primary} href="/aktiviti/bina/" style={{display:"grid",placeItems:"center",textDecoration:"none"}}>Mula bina kuiz →</Link> : null}
          {(state === "failed" || state === "error") ? <Link className={styles.primary} href="/harga/" style={{display:"grid",placeItems:"center",textDecoration:"none"}}>Pilih pakej semula</Link> : null}
          <Link className={styles.secondary} href="/">Kembali ke Pandaikids</Link>
        </div>
      </article>
    </section>
  </main>;
}
