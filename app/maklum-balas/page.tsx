import { randomUUID } from "crypto";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCikguDb } from "@/lib/cikgu-db";
import { readTeacherSessionValue, SESSION_COOKIE } from "@/lib/teacher-auth";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Cadangan & Aduan Cikgu" };
export const dynamic = "force-dynamic";

const categories = new Set(["CADANGAN", "MASALAH", "PAPARAN", "LAIN_LAIN"]);

function safeSource(value?: string) {
  return value?.startsWith("/") && !value.startsWith("//") ? value.slice(0, 120) : "/";
}

async function submitFeedback(formData: FormData) {
  "use server";

  const cookieStore = await cookies();
  const session = readTeacherSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
  const source = safeSource(String(formData.get("source") ?? "/"));
  if (!session) redirect(`/log-masuk/?next=${encodeURIComponent(`/maklum-balas/?dari=${encodeURIComponent(source)}`)}`);

  const category = String(formData.get("category") ?? "");
  const message = String(formData.get("message") ?? "").replace(/\s+/g, " ").trim();
  if (!categories.has(category) || message.length < 10 || message.length > 600) {
    redirect(`/maklum-balas/?status=invalid&dari=${encodeURIComponent(source)}`);
  }

  const db = getCikguDb();
  const recent = await db.query(
    "SELECT COUNT(*)::int count FROM admin_system_events WHERE event_type='FEEDBACK' AND teacher_id=$1 AND created_at>NOW()-INTERVAL '10 minutes'",
    [session.teacherId],
  );
  if (Number(recent.rows[0]?.count ?? 0) >= 3) {
    redirect(`/maklum-balas/?status=limit&dari=${encodeURIComponent(source)}`);
  }

  await db.query(
    `INSERT INTO admin_system_events
      (id,event_type,route,status,teacher_id,message,metadata)
      VALUES ($1,'FEEDBACK',$2,'NEW',$3,$4,$5::jsonb)`,
    [randomUUID(), source, session.teacherId, message, JSON.stringify({ category })],
  );
  redirect("/maklum-balas/?status=sent");
}

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ dari?: string; status?: string }>;
}) {
  const params = await searchParams;
  const source = safeSource(params.dari);
  const cookieStore = await cookies();
  const session = readTeacherSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    const next = `/maklum-balas/?dari=${encodeURIComponent(source)}`;
    redirect(`/log-masuk/?next=${encodeURIComponent(next)}`);
  }

  const sent = params.status === "sent";
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/">
          <Image src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" width={240} height={64} priority />
        </Link>
        <Link href={source}>← Kembali</Link>
      </header>

      <section className={styles.card}>
        {sent ? (
          <div className={styles.success}>
            <span aria-hidden="true">✓</span>
            <p className={styles.eyebrow}>SUDAH DITERIMA</p>
            <h1>Terima kasih, cikgu.</h1>
            <p>Cadangan atau aduan cikgu sudah dihantar terus kepada pihak PandaiKids.</p>
            <Link href={source}>Kembali ke halaman tadi</Link>
          </div>
        ) : (
          <>
            <p className={styles.eyebrow}>BANTU KAMI TAMBAH BAIK</p>
            <h1>Cadangan &amp; Aduan</h1>
            <p className={styles.lead}>Ceritakan secara ringkas apa yang patut diperbaiki. Maklum balas cikgu membantu kami kemaskan sistem.</p>

            {params.status === "invalid" ? <p className={styles.error}>Pilih jenis maklum balas dan tulis sekurang-kurangnya 10 aksara.</p> : null}
            {params.status === "limit" ? <p className={styles.error}>Terlalu banyak kiriman dalam masa singkat. Cuba semula sebentar lagi.</p> : null}

            <div className={styles.identity}>
              <b>{session.name}</b>
              <span>{session.email}</span>
            </div>

            <form action={submitFeedback}>
              <input type="hidden" name="source" value={source} />
              <label>
                Jenis
                <select name="category" defaultValue="CADANGAN" required>
                  <option value="CADANGAN">Cadangan tambah baik</option>
                  <option value="MASALAH">Masalah atau aduan</option>
                  <option value="PAPARAN">Paparan susah digunakan</option>
                  <option value="LAIN_LAIN">Lain-lain</option>
                </select>
              </label>
              <label>
                Apa yang cikgu ingin sampaikan?
                <textarea
                  name="message"
                  minLength={10}
                  maxLength={600}
                  required
                  placeholder="Contoh: Saya cadangkan tambah pilihan untuk salin kuiz lama…"
                />
                <small>Maksimum 600 aksara.</small>
              </label>
              <button type="submit">Hantar kepada PandaiKids</button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
