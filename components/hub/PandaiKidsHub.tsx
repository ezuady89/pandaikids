import Image from "next/image";
import Link from "next/link";

import { withBasePath } from "@/lib/paths";

import styles from "./PandaiKidsHub.module.css";

const logoSrc = withBasePath("/pandaikids/nota-kilat-v3/logo.webp");
const homeBgSrc = withBasePath("/pandaikids/hub/home-bg.webp");
const pandiReadingSrc = withBasePath("/pandaikids/hub/pandi-reading-sofa.webp");
const gameBgSrc = withBasePath("/pandaikids/hub/game-bg.webp");
const controllerSrc = withBasePath("/pandaikids/hub/game-controller.webp");

export function PandaiKidsHub() {
  return (
    <main className={styles.page}>
      <Image
        className={styles.pageBackground}
        src={homeBgSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
      />
      <div className={styles.pageWash} aria-hidden="true" />

      <header className={styles.header}>
        <Image
          className={styles.logo}
          src={logoSrc}
          alt="PandaiKids"
          width={760}
          height={220}
          priority
        />
        <p>Belajar Islam • Faham • Amal</p>
      </header>

      <section className={styles.hero}>
        <h1>
          Persediaan UPKK.
          <br />
          Belajar Lebih Terarah.
        </h1>
        <p>
          Pilih Kuiz UPKK interaktif, Nota UPKK lengkap atau terokai permainan
          pendidikan PandaiKids.
        </p>
        <span className={styles.heroLine} aria-hidden="true" />
      </section>

      <section className={styles.cards} aria-label="Pilihan PandaiKids">
        <article className={`${styles.card} ${styles.quizCard}`}>
          <div className={styles.quizOverlay} aria-hidden="true" />
          <div className={styles.quizCopy}>
            <span className={`${styles.badge} ${styles.quizBadge}`}>
              ★ Kuiz UPKK
            </span>
            <p className={styles.kicker}>Kuiz Interaktif</p>
            <h2>Latihan UPKK bersama Pandi</h2>
            <p className={styles.description}>
              Cuba soalan percuma untuk Aqidah, Ibadah, Sirah dan Adab. Naik taraf
              ke Premium untuk lebih banyak latihan dan akses selama 1 tahun.
            </p>
            <Link className={styles.quizButton} href="/kuiz/">
              Mula Kuiz UPKK <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>

        <article className={`${styles.card} ${styles.notesCard}`}>
          <div className={styles.notesCopy}>
            <span className={`${styles.badge} ${styles.primaryBadge}`}>
              Nota UPKK
            </span>

            <p className={styles.kicker}>Nota Kilat UPKK</p>
            <h2>Untuk Tahun 3, 4 dan 5</h2>
            <p className={styles.description}>
              Nota PDF berwarna, Nota Kilat, Uji Minda dan Skema Jawapan untuk
              4 subjek teras.
            </p>

            <div className={styles.subjects} aria-label="Empat subjek teras">
              <span>Aqidah</span>
              <span>Ibadah</span>
              <span>Sirah</span>
              <span>Adab</span>
            </div>

            <Link className={styles.primaryButton} href="/nota-kilat-4-subjek/">
              Lihat Nota UPKK <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className={styles.pandiVisual}>
            <Image
              src={pandiReadingSrc}
              alt="Pandi membaca Nota Kilat di atas sofa hijau"
              width={900}
              height={900}
              sizes="(max-width: 760px) 84vw, 30vw"
              priority
            />
          </div>
        </article>

        <article
          className={`${styles.card} ${styles.gameCard}`}
          aria-label="Game Pendidikan sedang dalam penyelenggaraan"
        >
          <Image
            className={styles.gameBackground}
            src={gameBgSrc}
            alt=""
            fill
            sizes="(max-width: 920px) 100vw, 30vw"
            aria-hidden="true"
          />
          <div className={styles.gameOverlay} aria-hidden="true" />

          <div className={styles.gameCopy}>
            <span className={`${styles.badge} ${styles.maintenanceBadge}`}>
              ⚒ Dalam penyelenggaraan
            </span>

            <p className={styles.kicker}>Game Pendidikan</p>
            <h2>Sedang ditambah baik</h2>
            <p className={styles.description}>
              Pengalaman pembelajaran digital yang lebih menarik dan
              menyeronokkan sedang disediakan.
            </p>

            <button className={styles.disabledButton} type="button" disabled>
              🔒 Akan Datang
            </button>
          </div>

          <Image
            className={styles.controller}
            src={controllerSrc}
            alt=""
            width={900}
            height={900}
            sizes="220px"
            aria-hidden="true"
          />
        </article>
      </section>

      <section className={styles.features} aria-label="Kelebihan PandaiKids">
        <div><b>Kuiz Interaktif</b><span>Latihan 4 subjek</span></div>
        <div><b>Nota Ringkas</b><span>Mudah difahami</span></div>
        <div><b>Uji Minda</b><span>Uji kefahaman</span></div>
        <div><b>Akses Fleksibel</b><span>Belajar di mana-mana</span></div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} PandaiKids</p>
        <p>Belajar dengan ceria, melangkah dengan yakin.</p>
      </footer>
    </main>
  );
}
