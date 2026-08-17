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
      <Image className={styles.pageBackground} src={homeBgSrc} alt="" fill priority sizes="100vw" aria-hidden="true" />
      <div className={styles.pageWash} aria-hidden="true" />

      <div className={styles.shell}>
        <header className={styles.header}>
          <Image className={styles.logo} src={logoSrc} alt="PandaiKids" width={760} height={220} priority />
          <p>Belajar Islam • Faham • Amal</p>
        </header>

        <section className={styles.hero}>
          <span className={styles.eyebrow}>Persediaan UPKK Tahun 3, 4 & 5</span>
          <h1>Belajar UPKK Lebih Mudah, Menarik & Terarah.</h1>
          <p>Kuiz interaktif, nota berilustrasi dan aktiviti pembelajaran untuk membantu anak belajar dengan lebih yakin.</p>
        </section>

        <section className={styles.cards} aria-label="Pilihan utama PandaiKids">
          <article className={`${styles.card} ${styles.quizCard}`}>
            <div className={styles.quizOverlay} aria-hidden="true" />
            <div className={styles.cardCopy}>
              <span className={`${styles.badge} ${styles.quizBadge}`}>Cuba Percuma · 10 Soalan</span>
              <p className={styles.kicker}>Kuiz UPKK</p>
              <h2>Latihan UPKK bersama Pandi</h2>
              <p className={styles.description}>Jawab soalan Aqidah, Ibadah, Sirah dan Adab. Mulakan percuma dahulu.</p>
              <Link className={`${styles.button} ${styles.quizButton}`} href="/kuiz/">Mula Kuiz Percuma <span aria-hidden="true">→</span></Link>
            </div>
          </article>

          <article className={`${styles.card} ${styles.notesCard}`}>
            <div className={styles.cardCopy}>
              <span className={`${styles.badge} ${styles.notesBadge}`}>Nota UPKK</span>
              <p className={styles.kicker}>Nota Tahun 3, 4 & 5</p>
              <h2>Ringkas, berwarna & mudah faham</h2>
              <p className={styles.description}>Nota berilustrasi, Nota Kilat, Uji Minda dan Skema Jawapan untuk 4 subjek teras.</p>
              <div className={styles.subjects} aria-label="Empat subjek teras">
                <span>Aqidah</span><span>Ibadah</span><span>Sirah</span><span>Adab</span>
              </div>
              <Link className={`${styles.button} ${styles.notesButton}`} href="/nota-kilat-4-subjek/">Lihat Nota UPKK <span aria-hidden="true">→</span></Link>
            </div>
            <Image className={styles.pandiVisual} src={pandiReadingSrc} alt="Pandi membaca nota" width={900} height={900} sizes="(max-width: 760px) 42vw, 20vw" priority />
          </article>

          <article className={`${styles.card} ${styles.gameCard}`} aria-label="Game Pendidikan akan datang">
            <Image className={styles.gameBackground} src={gameBgSrc} alt="" fill sizes="(max-width: 920px) 100vw, 30vw" aria-hidden="true" />
            <div className={styles.gameOverlay} aria-hidden="true" />
            <div className={styles.cardCopy}>
              <span className={`${styles.badge} ${styles.gameBadge}`}>Akan Datang</span>
              <p className={styles.kicker}>Game Pendidikan</p>
              <h2>Belajar sambil bermain</h2>
              <p className={styles.description}>Pengalaman pembelajaran digital yang lebih interaktif sedang disediakan.</p>
              <button className={`${styles.button} ${styles.disabledButton}`} type="button" disabled>Dalam Pembinaan</button>
            </div>
            <Image className={styles.controller} src={controllerSrc} alt="" width={900} height={900} sizes="160px" aria-hidden="true" />
          </article>
        </section>

        <section className={styles.features} aria-label="Kelebihan PandaiKids">
          <span>✓ Kuiz Interaktif</span>
          <span>✓ Nota Mudah Faham</span>
          <span>✓ 4 Subjek Teras</span>
          <span>✓ Belajar Di Mana-Mana</span>
        </section>

        <section className={styles.startHere}>
          <div><span>Tak pasti nak mula dari mana?</span><b>Cuba kuiz percuma dahulu.</b></div>
          <Link href="/kuiz/">Cuba Sekarang →</Link>
        </section>

        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} PandaiKids</p>
          <p>Belajar dengan ceria, melangkah dengan yakin.</p>
        </footer>
      </div>
    </main>
  );
}
