import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CopyQuizLink, SignOutButton } from "@/components/cikgu/TeacherDashboardActions";
import { getTeacherDashboard } from "@/lib/teacher-dashboard";
import { readTeacherSessionValue, SESSION_COOKIE } from "@/lib/teacher-auth";
import styles from "./dashboard.module.css";

export const metadata: Metadata = {
  title: "Dashboard Guru",
  description: "Pantau kuiz, penggunaan pakej dan keputusan murid Pandaikids.",
};
export const dynamic = "force-dynamic";

const dateTime = new Intl.DateTimeFormat("ms-MY", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kuala_Lumpur",
});
const dateOnly = new Intl.DateTimeFormat("ms-MY", {
  dateStyle: "medium",
  timeZone: "Asia/Kuala_Lumpur",
});

function fmtDate(value?: Date | string | null) {
  return value ? dateTime.format(new Date(value)) : "Belum ada";
}

function quotaText(used: number, limit: number, admin: boolean) {
  return admin ? "Tanpa had" : `${Math.max(0, limit - used)} daripada ${limit} berbaki`;
}

function quotaPercent(used: number, limit: number, admin: boolean) {
  if (admin) return 4;
  return Math.min(100, Math.round((used / Math.max(1, limit)) * 100));
}

export default async function TeacherDashboardPage() {
  const cookieStore = await cookies();
  const session = readTeacherSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) redirect("/log-masuk/?next=%2Fdashboard%2F");

  const data = await getTeacherDashboard(session.teacherId);
  const admin = data.quota.plan.name === "Admin";
  const renewal = admin
    ? "Akses Admin tanpa had"
    : data.subscription?.ends_at
      ? `Aktif sehingga ${dateOnly.format(new Date(data.subscription.ends_at))}`
      : `Kuota diperbaharui ${dateOnly.format(new Date(data.quota.renewsAt))}`;

  const usage = [
    {
      label: "Buat Sendiri",
      used: data.quota.manualUsed,
      limit: data.quota.plan.manualLimit,
      text: quotaText(data.quota.manualUsed, data.quota.plan.manualLimit, admin),
    },
    {
      label: "Guna AI",
      used: data.quota.aiUsed,
      limit: data.quota.plan.aiLimit,
      text: quotaText(data.quota.aiUsed, data.quota.plan.aiLimit, admin),
    },
    {
      label: "Kuiz Siap",
      used: data.quota.readyUsed,
      limit: data.quota.plan.readyLimit,
      text: quotaText(data.quota.readyUsed, data.quota.plan.readyLimit, admin),
    },
  ];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <Image src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" width={240} height={64} priority />
        </Link>
        <nav aria-label="Tindakan akaun">
          <Link href="/aktiviti/bina/">＋ Bina kuiz</Link>
          <SignOutButton />
        </nav>
      </header>

      <section className={styles.shell}>
        <div className={styles.welcome}>
          <div>
            <span>DASHBOARD GURU</span>
            <h1>Assalamualaikum, {session.name}.</h1>
            <p>Pantau aktiviti dan keputusan murid dalam satu tempat.</p>
          </div>
          <div className={styles.plan}>
            <small>PAKEJ SEMASA</small>
            <strong>{data.quota.plan.name}</strong>
            <span>{renewal}</span>
            {!admin && data.quota.plan.id === "free" ? <Link href="/harga/">Lihat pakej berbayar →</Link> : null}
          </div>
        </div>

        <section className={styles.summary} aria-label="Ringkasan aktiviti">
          <article><span>Kuiz diterbitkan</span><strong>{data.summary.activities}</strong></article>
          <article><span>Jumlah jawapan</span><strong>{data.summary.responses}</strong></article>
          <article><span>Murid direkodkan</span><strong>{data.summary.students}</strong></article>
          <article><span>Purata markah</span><strong>{data.summary.responses ? `${data.summary.average}%` : "—"}</strong></article>
        </section>

        <section className={styles.quotaSection}>
          <div className={styles.sectionHeading}>
            <div>
              <span>PENGGUNAAN BULAN INI</span>
              <h2>Baki aktiviti cikgu</h2>
            </div>
            <Link href="/harga/">Bandingkan pakej</Link>
          </div>
          <div className={styles.quotaGrid}>
            {usage.map((item) => (
              <article key={item.label}>
                <div><b>{item.label}</b><span>{admin ? "∞" : `${item.used}/${item.limit}`}</span></div>
                <i><b style={{ width: `${quotaPercent(item.used, item.limit, admin)}%` }} /></i>
                <small>{item.text}</small>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.activities}>
          <div className={styles.sectionHeading}>
            <div>
              <span>AKTIVITI SAYA</span>
              <h2>Kuiz yang telah diterbitkan</h2>
            </div>
            <Link href="/aktiviti/bina/">＋ Bina kuiz baharu</Link>
          </div>

          {data.quizzes.length ? (
            <div className={styles.activityList}>
              {data.quizzes.map((quiz) => (
                <article className={styles.activityCard} key={quiz.id}>
                  <div className={styles.activityMain}>
                    <div className={styles.activityIcon}>{quiz.source_bank === "custom" ? "✎" : "✓"}</div>
                    <div>
                      <div className={styles.activityMeta}>
                        <span>{quiz.source_bank === "custom" ? "Kuiz Cikgu" : "Kuiz Siap"}</span>
                        <span>{quiz.access_mode === "delima" ? "DELIMa" : "Terbuka"}</span>
                      </div>
                      <h3>{quiz.title}</h3>
                      <p>
                        {[quiz.subject, quiz.year ? `Tahun ${quiz.year}` : null, `${quiz.question_count} soalan`]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <small>Diterbitkan {fmtDate(quiz.published_at ?? quiz.created_at)}</small>
                    </div>
                  </div>

                  <div className={styles.activityStats}>
                    <div><span>Murid</span><strong>{quiz.students}</strong></div>
                    <div><span>Purata</span><strong>{quiz.responses ? `${quiz.average}%` : "—"}</strong></div>
                    <div><span>Jawapan akhir</span><strong>{quiz.last_response ? fmtDate(quiz.last_response) : "Belum ada"}</strong></div>
                  </div>

                  <div className={styles.activityActions}>
                    <Link href={`/dashboard/aktiviti/${quiz.id}/`}>Lihat keputusan</Link>
                    <CopyQuizLink quizId={quiz.id} />
                    <Link href={`/aktiviti/?kuiz=${quiz.id}`} target="_blank" rel="noreferrer">Lihat kuiz ↗</Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <span aria-hidden="true">✦</span>
              <h3>Belum ada kuiz diterbitkan.</h3>
              <p>Bina kuiz pertama dan kongsi pautannya kepada murid.</p>
              <Link href="/aktiviti/bina/">Bina kuiz pertama</Link>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
