"use client";

import Image from "next/image";
import { useState } from "react";
import { coverPath, subjects, type SchoolYear } from "../data";
import styles from "./Hero.module.css";

const years: SchoolYear[] = [3, 4, 5];

export default function Hero() {
  const [selectedYear, setSelectedYear] = useState<SchoolYear>(4);

  return (
    <section className={styles.hero} id="utama">
      <div className={styles.auroraOne} aria-hidden="true" />
      <div className={styles.auroraTwo} aria-hidden="true" />
      <div className={styles.sparkles} aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>

      <div className={styles.shell}>
        <header className={styles.header}>
          <a href="#utama" className={styles.logoLink} aria-label="PandaiKids">
            <Image
              src="/pandaikids/nota-kilat-v3/logo.webp"
              width={1100}
              height={233}
              alt="PandaiKids"
              priority
              className={styles.logo}
            />
          </a>

          <nav className={styles.nav} aria-label="Navigasi utama">
            <a href="#subjek">Koleksi</a>
            <a href="#contoh">Contoh halaman</a>
            <a href="#pakej">Pakej</a>
            <a href="#faq">FAQ</a>
          </nav>

          <a href="#pakej" className={styles.headerButton}>Beli sekarang</a>
        </header>

        <div className={styles.content}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>NOTA KILAT KAFA &amp; UPKK</p>
            <h1>
              Belajar lebih <span>mudah.</span>
              <br />
              Faham lebih <strong>cepat.</strong>
            </h1>
            <p className={styles.lead}>
              Empat subjek teras yang ringkas, visual dan tersusun untuk membantu anak ulang kaji dengan lebih yakin.
            </p>

            <div className={styles.mobileProduct}>
              <YearTabs value={selectedYear} onChange={setSelectedYear} />
              <BookStage year={selectedYear} mobile />
            </div>

            <div className={styles.benefits}>
              <span>Nota ringkas</span>
              <span>Mudah diingat</span>
              <span>Fokus UPKK</span>
              <span>Uji Minda</span>
            </div>

            <div className={styles.actions}>
              <a href="#pakej" className={styles.primary}>Pilih pakej <b>→</b></a>
              <a href="#contoh" className={styles.secondary}>Lihat contoh halaman</a>
            </div>

            <p className={styles.micro}>Muat turun serta-merta · Boleh dicetak · Bayaran sekali sahaja</p>
          </div>

          <div className={styles.product}>
            <div className={styles.productTop}>
              <div>
                <span>Koleksi PandaiKids</span>
                <strong>4 Buku Teras</strong>
              </div>
              <YearTabs value={selectedYear} onChange={setSelectedYear} />
            </div>

            <BookStage year={selectedYear} />

            <p className={styles.caption}>
              Pakej Tahun {selectedYear} · Aqidah, Ibadah, Sirah &amp; Adab · <del>RM19</del> <strong>RM12.90</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function YearTabs({ value, onChange }: { value: SchoolYear; onChange: (year: SchoolYear) => void }) {
  return (
    <div className={styles.yearTabs} aria-label="Pilih tahun">
      {years.map((year) => (
        <button
          type="button"
          key={year}
          onClick={() => onChange(year)}
          className={value === year ? styles.yearActive : ""}
          aria-pressed={value === year}
        >
          Tahun {year}
        </button>
      ))}
    </div>
  );
}

function BookStage({ year, mobile = false }: { year: SchoolYear; mobile?: boolean }) {
  return (
    <div className={`${styles.stage} ${mobile ? styles.stageMobile : ""}`}>
      <div className={styles.halo} aria-hidden="true" />
      <div className={styles.platform} aria-hidden="true" />

      {subjects.map((subject, index) => (
        <div key={subject.key} className={`${styles.book} ${styles[`book${index + 1}`]}`}>
          <Image
            src={coverPath(year, subject.key)}
            alt={`Buku ${subject.name} Tahun ${year}`}
            width={760}
            height={1140}
            priority
            sizes={mobile ? "43vw" : "(max-width: 1180px) 230px, 290px"}
          />
        </div>
      ))}

      <div className={styles.pandi}>
        <span className={styles.bubble}>Jom belajar bersama Pandi!</span>
        <Image
          src="/pandaikids/nota-kilat-v3/mascot/pandi-wave.webp"
          width={760}
          height={760}
          alt="Pandi melambai"
          priority
          sizes={mobile ? "30vw" : "235px"}
        />
      </div>
    </div>
  );
}
