import styles from "./CikguHomepage.module.css";

type IconName = "book" | "math" | "science" | "language" | "sparkle" | "arrow" | "down" | "menu";

function Icon({ name }: { name: IconName }) {
  const props = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "arrow") return <svg {...props}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>;
  if (name === "down") return <svg {...props}><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></svg>;
  if (name === "menu") return <svg {...props}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
  if (name === "book") return <svg {...props}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></svg>;
  if (name === "math") return <svg {...props}><path d="M12 4v16M4 12h16" /><path d="m5 5 14 14M19 5 5 19" /></svg>;
  if (name === "science") return <svg {...props}><path d="M9 3h6M10 3v6l-5 8a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-8V3" /><path d="M8 15h8" /></svg>;
  if (name === "language") return <svg {...props}><path d="M4 5h10M9 3v2c0 6-2 10-5 12" /><path d="M6 12c2 0 5 1 7 4" /><path d="m14 19 3-8 3 8M15.2 16h3.6" /></svg>;
  return <svg {...props}><path d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4z" /><path d="m19 16-.7 2.3L16 19l2.3.7L19 22l.7-2.3L22 19l-2.3-.7z" /></svg>;
}

const quizzes = [
  { year: "TAHUN 3", name: "Matematik", count: "Pilih ikut tajuk", icon: "math" as const, color: "math" },
  { year: "TAHUN 3", name: "Bahasa Melayu", count: "Pilih ikut tajuk", icon: "book" as const, color: "bm" },
  { year: "TAHUN 4", name: "Sains", count: "Pilih ikut tajuk", icon: "science" as const, color: "science" },
  { year: "TAHUN 4", name: "Bahasa Inggeris", count: "Pilih ikut tajuk", icon: "language" as const, color: "english" },
];

export function CikguHomepage() {
  return <main className={styles.page}>
    <section className={styles.hero} id="utama">
      <header className={styles.header}>
        <a href="#utama" className={styles.logo} aria-label="Pandaikids Cikgu"><img src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" /></a>
        <nav className={styles.navigation} aria-label="Navigasi utama">
          <a href="#kuiz">Aktiviti Siap</a><a href="#bina">Bina Sendiri</a><a href="/upkk/">UPKK</a><a className={styles.login} href="#log-masuk">Log Masuk</a><button type="button" aria-label="Menu"><Icon name="menu" /></button>
        </nav>
      </header>
      <div className={styles.heroCopy}>
        <h1><span>Sediakan latihan untuk murid.</span><strong>Kongsi terus melalui DELIMa.</strong></h1>
        <div className={styles.heroActions}><a className={styles.readyButton} href="#kuiz">Pilih Kuiz Siap</a><a className={styles.customButton} href="/aktiviti/pilih/">Bina Soalan Sendiri</a></div>
        <p>Murid jawab melalui pautan.</p>
      </div>
      <a href="#kuiz" className={styles.scrollHint}>Lihat cara ia berfungsi <Icon name="down" /></a>
    </section>
    <section className={styles.quizzes} id="kuiz">
      <div className={styles.intro}><h2>Latihan percuma untuk terus dikongsi.</h2><p>Pilih satu, kemudian beri pautan kepada murid.</p></div>
      <div className={styles.quizGrid}>{quizzes.map((quiz) => <a className={styles.quizCard} href={`/aktiviti/pilih/?subjek=${encodeURIComponent(quiz.name)}`} key={quiz.name}>
        <span className={`${styles.quizIcon} ${styles[quiz.color]}`}><Icon name={quiz.icon} /></span><div><small>{quiz.year}</small><h3>{quiz.name}</h3><p>{quiz.count}</p></div><b>Buka &amp; Kongsi <Icon name="arrow" /></b>
      </a>)}</div>
    </section>
    <section className={styles.customSection} id="bina"><div className={styles.customCard}>
      <span className={styles.sparkle}><Icon name="sparkle" /></span><div><small>IKUT BAHAN CIKGU SENDIRI</small><h2>Nak bina latihan sendiri?</h2><p>Guna nota, PDF atau teks cikgu. Kami bantu susun jadi latihan.</p></div><a className={styles.premiumButton} href="/aktiviti/pilih/">Bina Soalan Sendiri <Icon name="arrow" /></a>
    </div></section>
    <footer className={styles.footer} id="log-masuk">© 2026 Pandaikids Cikgu <span>•</span> Dibina untuk cikgu di Malaysia <b>♥</b></footer>
  </main>;
}
