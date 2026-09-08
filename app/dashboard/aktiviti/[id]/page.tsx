import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { CopyQuizLink, SignOutButton } from "@/components/cikgu/TeacherDashboardActions";
import { getTeacherQuizDetail } from "@/lib/teacher-dashboard";
import { readTeacherSessionValue, SESSION_COOKIE } from "@/lib/teacher-auth";
import styles from "../../dashboard.module.css";

export const metadata: Metadata = { title: "Keputusan Murid" };
export const dynamic = "force-dynamic";

const dateTime = new Intl.DateTimeFormat("ms-MY", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kuala_Lumpur",
});

function fmtDate(value: Date | string) {
  return dateTime.format(new Date(value));
}

function fmtDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes ? `${minutes} min ${rest} saat` : `${rest} saat`;
}

export default async function TeacherActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const session = readTeacherSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
  const { id } = await params;
  if (!session) redirect(`/log-masuk/?next=${encodeURIComponent(`/dashboard/aktiviti/${id}/`)}`);

  const data = await getTeacherQuizDetail(session.teacherId, id);
  if (!data) notFound();

  const topScore = data.attempts.length
    ? Math.max(...data.attempts.map((item) => Math.round((item.score / item.total) * 100)))
    : 0;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          <Image src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" width={240} height={64} priority />
        </Link>
        <nav aria-label="Tindakan akaun">
          <Link href="/dashboard/">← Dashboard</Link>
          <SignOutButton />
        </nav>
      </header>

      <section className={styles.shell}>
        <section className={styles.detailHero}>
          <div>
            <span>KEPUTUSAN MURID</span>
            <h1>{data.quiz.title}</h1>
            <p>
              {[data.quiz.subject, data.quiz.year ? `Tahun ${data.quiz.year}` : null, `${data.quiz.question_count} soalan`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className={styles.detailActions}>
            <CopyQuizLink quizId={data.quiz.id} />
            <Link href={`/aktiviti/?kuiz=${data.quiz.id}`} target="_blank" rel="noreferrer">Lihat sebagai murid ↗</Link>
            <a href={`/api/cikgu-dashboard/aktiviti/${data.quiz.id}/export/`}>Muat turun CSV</a>
          </div>
        </section>

        <section className={styles.summary} aria-label="Ringkasan keputusan">
          <article><span>Jumlah jawapan</span><strong>{data.attempts.length}</strong></article>
          <article><span>Murid direkodkan</span><strong>{new Set(data.attempts.map((item) => item.student_name.toLowerCase())).size}</strong></article>
          <article><span>Purata markah</span><strong>{data.quiz.responses ? `${data.quiz.average}%` : "—"}</strong></article>
          <article><span>Markah tertinggi</span><strong>{data.attempts.length ? `${topScore}%` : "—"}</strong></article>
        </section>

        <section className={styles.results}>
          <div className={styles.sectionHeading}>
            <div>
              <span>SENARAI JAWAPAN</span>
              <h2>Prestasi murid</h2>
            </div>
            <small>Kemas kini apabila halaman dibuka semula</small>
          </div>

          {data.attempts.length ? (
            <>
              <div className={styles.attemptTable}>
                <table>
                  <thead>
                    <tr>
                      <th>Kedudukan</th>
                      <th>Nama murid</th>
                      <th>Markah</th>
                      <th>Peratus</th>
                      <th>Masa</th>
                      <th>Dihantar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.attempts.map((attempt) => (
                      <tr key={attempt.id}>
                        <td><b>#{attempt.rank}</b></td>
                        <td><strong>{attempt.student_name}</strong></td>
                        <td>{attempt.score}/{attempt.total}</td>
                        <td><span className={styles.scoreBadge}>{Math.round((attempt.score / attempt.total) * 100)}%</span></td>
                        <td>{fmtDuration(attempt.duration_seconds)}</td>
                        <td>{fmtDate(attempt.completed_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.attemptCards}>
                {data.attempts.map((attempt) => (
                  <article key={attempt.id}>
                    <header><b>#{attempt.rank} · {attempt.student_name}</b><span>{Math.round((attempt.score / attempt.total) * 100)}%</span></header>
                    <div><span>Markah <b>{attempt.score}/{attempt.total}</b></span><span>Masa <b>{fmtDuration(attempt.duration_seconds)}</b></span></div>
                    <small>{fmtDate(attempt.completed_at)}</small>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <span aria-hidden="true">◎</span>
              <h3>Belum ada murid menjawab.</h3>
              <p>Salin pautan kuiz dan kongsikan kepada murid.</p>
              <CopyQuizLink quizId={data.quiz.id} />
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
