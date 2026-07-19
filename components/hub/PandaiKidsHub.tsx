import Image from "next/image";
import Link from "next/link";

import { withBasePath } from "@/lib/paths";

import styles from "./PandaiKidsHub.module.css";

const logoSrc = withBasePath("/pandaikids/nota-kilat-v3/logo.webp");
const pandiReadingSrc = withBasePath("/assets/pandi/pandi-reading.png");

export function PandaiKidsHub() {
  return (
    <main className={styles.page}>
      <div className={styles.sunGlow} aria-hidden="true" />
      <div className={styles.moon} aria-hidden="true">
        <span>★</span>
      </div>

      <div className={styles.leavesTop} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

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
          Belajar dengan lebih mudah,
          <br />
          dalam satu dunia.
        </h1>

        <p>
          Dapatkan bahan ulang kaji Pendidikan Islam yang ringkas,
          <br className={styles.desktopBreak} />
          tersusun dan mudah digunakan bersama anak.
        </p>

        <span className={styles.heroLine} aria-hidden="true" />
      </section>

      <section className={styles.cards} aria-label="Pilihan PandaiKids">
        <article className={`${styles.card} ${styles.notesCard}`}>
          <div className={styles.notesContent}>
            <span className={`${styles.badge} ${styles.primaryBadge}`}>
              ★ Pilihan utama sekarang
            </span>

            <h2>Nota Kilat UPKK</h2>
            <h3>Untuk Tahun 3, 4 dan 5</h3>

            <p>
              Nota PDF berwarna, Nota Kilat,
              <br />
              Uji Minda dan Skema Jawapan
              <br />
              untuk 4 subjek teras.
            </p>

            <div className={styles.subjects}>
              <div>
                <span className={styles.subjectIcon}>☪</span>
                <small>Aqidah</small>
              </div>

              <div>
                <span className={styles.subjectIcon}>◉</span>
                <small>Ibadah</small>
              </div>

              <div>
                <span className={styles.subjectIcon}>✦</span>
                <small>Sirah</small>
              </div>

              <div>
                <span className={styles.subjectIcon}>♥</span>
                <small>Adab</small>
              </div>
            </div>

            <Link
              className={styles.primaryButton}
              href="/nota-kilat-4-subjek/"
            >
              Mula Ulang Kaji
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className={styles.pandiReading}>
            <div className={styles.roomDecor} aria-hidden="true">
              <span className={styles.shelf} />
              <span className={styles.bookOne} />
              <span className={styles.bookTwo} />
              <span className={styles.bookThree} />
              <span className={styles.lamp} />
            </div>

            <Image
              src={pandiReadingSrc}
              alt="Pandi sedang membaca"
              width={1254}
              height={1254}
              sizes="(max-width: 720px) 75vw, 32vw"
              priority
            />
          </div>
        </article>

        <article
          className={`${styles.card} ${styles.gameCard}`}
          aria-label="Game Pendidikan sedang dalam penyelenggaraan"
        >
          <div className={styles.gameContent}>
            <span className={`${styles.badge} ${styles.maintenanceBadge}`}>
              ⚒ Dalam penyelenggaraan
            </span>

            <h2>Game Pendidikan</h2>
            <h3>Sedang Dalam Penyelenggaraan</h3>

            <p>
              Kami sedang menambah baik pengalaman pembelajaran digital
              untuk anak-anak agar lebih menarik dan menyeronokkan.
            </p>

            <button
              className={styles.disabledButton}
              type="button"
              disabled
              aria-disabled="true"
            >
              <span aria-hidden="true">🔒</span>
              Akan Datang
            </button>
          </div>

          <div className={styles.gameIllustration} aria-hidden="true">
            <div className={styles.controller}>
              <span className={styles.dpad}>✚</span>
              <span className={styles.buttonA} />
              <span className={styles.buttonB} />
              <span className={styles.stickOne} />
              <span className={styles.stickTwo} />
            </div>

            <div className={styles.mosque}>
              <span className={styles.minaretLeft} />
              <span className={styles.dome} />
              <span className={styles.minaretRight} />
            </div>
          </div>
        </article>
      </section>

      <section className={styles.features} aria-label="Kelebihan PandaiKids">
        <div>
          <span className={`${styles.featureIcon} ${styles.greenIcon}`}>▣</span>
          <p>
            <strong>Nota Ringkas</strong>
            <small>Mudah Faham</small>
          </p>
        </div>

        <div>
          <span className={`${styles.featureIcon} ${styles.blueIcon}`}>✓</span>
          <p>
            <strong>Uji Minda</strong>
            <small>Berfokus UPKK</small>
          </p>
        </div>

        <div>
          <span className={`${styles.featureIcon} ${styles.purpleIcon}`}>▤</span>
          <p>
            <strong>Skema Jawapan</strong>
            <small>Lengkap & Tepat</small>
          </p>
        </div>

        <div>
          <span className={`${styles.featureIcon} ${styles.orangeIcon}`}>↓</span>
          <p>
            <strong>Muat Turun</strong>
            <small>Selepas Pembayaran</small>
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} PandaiKids. Hak Cipta Terpelihara.</p>
        <span aria-hidden="true">|</span>
        <p>Ulang Kaji Ringkas. Ingatan Lebih Lekat.</p>
      </footer>
    </main>
  );
}