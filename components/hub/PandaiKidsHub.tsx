import Image from "next/image";
import Link from "next/link";

import { withBasePath } from "@/lib/paths";

import styles from "./PandaiKidsHub.module.css";

const logoSrc = withBasePath("/pandaikids/nota-kilat-v3/logo.webp");
const bundleSrc = withBasePath("/pandaikids/nota-kilat-v3/products/bundle.webp");
const pandiSrc = withBasePath("/assets/pandi/pandi-official-wave.png");

export function PandaiKidsHub() {
  return (
    <main className={styles.page}>
      <div className={styles.glowOne} aria-hidden="true" />
      <div className={styles.glowTwo} aria-hidden="true" />

      <header className={styles.header}>
        <Image
          className={styles.logo}
          src={logoSrc}
          alt="PandaiKids"
          width={760}
          height={220}
          priority
        />

        <span className={styles.headerNote}>
          Belajar Islam • Faham • Amal
        </span>
      </header>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Selamat datang ke PandaiKids</p>

        <h1>Belajar dengan lebih mudah, dalam satu dunia.</h1>

        <p className={styles.lead}>
          Dapatkan bahan ulang kaji Pendidikan Islam yang ringkas, tersusun
          dan mudah digunakan bersama anak.
        </p>
      </section>

      <section className={styles.cards} aria-label="Pilihan PandaiKids">
        <article className={`${styles.card} ${styles.notesCard}`}>
          <div className={styles.cardCopy}>
            <span className={styles.badge}>Pilihan utama sekarang</span>

            <p className={styles.cardKicker}>Nota Kilat UPKK</p>

            <h2>Ulang kaji ringkas untuk Tahun 3, 4 dan 5.</h2>

            <p>
              Nota PDF berwarna, Nota Kilat, Uji Minda dan Skema Jawapan
              untuk 4 subjek teras.
            </p>

            <div className={styles.chips}>
              <span>Aqidah</span>
              <span>Ibadah</span>
              <span>Sirah</span>
              <span>Adab</span>
            </div>

            <Link
              className={styles.primaryButton}
              href="/nota-kilat-4-subjek/"
            >
              Mula Ulang Kaji <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className={styles.productVisual}>
            <Image
              src={bundleSrc}
              alt="Bundle Nota Kilat PandaiKids Tahun 3, 4 dan 5"
              width={1100}
              height={1100}
              sizes="(max-width: 760px) 88vw, 42vw"
              priority
            />
          </div>
        </article>

        <article
          className={`${styles.card} ${styles.gameCard}`}
          aria-label="Game Pendidikan sedang dalam penyelenggaraan"
        >
          <div className={styles.cardCopy}>
            <span className={`${styles.badge} ${styles.betaBadge}`}>
              Dalam penyelenggaraan
            </span>

            <p className={styles.cardKicker}>Game Pendidikan</p>

            <h2>Pengembaraan pembelajaran bersama Pandi.</h2>

            <p>
              Game PandaiKids sedang ditambah baik untuk memberikan
              pengalaman pembelajaran yang lebih menarik dan menyeronokkan.
            </p>

            <button
              className={styles.secondaryButton}
              type="button"
              disabled
              aria-disabled="true"
            >
              Akan Datang
            </button>
          </div>

          <div className={styles.pandiVisual}>
            <span className={styles.betaLabel}>
              Sedang dalam penyelenggaraan
            </span>

            <Image
              src={pandiSrc}
              alt="Pandi melambai"
              width={1254}
              height={1254}
              sizes="(max-width: 760px) 66vw, 32vw"
            />
          </div>
        </article>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} PandaiKids</p>
        <p>Ulang Kaji Ringkas. Ingatan Lebih Lekat.</p>
      </footer>
    </main>
  );
}