"use client";

import Image from "next/image";
import { useState } from "react";
import { type SubjectKey } from "../data";
import styles from "./Hero.module.css";
import HeroTablet from "./HeroTablet";

const SUBJECT_PREVIEWS: Record<SubjectKey, string[]> = {
  aqidah: [
    "/pandaikids/nota-kilat-v2/tahun-4/aqidah/1 Cover.webp",
    "/pandaikids/nota-kilat-v2/tahun-4/aqidah/1.webp",
    "/pandaikids/nota-kilat-v2/tahun-4/aqidah/14 nota.webp",
    "/pandaikids/nota-kilat-v2/tahun-4/aqidah/17 kuiz.webp",
  ],
  ibadah: [
    "/pandaikids/nota-kilat-v2/tahun-4/ibadah/1 Cover.webp",
    "/pandaikids/nota-kilat-v2/tahun-4/ibadah/1.webp",
    "/pandaikids/nota-kilat-v2/tahun-4/ibadah/28 nota.webp",
    "/pandaikids/nota-kilat-v2/tahun-4/ibadah/34 kuiz.webp",
  ],
  sirah: [
    "/pandaikids/nota-kilat-v2/tahun-4/sirah/1 Cover.webp",
    "/pandaikids/nota-kilat-v2/tahun-4/sirah/1.webp",
    "/pandaikids/nota-kilat-v2/tahun-4/sirah/47 nota.webp",
    "/pandaikids/nota-kilat-v2/tahun-4/sirah/53 kuiz.webp",
  ],
  adab: [
    "/pandaikids/nota-kilat-v2/tahun-4/adab/1 Cover.webp",
    "/pandaikids/nota-kilat-v2/tahun-4/adab/1.webp",
    "/pandaikids/nota-kilat-v2/tahun-4/adab/28 nota.webp",
    "/pandaikids/nota-kilat-v2/tahun-4/adab/34 quiz.webp",
  ],
};

const SLIDE_LABELS = [
  "Cover Modul",
  "Nota Digital",
  "Nota Kilat",
  "Uji Minda",
];

const SUBJECT_OPTIONS = [
  { key: "aqidah", label: "Aqidah", icon: "✦" },
  { key: "ibadah", label: "Ibadah", icon: "◆" },
  { key: "sirah", label: "Sirah", icon: "▤" },
  { key: "adab", label: "Adab", icon: "▣" },
] as const;

export default function Hero() {
  const [activeSubject, setActiveSubject] =
    useState<SubjectKey>("aqidah");

  const slides = SUBJECT_PREVIEWS[activeSubject].map((src, index) => ({
    src,
    label: SLIDE_LABELS[index],
  }));

  return (
    <section className={styles.hero} id="utama">
      <div className={styles.auroraOne} aria-hidden="true" />
      <div className={styles.auroraTwo} aria-hidden="true" />

      <div className={styles.shell}>
        <header className={styles.header}>
          <a
            href="#utama"
            className={styles.logoLink}
            aria-label="PandaiKids"
          >
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
            <a href="#smart-preview">Lihat kandungan</a>
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
              NOTA DIGITAL KAFA &amp; UPKK • TAHUN 3, 4 &amp; 5
            </p>

            <h1>
              Ujian KAFA dah
              <span> makin dekat?</span>
              <br />
              Anak masih <strong>susah faham?</strong>
            </h1>

            <p className={styles.lead}>
              Kadang-kadang bukan sebab anak malas. Nota yang terlalu panjang,
              padat dan sukar dibaca boleh membuatkan anak cepat bosan serta
              hilang keyakinan semasa mengulang kaji.
            </p>

            <p className={styles.solutionLine}>
              Sebab itu PandaiKids menyusun isi penting menjadi nota digital
              yang lebih ringkas, berwarna dan mudah diikuti.
            </p>

            <div className={styles.mobileProduct}>
              <SubjectSelector
                activeSubject={activeSubject}
                onChange={setActiveSubject}
                mobile
              />

              <HeroTablet
                year={4}
                activeSubject={activeSubject}
                onSubjectChange={setActiveSubject}
                slides={slides}
                mobile
              />
            </div>

            <div className={styles.benefits}>
              <span>Nota ringkas</span>
              <span>Mudah dibaca</span>
              <span>KAFA &amp; UPKK</span>
              <span>Boleh dicetak</span>
            </div>

            <div className={styles.actions}>
              <a href="#smart-preview" className={styles.primary}>
                Lihat contoh sebenar <b>→</b>
              </a>

              <a href="#pakej" className={styles.secondary}>
                Pilih pakej
              </a>
            </div>

            <p className={styles.micro}>
              Contoh sebenar Tahun 4 · Muat turun digital · Bayaran sekali
              sahaja
            </p>
          </div>

          <div className={styles.product}>
            <div className={styles.productIntro}>
              <span>CUBA PRODUK SEBELUM MEMBELI</span>
              <strong>Swipe pada iPad untuk melihat halaman</strong>
            </div>

            <SubjectSelector
              activeSubject={activeSubject}
              onChange={setActiveSubject}
            />

            <HeroTablet
              year={4}
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

function SubjectSelector({
  activeSubject,
  onChange,
  mobile = false,
}: {
  activeSubject: SubjectKey;
  onChange: (subject: SubjectKey) => void;
  mobile?: boolean;
}) {
  return (
    <div
      className={`${styles.subjectSelectorWrap} ${
        mobile ? styles.subjectSelectorMobile : ""
      }`}
    >
      <span className={styles.subjectSelectorLabel}>PILIH SUBJEK</span>

      <div className={styles.subjectSelector}>
        {SUBJECT_OPTIONS.map((subject) => (
          <button
            key={subject.key}
            type="button"
            className={
              activeSubject === subject.key
                ? styles.subjectSelectorActive
                : ""
            }
            onClick={() => onChange(subject.key)}
            aria-pressed={activeSubject === subject.key}
          >
            <span className={styles.subjectSelectorIcon}>
              {subject.icon}
            </span>

            <span className={styles.subjectSelectorText}>
              <strong>{subject.label}</strong>
              <small>Contoh Tahun 4</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}