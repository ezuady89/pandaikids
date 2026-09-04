import Image from "next/image";
import styles from "./CikguHomepage.module.css";

type IconName =
  | "arrow"
  | "book"
  | "check"
  | "down"
  | "edit"
  | "file"
  | "language"
  | "link"
  | "math"
  | "menu"
  | "phone"
  | "science"
  | "share"
  | "sparkle"
  | "user";

function Icon({ name }: { name: IconName }) {
  const props = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "arrow")
    return (
      <svg {...props}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  if (name === "down")
    return (
      <svg {...props}>
        <path d="M12 5v14" />
        <path d="m6 13 6 6 6-6" />
      </svg>
    );
  if (name === "menu")
    return (
      <svg {...props}>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    );
  if (name === "book")
    return (
      <svg {...props}>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
      </svg>
    );
  if (name === "math")
    return (
      <svg {...props}>
        <path d="M12 4v16M4 12h16" />
        <path d="m5 5 14 14M19 5 5 19" />
      </svg>
    );
  if (name === "science")
    return (
      <svg {...props}>
        <path d="M9 3h6M10 3v6l-5 8a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-8V3" />
        <path d="M8 15h8" />
      </svg>
    );
  if (name === "language")
    return (
      <svg {...props}>
        <path d="M4 5h10M9 3v2c0 6-2 10-5 12" />
        <path d="M6 12c2 0 5 1 7 4" />
        <path d="m14 19 3-8 3 8M15.2 16h3.6" />
      </svg>
    );
  if (name === "file")
    return (
      <svg {...props}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h6" />
      </svg>
    );
  if (name === "link")
    return (
      <svg {...props}>
        <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
        <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
      </svg>
    );
  if (name === "user")
    return (
      <svg {...props}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    );
  if (name === "edit")
    return (
      <svg {...props}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" />
      </svg>
    );
  if (name === "phone")
    return (
      <svg {...props}>
        <rect x="6" y="2" width="12" height="20" rx="2" />
        <path d="M10 18h4" />
      </svg>
    );
  if (name === "share")
    return (
      <svg {...props}>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
      </svg>
    );
  if (name === "check")
    return (
      <svg {...props}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  return (
    <svg {...props}>
      <path d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4z" />
      <path d="m19 16-.7 2.3L16 19l2.3.7L19 22l.7-2.3L22 19l-2.3-.7z" />
    </svg>
  );
}

const quizzes = [
  { name: "Matematik", icon: "math" as const, color: "math" },
  { name: "Bahasa Melayu", icon: "book" as const, color: "bm" },
  { name: "Bahasa Inggeris", icon: "language" as const, color: "english" },
  { name: "Sains", icon: "science" as const, color: "science" },
  { name: "Pendidikan Islam", icon: "sparkle" as const, color: "islam" },
];

const benefits = [
  { icon: "user" as const, text: "Murid jawab tanpa daftar", color: "coral" },
  {
    icon: "edit" as const,
    text: "Cikgu boleh ubah semua soalan",
    color: "yellow",
  },
  {
    icon: "share" as const,
    text: "Kongsi melalui DELIMa, Classroom & WhatsApp",
    color: "teal",
  },
];

function MobileNavigation() {
  return (
    <details className={styles.mobileNavigation}>
      <summary aria-label="Buka menu">
        <Icon name="menu" />
      </summary>
      <div>
        <a href="#kuiz">Aktiviti Siap</a>
        <a href="/aktiviti/bina/">Bina dengan AI</a>
        <a href="#cara">Cara Guna</a>
        <a href="#harga">Harga</a>
        <a href="#log-masuk">Log Masuk</a>
      </div>
    </details>
  );
}

function ProductPreview() {
  return (
    <div
      className={styles.productPreview}
      aria-label="Aliran membina kuiz daripada nota cikgu"
    >
      <article className={`${styles.previewCard} ${styles.noteCard}`}>
        <header>
          <span className={`${styles.previewIcon} ${styles.coral}`}>
            <Icon name="file" />
          </span>
          <span>
            <small>LANGKAH 1</small>
            <b>Masukkan nota</b>
          </span>
        </header>
        <div className={`${styles.previewMedia} ${styles.noteMedia}`}>
          <Image
            src="/assets/cikgu/hero-note.webp"
            alt="Contoh nota bergambar tentang fotosintesis"
            fill
            sizes="(max-width: 760px) 84vw, 240px"
          />
        </div>
      </article>

      <span className={styles.flowArrow} aria-hidden="true">
        <i />
        <Icon name="arrow" />
      </span>

      <article className={`${styles.previewCard} ${styles.questionCard}`}>
        <header>
          <span className={`${styles.previewIcon} ${styles.teal}`}>
            <Icon name="sparkle" />
          </span>
          <span>
            <small>LANGKAH 2</small>
            <b>Soalan terus siap</b>
          </span>
        </header>
        <div className={`${styles.previewMedia} ${styles.quizMedia}`}>
          <Image
            src="/assets/cikgu/hero-quiz-fotosintesis.webp"
            alt="Contoh soalan kuiz Fotosintesis yang dijana untuk murid"
            fill
            sizes="(max-width: 760px) 84vw, 290px"
          />
        </div>
        <div className={styles.reviewNote}>
          <Icon name="check" /> Cikgu boleh semak &amp; ubah
        </div>
      </article>
    </div>
  );
}

export function CikguHomepage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} id="utama">
        <header className={styles.header}>
          <a
            href="#utama"
            className={styles.logo}
            aria-label="Pandaikids Cikgu"
          >
            <Image
              src="/assets/pandaikids-logo-colour.png"
              alt="PandaiKids.com"
              width={240}
              height={64}
              priority
            />
          </a>
          <nav className={styles.navigation} aria-label="Navigasi utama">
            <a href="#kuiz">Aktiviti Siap</a>
            <a href="/aktiviti/bina/">Bina dengan AI</a>
            <a href="#cara">Cara Guna</a>
            <a href="#harga">Harga</a>
            <a href="#log-masuk">Log Masuk</a>
            <a className={styles.headerCta} href="/aktiviti/bina/">
              Bina Kuiz Percuma
            </a>
          </nav>
          <MobileNavigation />
        </header>

        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <h1>
              <span>Sediakan latihan untuk murid.</span>
              <strong>Kongsi terus melalui DELIMa.</strong>
            </h1>
            <p className={styles.heroLead}>
              Pilih kuiz siap atau tukarkan nota, gambar dan PDF kepada latihan.
              Cikgu boleh semak dahulu sebelum berkongsi.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.customButton} href="/aktiviti/bina/">
                <Icon name="sparkle" /> Bina dengan AI
              </a>
              <a className={styles.readyButton} href="#kuiz">
                Pilih Kuiz Siap
              </a>
            </div>
            <div className={styles.microBenefits}>
              <span>
                <i className={styles.coral}>
                  <Icon name="user" />
                </i>
                Murid tanpa daftar
              </span>
              <span>
                <i className={styles.yellow}>
                  <Icon name="edit" />
                </i>
                Boleh semak dahulu
              </span>
              <span>
                <i className={styles.teal}>
                  <Icon name="phone" />
                </i>
                Sesuai untuk telefon
              </span>
            </div>
          </div>
          <ProductPreview />
        </div>

        <div className={styles.benefitStrip} id="cara">
          {benefits.map((benefit) => (
            <div key={benefit.text}>
              <span className={styles[benefit.color]}>
                <Icon name={benefit.icon} />
              </span>
              <b>
                <Icon name="check" /> {benefit.text}
              </b>
            </div>
          ))}
        </div>
        <a
          href="#kuiz"
          className={styles.scrollHint}
          aria-label="Lihat aktiviti siap"
        >
          <Icon name="down" />
        </a>
      </section>

      <section className={styles.quizzes} id="kuiz">
        <div className={styles.sectionLead}>
          <h2>Mudah untuk cikgu. Seronok untuk murid.</h2>
          <i />
        </div>
        <div className={styles.intro}>
          <h3>Pilih subjek untuk mula.</h3>
          <p>Tahun 1 hingga 6 · pilih tajuk dan soalan sendiri.</p>
        </div>
        <div className={styles.quizGrid}>
          {quizzes.map((quiz) => (
            <a
              className={styles.quizCard}
              href={`/aktiviti/pilih/?subjek=${encodeURIComponent(quiz.name)}`}
              key={quiz.name}
            >
              <span className={`${styles.quizIcon} ${styles[quiz.color]}`}>
                <Icon name={quiz.icon} />
              </span>
              <div>
                <small>TAHUN 1–6</small>
                <h4>{quiz.name}</h4>
                <p>Pilih tajuk &amp; soalan</p>
              </div>
              <b>
                Mula pilih <Icon name="arrow" />
              </b>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.customSection} id="bina">
        <div className={styles.customCard}>
          <span className={styles.sparkle}>
            <Icon name="sparkle" />
          </span>
          <div>
            <small>IKUT CARA CIKGU SENDIRI</small>
            <h2>Bina kuiz ikut cara cikgu.</h2>
            <p>
              Taip soalan sendiri, atau guna nota, gambar dan PDF.
              <span>Format soalan dan jawapan sudah disediakan.</span>
            </p>
          </div>
          <a className={styles.premiumButton} href="/aktiviti/bina/">
            Mula Bina Kuiz <Icon name="arrow" />
          </a>
        </div>
      </section>

      <section className={styles.priceSection} id="harga">
        <div>
          <span className={styles.priceEyebrow}>MULAKAN PERCUMA</span>
          <h2>Uji dahulu sebelum melanggan.</h2>
          <p>
            Hasilkan sehingga 3 aktiviti AI setiap bulan. Murid boleh menjawab
            melalui pautan tanpa membuka akaun.
          </p>
          <a href="/aktiviti/bina/">
            Bina Kuiz Percuma <Icon name="arrow" />
          </a>
        </div>
      </section>

      <footer className={styles.footer} id="log-masuk">
        <span>© 2026 Pandaikids Cikgu</span>
        <i>•</i>
        <span>Dibina untuk cikgu di Malaysia</span>
        <i>•</i>
        <a href="/upkk/">Pandaikids UPKK</a>
      </footer>
    </main>
  );
}
