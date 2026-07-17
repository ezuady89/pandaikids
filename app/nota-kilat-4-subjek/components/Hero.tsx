"use client";

import Image from "next/image";
import { useState } from "react";
import { type SchoolYear, type SubjectKey } from "../data";
import styles from "./Hero.module.css";
import HeroTablet from "./HeroTablet";

const years: SchoolYear[] = [3, 4, 5];

const SUBJECT_PREVIEWS: Record<SubjectKey, string[]> = {
  aqidah: [
    "/pandaikids/nota-kilat-v3/previews/aqidah-1.webp",
    "/pandaikids/nota-kilat-v3/previews/aqidah-2.webp",
    "/pandaikids/nota-kilat-v3/previews/aqidah-3.webp",
    "/pandaikids/nota-kilat-v3/previews/aqidah-4.webp",
  ],
  ibadah: [
    "/pandaikids/nota-kilat-v3/previews/ibadah-1.webp",
    "/pandaikids/nota-kilat-v3/previews/ibadah-2.webp",
    "/pandaikids/nota-kilat-v3/previews/ibadah-3.webp",
    "/pandaikids/nota-kilat-v3/previews/ibadah-4.webp",
  ],
  sirah: [
    "/pandaikids/nota-kilat-v3/previews/sirah-1.webp",
    "/pandaikids/nota-kilat-v3/previews/sirah-2.webp",
    "/pandaikids/nota-kilat-v3/previews/sirah-3.webp",
    "/pandaikids/nota-kilat-v3/previews/sirah-4.webp",
  ],
  adab: [
    "/pandaikids/nota-kilat-v3/previews/adab-1.webp",
    "/pandaikids/nota-kilat-v3/previews/adab-2.webp",
    "/pandaikids/nota-kilat-v3/previews/adab-3.webp",
    "/pandaikids/nota-kilat-v3/previews/adab-4.webp",
  ],
};

export default function Hero() {
  const [selectedYear, setSelectedYear] = useState<SchoolYear>(4);
  const [activeSubject, setActiveSubject] =
    useState<SubjectKey>("aqidah");

  const slides = SUBJECT_PREVIEWS[activeSubject].map((src, index) => ({
    src,
    label: `Halaman ${index + 1}`,
  }));

  return (
    <section className={styles.hero} id="utama">
      <div className={styles.auroraOne} aria-hidden="true" />
      <div className={styles.auroraTwo} aria-hidden="true" />

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

          <a href="#pakej" className={styles.headerButton}>
            Beli sekarang
          </a>
        </header>

        <div className={styles.content}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              NOTA DIGITAL KAFA &amp; UPKK
            </p>

            <h1>
              Belajar lebih <span>mudah.</span>
              <br />
              Faham lebih <strong>cepat.</strong>
            </h1>

            <p className={styles.lead}>
              Empat subjek teras yang ringkas, visual dan tersusun untuk
              membantu anak ulang kaji dengan lebih yakin.
            </p>

            <div className={styles.mobileProduct}>
              <YearTabs value={selectedYear} onChange={setSelectedYear} />

              <HeroTablet
                year={selectedYear}
                activeSubject={activeSubject}
                onSubjectChange={setActiveSubject}
                slides={slides}
                mobile
              />
            </div>

            <div className={styles.benefits}>
              <span>Nota ringkas</span>
              <span>Mudah diingat</span>
              <span>Fokus UPKK</span>
              <span>Boleh dicetak</span>
            </div>

            <div className={styles.actions}>
              <a href="#pakej" className={styles.primary}>
                Pilih pakej <b>→</b>
              </a>

              <a href="#contoh" className={styles.secondary}>
                Lihat contoh halaman
              </a>
            </div>

            <p className={styles.micro}>
              Muat turun serta-merta · Boleh dicetak · Bayaran sekali sahaja
            </p>
          </div>

          <div className={styles.product}>
            <div className={styles.productTop}>
              <div>
                <span>Pratonton Produk Digital</span>
                <strong>Klik cover untuk lihat subjek</strong>
              </div>

              <YearTabs value={selectedYear} onChange={setSelectedYear} />
            </div>

            <HeroTablet
              year={selectedYear}
              activeSubject={activeSubject}
              onSubjectChange={setActiveSubject}
              slides={slides}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function YearTabs({
  value,
  onChange,
}: {
  value: SchoolYear;
  onChange: (year: SchoolYear) => void;
}) {
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
