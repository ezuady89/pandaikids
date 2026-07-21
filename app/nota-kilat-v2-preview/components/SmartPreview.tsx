"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import styles from "./SmartPreview.module.css";

type SubjectKey = "aqidah" | "ibadah" | "sirah" | "adab";

type PreviewPage = {
  src: string;
  label: string;
  category: "Cover" | "Pengenalan" | "Nota Digital" | "Nota Kilat" | "Uji Minda" | "Skema";
};

type SubjectConfig = {
  key: SubjectKey;
  name: string;
  accent: string;
  pages: PreviewPage[];
};

const BASE_PATH = "/pandaikids/nota-kilat-v2/tahun-4";

const SUBJECTS: SubjectConfig[] = [
  {
    key: "aqidah",
    name: "Aqidah",
    accent: "#22a447",
    pages: [
      { src: `${BASE_PATH}/aqidah/1 Cover.webp`, label: "Cover Aqidah", category: "Cover" },
      { src: `${BASE_PATH}/aqidah/1 pesanan.webp`, label: "Pesanan PandaiKids", category: "Pengenalan" },
      { src: `${BASE_PATH}/aqidah/1.webp`, label: "Nota Digital 1", category: "Nota Digital" },
      { src: `${BASE_PATH}/aqidah/2.webp`, label: "Nota Digital 2", category: "Nota Digital" },
      { src: `${BASE_PATH}/aqidah/3.webp`, label: "Nota Digital 3", category: "Nota Digital" },
      { src: `${BASE_PATH}/aqidah/4.webp`, label: "Nota Digital 4", category: "Nota Digital" },
      { src: `${BASE_PATH}/aqidah/5.webp`, label: "Nota Digital 5", category: "Nota Digital" },
      { src: `${BASE_PATH}/aqidah/14 nota.webp`, label: "Nota Kilat 1", category: "Nota Kilat" },
      { src: `${BASE_PATH}/aqidah/15 nota.webp`, label: "Nota Kilat 2", category: "Nota Kilat" },
      { src: `${BASE_PATH}/aqidah/17 kuiz.webp`, label: "Uji Minda 1", category: "Uji Minda" },
      { src: `${BASE_PATH}/aqidah/18 kuiz.webp`, label: "Uji Minda 2", category: "Uji Minda" },
      { src: `${BASE_PATH}/aqidah/21 skema.webp`, label: "Skema Jawapan", category: "Skema" },
    ],
  },
  {
    key: "ibadah",
    name: "Ibadah",
    accent: "#2789e8",
    pages: [
      { src: `${BASE_PATH}/ibadah/1 Cover.webp`, label: "Cover Ibadah", category: "Cover" },
      { src: `${BASE_PATH}/ibadah/1 pesanan.webp`, label: "Pesanan PandaiKids", category: "Pengenalan" },
      { src: `${BASE_PATH}/ibadah/1.webp`, label: "Nota Digital 1", category: "Nota Digital" },
      { src: `${BASE_PATH}/ibadah/2.webp`, label: "Nota Digital 2", category: "Nota Digital" },
      { src: `${BASE_PATH}/ibadah/3.webp`, label: "Nota Digital 3", category: "Nota Digital" },
      { src: `${BASE_PATH}/ibadah/4.webp`, label: "Nota Digital 4", category: "Nota Digital" },
      { src: `${BASE_PATH}/ibadah/5.webp`, label: "Nota Digital 5", category: "Nota Digital" },
      { src: `${BASE_PATH}/ibadah/28 nota.webp`, label: "Nota Kilat 1", category: "Nota Kilat" },
      { src: `${BASE_PATH}/ibadah/29 nota.webp`, label: "Nota Kilat 2", category: "Nota Kilat" },
      { src: `${BASE_PATH}/ibadah/34 kuiz.webp`, label: "Uji Minda 1", category: "Uji Minda" },
      { src: `${BASE_PATH}/ibadah/35 kuiz.webp`, label: "Uji Minda 2", category: "Uji Minda" },
      { src: `${BASE_PATH}/ibadah/39 skema.webp`, label: "Skema Jawapan", category: "Skema" },
    ],
  },
  {
    key: "sirah",
    name: "Sirah",
    accent: "#7e46d8",
    pages: [
      { src: `${BASE_PATH}/sirah/1 Cover.webp`, label: "Cover Sirah", category: "Cover" },
      { src: `${BASE_PATH}/sirah/1 pesanan.webp`, label: "Pesanan PandaiKids", category: "Pengenalan" },
      { src: `${BASE_PATH}/sirah/1.webp`, label: "Nota Digital 1", category: "Nota Digital" },
      { src: `${BASE_PATH}/sirah/2.webp`, label: "Nota Digital 2", category: "Nota Digital" },
      { src: `${BASE_PATH}/sirah/3.webp`, label: "Nota Digital 3", category: "Nota Digital" },
      { src: `${BASE_PATH}/sirah/4.webp`, label: "Nota Digital 4", category: "Nota Digital" },
      { src: `${BASE_PATH}/sirah/5.webp`, label: "Nota Digital 5", category: "Nota Digital" },
      { src: `${BASE_PATH}/sirah/47 nota.webp`, label: "Nota Kilat 1", category: "Nota Kilat" },
      { src: `${BASE_PATH}/sirah/48 nota.webp`, label: "Nota Kilat 2", category: "Nota Kilat" },
      { src: `${BASE_PATH}/sirah/53 kuiz.webp`, label: "Uji Minda 1", category: "Uji Minda" },
      { src: `${BASE_PATH}/sirah/54 kuiz.webp`, label: "Uji Minda 2", category: "Uji Minda" },
      { src: `${BASE_PATH}/sirah/58 skema.webp`, label: "Skema Jawapan", category: "Skema" },
    ],
  },
  {
    key: "adab",
    name: "Adab",
    accent: "#f28a24",
    pages: [
      { src: `${BASE_PATH}/adab/1 Cover.webp`, label: "Cover Adab", category: "Cover" },
      { src: `${BASE_PATH}/adab/1 pesanan.webp`, label: "Pesanan PandaiKids", category: "Pengenalan" },
      { src: `${BASE_PATH}/adab/1.webp`, label: "Nota Digital 1", category: "Nota Digital" },
      { src: `${BASE_PATH}/adab/2.webp`, label: "Nota Digital 2", category: "Nota Digital" },
      { src: `${BASE_PATH}/adab/3.webp`, label: "Nota Digital 3", category: "Nota Digital" },
      { src: `${BASE_PATH}/adab/4.webp`, label: "Nota Digital 4", category: "Nota Digital" },
      { src: `${BASE_PATH}/adab/5.webp`, label: "Nota Digital 5", category: "Nota Digital" },
      { src: `${BASE_PATH}/adab/28 nota.webp`, label: "Nota Kilat 1", category: "Nota Kilat" },
      { src: `${BASE_PATH}/adab/29 nota.webp`, label: "Nota Kilat 2", category: "Nota Kilat" },
      { src: `${BASE_PATH}/adab/34 quiz.webp`, label: "Uji Minda 1", category: "Uji Minda" },
      { src: `${BASE_PATH}/adab/35 quiz.webp`, label: "Uji Minda 2", category: "Uji Minda" },
      { src: `${BASE_PATH}/adab/40.webp`, label: "Skema Jawapan", category: "Skema" },
    ],
  },
];

