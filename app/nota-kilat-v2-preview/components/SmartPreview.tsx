"use client";

import Image from "next/image";
import { memo, useCallback, useMemo, useRef, useState } from "react";
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

type SwipeStart = {
  pointerId: number;
  x: number;
  y: number;
};

const BASE_PATH = "/pandaikids/nota-kilat-v2/tahun-4";
const THUMBNAIL_BASE_PATH = `${BASE_PATH}/thumbnails`;
const SWIPE_THRESHOLD_PX = 48;
const BACKGROUND_PAGE_INDEXES = [1, 3, 5, 7, 9, 11];

const SUBJECTS: SubjectConfig[] = [
  {
    key: "aqidah",
    name: "Aqidah",
    accent: "#22a447",
    pages: [
      { src: `${BASE_PATH}/aqidah/1 Cover.webp`, label: "Cover Aqidah", category: "Cover" },
      { src: `${BASE_PATH}/optimized/aqidah/1 pesanan.webp`, label: "Pesanan PandaiKids", category: "Pengenalan" },
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

type PreviewFanProps = {
  subject: SubjectConfig;
};

const PreviewFan = memo(function PreviewFan({ subject }: PreviewFanProps) {
  return (
    <div className={styles.previewFan} aria-hidden="true">
      {BACKGROUND_PAGE_INDEXES.map((pageIndex) => (
        <Image
          key={pageIndex}
          src={`${THUMBNAIL_BASE_PATH}/${subject.key}/fan-${pageIndex + 1}.webp`}
          alt=""
          width={240}
          height={340}
          sizes="(max-width: 520px) 78px, (max-width: 820px) 112px, 155px"
          className={styles.previewFanCard}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      ))}
    </div>
  );
});

type PreviewSlideProps = {
  page: PreviewPage;
  pageIndex: number;
  activePage: number;
  subjectName: string;
};

const PreviewSlide = memo(function PreviewSlide({
  page,
  pageIndex,
  activePage,
  subjectName,
}: PreviewSlideProps) {
  const isActive = pageIndex === activePage;
  const isFirstSlide = pageIndex === 0;

  return (
    <Image
      src={page.src}
      alt={isActive ? `${subjectName}: ${page.label}` : ""}
      width={1055}
      height={1491}
      className={`${styles.mainImage} ${
        isActive ? styles.mainImageActive : styles.mainImagePreload
      }`}
      sizes="(max-width: 760px) 82vw, 520px"
      priority={isFirstSlide}
      loading={isFirstSlide ? "eager" : "lazy"}
      fetchPriority="high"
      decoding="async"
      draggable={false}
      aria-hidden={!isActive}
    />
  );
});

export default function SmartPreview() {
  const [activeSubject, setActiveSubject] = useState<SubjectKey>("aqidah");
  const [activePage, setActivePage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const swipeStartRef = useRef<SwipeStart | null>(null);

  const subject = useMemo(
    () => SUBJECTS.find((item) => item.key === activeSubject) ?? SUBJECTS[0],
    [activeSubject],
  );

  const totalSlides = subject.pages.length + 1;
  const isLockedPreview = activePage === subject.pages.length;
  const currentPage =
    subject.pages[Math.min(activePage, subject.pages.length - 1)];
  const previewPageIndexes = useMemo(
    () =>
      [activePage - 1, activePage, activePage + 1].filter(
        (pageIndex) =>
          pageIndex >= 0 && pageIndex < subject.pages.length,
      ),
    [activePage, subject.pages.length],
  );

  function changeSubject(key: SubjectKey) {
    setActiveSubject(key);
    setActivePage(0);
  }

  const showPrevious = useCallback(() => {
    setActivePage((current) => Math.max(0, current - 1));
  }, []);

  const showNext = useCallback(() => {
    setActivePage((current) =>
      Math.min(totalSlides - 1, current + 1),
    );
  }, [totalSlides]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;

    swipeStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const swipeStart = swipeStartRef.current;

    if (!swipeStart || swipeStart.pointerId !== event.pointerId) return;

    swipeStartRef.current = null;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const deltaX = event.clientX - swipeStart.x;
    const deltaY = event.clientY - swipeStart.y;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;
    if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

    if (deltaX < 0) {
      showNext();
    } else {
      showPrevious();
    }
  }

  function handlePointerCancel(event: React.PointerEvent<HTMLDivElement>) {
    if (swipeStartRef.current?.pointerId !== event.pointerId) return;

    swipeStartRef.current = null;
    setIsDragging(false);
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
            <span>
              {isLockedPreview ? "Selepas bayaran" : currentPage.category}
            </span>
            <strong>
              {isLockedPreview ? "Versi lengkap" : currentPage.label}
            </strong>
          </div>

          <div className={styles.deviceArea}>
            <PreviewFan subject={subject} />

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

              <div
                className={`${styles.screen} ${
                  isDragging ? styles.screenDragging : ""
                }`}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
              >
                {isLockedPreview ? (
                  <div className={styles.lockedScreen}>
                    <div aria-hidden="true">🔒</div>
                    <strong>Versi lengkap</strong>
                    <span>Selepas bayaran</span>
                  </div>
                ) : (
                  previewPageIndexes.map((pageIndex) => (
                    <PreviewSlide
                      key={subject.pages[pageIndex].src}
                      page={subject.pages[pageIndex]}
                      pageIndex={pageIndex}
                      activePage={activePage}
                      subjectName={subject.name}
                    />
                  ))
                )}
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

          <p className={styles.pageIndicator}>
            Halaman {activePage + 1} daripada {totalSlides}
          </p>

          <p className={styles.swipeHint}>
            ← Tekan anak panah atau pilih halaman di bawah →
          </p>
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
