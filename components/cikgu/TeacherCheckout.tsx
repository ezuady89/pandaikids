"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { TeacherPlanId } from "@/lib/cikgu-plans";
import styles from "./TeacherAccount.module.css";

type Account = { name: string; email: string };

export function TeacherCheckout({ planId, planName, price }: { planId: TeacherPlanId; planName: string; price: string }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/teacher/", { cache: "no-store" }).then(async (response) => {
      if (response.status === 401) {
        const next = `/checkout/?plan=${planId}`;
        window.location.replace(`/log-masuk/?next=${encodeURIComponent(next)}`);
        return;
      }
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? "Akaun belum dapat dibaca.");
      setAccount(result.user); setBusy(false);
    }).catch((error) => { setBusy(false); setMessage(error instanceof Error ? error.message : "Akaun belum dapat dibaca."); });
  }, [planId]);

  const pay = async () => {
    if (busy) return;
    setBusy(true); setMessage("Menyediakan halaman bayaran selamat…");
    try {
      const response = await fetch("/api/payments/toyyibpay/checkout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.status === 401) {
        window.location.replace(`/log-masuk/?next=${encodeURIComponent(`/checkout/?plan=${planId}`)}`);
        return;
      }
      if (!response.ok) throw new Error(result.error ?? "Halaman bayaran belum dapat dibuka.");
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setBusy(false); setMessage(error instanceof Error ? error.message : "Halaman bayaran belum dapat dibuka.");
    }
  };

  return <main className={styles.page}>
    <header className={styles.header}>
      <Link className={styles.logo} href="/"><Image src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" width={240} height={64} priority /></Link>
      <Link className={styles.back} href="/harga/">← Tukar pakej</Link>
    </header>
    <section className={styles.shell}>
      <article className={styles.card}>
        <span className={styles.eyebrow}>SEMAK SEBELUM BAYAR</span>
        <h1>{planName}</h1>
        <p className={styles.lead}>Pakej aktif selama 30 hari selepas bayaran disahkan.</p>
        <div className={styles.summary}>
          <div className={styles.summaryRow}><h2>{planName}</h2><strong>{price}<small> / 30 hari</small></strong></div>
          <p>Bayaran sekali melalui ToyyibPay. Tiada pembaharuan automatik.</p>
        </div>
        {account ? <div className={styles.account}><b>{account.name}</b><span>{account.email}</span></div> : null}
        {message ? <p className={message.includes("Menyediakan") ? styles.message : styles.error}>{message}</p> : null}
        <button className={styles.primary} type="button" onClick={pay} disabled={busy || !account}>{busy ? "Sila tunggu…" : "Teruskan ke ToyyibPay →"}</button>
        <p className={styles.secure}>Pakej akan diberikan kepada akaun yang tertera di atas.</p>
      </article>
    </section>
  </main>;
}