export default function SmartPreview() {
  const [activeSubject, setActiveSubject] = useState<SubjectKey>("aqidah");
  const [activePage, setActivePage] = useState(0);

  const subject = useMemo(
    () => SUBJECTS.find((item) => item.key === activeSubject) ?? SUBJECTS[0],
    [activeSubject],
  );

  const currentPage = subject.pages[activePage];

  function changeSubject(key: SubjectKey) {
    setActiveSubject(key);
    setActivePage(0);
  }

  function showPrevious() {
    setActivePage((current) =>
      current === 0 ? subject.pages.length - 1 : current - 1,
    );
  }

  function showNext() {
    setActivePage((current) =>
      current === subject.pages.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <section
      className={styles.section}
      id="smart-preview"
      style={{ "--subject-accent": subject.accent } as React.CSSProperties}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>CONTOH SEBENAR TAHUN 4</p>

          <h2>Selak kandungan sebenar sebelum membeli.</h2>

          <p>
            Lihat sendiri cover, nota digital berwarna, Nota Kilat, Uji Minda
            dan Skema Jawapan yang diterima dalam satu pakej PandaiKids.
          </p>
        </header>

        <div className={styles.subjectTabs} aria-label="Pilih subjek">
          {SUBJECTS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={
                activeSubject === item.key ? styles.subjectActive : undefined
              }
              style={{ "--button-accent": item.accent } as React.CSSProperties}
              onClick={() => changeSubject(item.key)}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className={styles.viewer}>
          <div className={styles.viewerGlow} aria-hidden="true" />

          <div className={styles.pageMeta}>
            <span>{currentPage.category}</span>
            <strong>{currentPage.label}</strong>
            <small>
              Halaman {activePage + 1} daripada {subject.pages.length}
            </small>
          </div>

          <div className={styles.deviceArea}>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowLeft}`}
              onClick={showPrevious}
              aria-label="Halaman sebelumnya"
            >
              ‹
            </button>

            <div className={styles.ipad}>
              <div className={styles.camera} aria-hidden="true" />

              <div className={styles.screen}>
                <Image
                  key={currentPage.src}
                  src={currentPage.src}
                  alt={`${subject.name}: ${currentPage.label}`}
                  width={1055}
                  height={1491}
                  className={styles.mainImage}
                  sizes="(max-width: 760px) 82vw, 520px"
                  priority={activePage === 0}
                />
              </div>
            </div>

            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowRight}`}
              onClick={showNext}
              aria-label="Halaman seterusnya"
            >
              ›
            </button>
          </div>

          <p className={styles.swipeHint}>
            ← Tekan anak panah atau pilih halaman di bawah →
          </p>

          <div className={styles.thumbnailTrack}>
            {subject.pages.map((page, index) => (
              <button
                key={page.src}
                type="button"
                className={`${styles.thumbnailButton} ${
                  index === activePage ? styles.thumbnailActive : ""
                }`}
                onClick={() => setActivePage(index)}
                aria-label={`Buka ${page.label}`}
              >
                <span className={styles.thumbnailImage}>
                  <Image
                    src={page.src}
                    alt=""
                    width={210}
                    height={297}
                    sizes="96px"
                  />
                </span>

                <span className={styles.thumbnailNumber}>{index + 1}</span>
                <small>{page.category}</small>
              </button>
            ))}

            <div className={styles.lockedPreview}>
              <div aria-hidden="true">🔒</div>
              <strong>Versi lengkap</strong>
              <span>Selepas bayaran</span>
            </div>
          </div>
        </div>

        <div className={styles.valueStrip}>
          <span>📖 Nota Digital Berwarna</span>
          <span>📝 Nota Kilat</span>
          <span>❓ Uji Minda</span>
          <span>✅ Skema Jawapan</span>
        </div>

        <div className={styles.lockCard}>
          <div className={styles.lockIcon} aria-hidden="true">
            🔒
          </div>

          <div>
            <p className={styles.lockLabel}>TERUSKAN ULANG KAJI</p>
            <h3>Anda baru melihat sebahagian kandungan Tahun 4.</h3>
            <p>
              Versi lengkap memberikan akses kepada semua kandungan yang
              disediakan dalam pakej pilihan anda.
            </p>
          </div>

          <a href="#pakej">
            Lihat pakej penuh
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}