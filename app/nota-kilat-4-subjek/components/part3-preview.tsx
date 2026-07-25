"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode, TouchEvent } from "react";
import {
  getSubjectPages,
  smartPreviewData,
  smartPreviewSubjectOrder,
  type SmartPreviewSubjectKey,
} from "./smart-preview-data";

const PAGE_COUNT = 13;

function PhoneFrame({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div {...props} className={`${className ?? ""} part3-reader`}>
      {children}
    </div>
  );
}

const categoryLabel = (page: number) => {
  if (page <= 7) return "PDF WARNA";
  if (page <= 9) return "NOTA KILAT";
  if (page <= 11) return "UJI MINDA";
  if (page === 12) return "SKEMA JAWAPAN";
  return "VERSI LENGKAP";
};

export default function SmartPreview() {
  const [subject, setSubject] = useState<SmartPreviewSubjectKey>("aqidah");
  const [page, setPage] = useState(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const [incomingPageIndex, setIncomingPageIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const data = smartPreviewData[subject] ?? smartPreviewData.aqidah;
  const pages = useMemo(() => getSubjectPages(subject), [subject]);
  const pageIndex = Number.isInteger(page) && page >= 0 && page < pages.length ? page : 0;
  const currentPage = pages[pageIndex] ?? pages[0];
  const imagePages = pages.filter((item) => item.type === "image");
  const isLocked = currentPage?.type === "locked";

  const chooseSubject = (next: SmartPreviewSubjectKey) => {
    if (next === subject) return;
    setSubject(next);
    setPage(0);
    setIncomingPageIndex(null);
    setIsTransitioning(false);
  };

  const goToPage = (index: number) => {
    if (isTransitioning) return;
    const nextIndex = Math.max(0, Math.min(pages.length - 1, index));
    if (nextIndex === pageIndex) return;
    setIncomingPageIndex(nextIndex);
    setIsTransitioning(true);
  };

  const movePage = (delta: number) => goToPage(pageIndex + delta);

  const onReaderKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPage(pageIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToPage(pageIndex + 1);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (isTransitioning || event.touches.length === 0) return;
    const touch = event.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (isTransitioning || touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const distanceX = touch.clientX - touchStartXRef.current;
    const distanceY = touch.clientY - touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    if (Math.abs(distanceX) <= Math.abs(distanceY) || Math.abs(distanceX) < 35) return;
    movePage(distanceX < 0 ? 1 : -1);
  };

  const completeTransition = () => {
    if (incomingPageIndex === null) return;
    setPage(incomingPageIndex);
    setIncomingPageIndex(null);
    setIsTransitioning(false);
  };

  useEffect(() => {
    if (isLocked) return;
    [page - 1, page + 1].forEach((index) => {
      const next = pages[index];
      if (next?.type === "image") {
        const image = new Image();
        image.src = next.src;
      }
    });
  }, [page, pages, isLocked]);

  const renderPreviewPage = (item: (typeof pages)[number], index: number) => {
    if (!item || item.type === "locked") {
      return (
        <span className="part3-locked-page">
          <span aria-hidden="true">🔒</span>
          <strong>Versi lengkap</strong>
          <small>Perlukan pembayaran untuk versi lengkap</small>
        </span>
      );
    }
    return <img src={item.src} alt={item.alt} loading={index === pageIndex ? "eager" : "lazy"} decoding="async" draggable={false} />;
  };

  const incomingPage = incomingPageIndex === null ? null : pages[incomingPageIndex];

  return (
    <section className="part3-section" aria-labelledby="part3-title">
      <div className="part3-product-intro">
        <div className="part3-product-copy">
          <p className="section-kicker">NOTA DIGITAL PANDAIKIDS</p>
          <h2>Satu set lengkap untuk ulang kaji KAFA anak.</h2>
          <p>
            Merangkumi hampir semua tajuk utama KAFA Tahun 3, 4 dan 5 bagi empat subjek teras: Aqidah, Ibadah, Sirah dan Adab.
          </p>
        </div>

        <div className="part3-subject-collage" aria-label="Contoh visual Aqidah, Ibadah, Sirah dan Adab">
          {smartPreviewSubjectOrder.map((key) => {
            const cover = smartPreviewData[key].pdf[0];
            return <img key={key} src={cover.src} alt={`${smartPreviewData[key].label} — ${cover.alt}`} loading="lazy" decoding="async" />;
          })}
        </div>

        <div className="part3-product-benefits">
          <article className="part3-benefit-card part3-benefit-aqidah"><span className="part3-benefit-icon" aria-hidden="true">📚</span><div><h3>4 Subjek KAFA</h3><p>Aqidah, Ibadah, Sirah dan Adab</p></div></article>
          <article className="part3-benefit-card part3-benefit-ibadah"><span className="part3-benefit-icon" aria-hidden="true">✨</span><div><h3>Nota Mudah Faham</h3><p>Nota berwarna dan Nota Kilat</p></div></article>
          <article className="part3-benefit-card part3-benefit-sirah"><span className="part3-benefit-icon" aria-hidden="true">✏️</span><div><h3>Latihan Lengkap</h3><p>Uji Minda bersama skema jawapan</p></div></article>
          <article className="part3-benefit-card part3-benefit-adab"><span className="part3-benefit-icon" aria-hidden="true">📖</span><div><h3>Lebih Mudah Dibaca</h3><p>Kandungan Jawi ditukar kepada Rumi</p></div></article>
          <p>✓ <span>4 subjek utama — Aqidah, Ibadah, Sirah dan Adab</span></p>
          <p>✓ <span>Nota visual berwarna dan Nota Kilat untuk ulang kaji pantas</span></p>
          <p>✓ <span>Latihan Uji Minda berserta skema jawapan</span></p>
          <p>✓ <span>Kandungan Jawi ditukar kepada Rumi dan isi penting disusun lebih teratur</span></p>
        </div>

        <p className="part3-product-bridge">
          <strong>Belajar tak lagi terasa bersendirian.</strong> En. Pandi sentiasa menemani anak pada setiap halaman—
          kadang-kadang sebagai kawan, guru, ustaz, ayah atau atuk yang membantu menerangkan isi pelajaran dengan cara
          yang lebih mesra dan menyeronokkan.
        </p>
        <p className="part3-product-invite">Nak tengok sendiri isi sebenarnya?</p>
        <div className="part3-pandi-highlight">
          <span className="part3-pandi-mark" aria-hidden="true">🐼</span>
          <div><strong>Belajar terasa lebih ditemani.</strong><p>Pandi hadir pada setiap halaman sebagai kawan, guru dan pemberi semangat untuk membantu anak memahami isi pelajaran.</p></div>
        </div>
        <p className="part3-product-invite part3-product-invite-final">Nak tengok sendiri isi sebenarnya?</p>
        <a className="part3-product-cta" href="#contoh-nota">Lihat Smart Preview <span aria-hidden="true">→</span></a>
      </div>

      <section id="contoh-nota" className="part3-section-scene" aria-labelledby="part3-title">
      <div className="part3-copy">
        <p className="section-kicker">CUBA SEBELUM BELI</p>
        <h2 id="part3-title">Tengok sendiri apa yang <em>anak akan dapat.</em></h2>
        <p>Leret untuk melihat contoh nota sebenar daripada empat subjek Tahun 4.</p>
      </div>

      <div className="part3-subjects" role="tablist" aria-label="Pilih subjek Tahun 4">
        {smartPreviewSubjectOrder.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={subject === key}
            className={subject === key ? "is-active" : ""}
            onClick={() => chooseSubject(key)}
          >
            {smartPreviewData[key].label.replace(" TAHUN 4", "")}
          </button>
        ))}
      </div>

      <div className="part3-example-label">
        <strong>{data.label}</strong>
        <span>Aqidah <b>•</b> Ibadah <b>•</b> Sirah <b>•</b> Adab</span>
      </div>
      <div className="part3-page-category" aria-live="polite">{categoryLabel(page + 1)}</div>

      <div className="part3-preview-scene">
        <div className="part3-decor-pages" aria-hidden="true">
          {imagePages.slice(1, 4).map((item, index) => (
            <img key={item.id} src={item.src} alt="" loading="lazy" decoding="async" className={`part3-decor-page part3-decor-page-${index + 1}`} />
          ))}
        </div>
      <PhoneFrame className="phone-frame" tabIndex={0} onKeyDown={onReaderKeyDown}>
        <div
          className="phone-screen part3-phone-screen"
          aria-label={isLocked ? "Versi lengkap selepas bayaran" : "Halaman nota semasa"}
        >
          <span className="dynamic-island part3-phone-speaker" aria-hidden="true" />
          <div className="page-stage" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className={`preview-page ${isTransitioning ? "page-leaving" : ""}`}>
              {renderPreviewPage(currentPage, pageIndex)}
            </div>
            {incomingPage && (
              <div className="preview-page page-entering" onAnimationEnd={completeTransition}>
                {renderPreviewPage(incomingPage, incomingPageIndex ?? 0)}
              </div>
            )}
          </div>
        </div>
        <button className="part3-arrow part3-arrow-left" type="button" onClick={() => movePage(-1)} disabled={page === 0 || isTransitioning} aria-label="Halaman sebelumnya">‹</button>
        <button className="part3-arrow part3-arrow-right" type="button" onClick={() => movePage(1)} disabled={isLocked || isTransitioning} aria-label="Halaman seterusnya">›</button>
      </PhoneFrame>
      </div>

      </section>

      <div className="part3-page-status" aria-live="polite">Halaman {page + 1} daripada {PAGE_COUNT}</div>
      <p className="part3-swipe-hint">Leret untuk melihat halaman seterusnya</p>

      <div className="part3-thumbnails" role="tablist" aria-label={`Halaman ${data.label}`}>
        {imagePages.map((item, index) => (
          <button key={item.id} type="button" role="tab" aria-selected={page === index} className={page === index ? "is-active" : ""} onClick={() => goToPage(index)} aria-label={`Buka halaman ${index + 1}`}>
            <img src={item.src} alt="" loading="lazy" decoding="async" />
            <span>{index + 1}</span>
          </button>
        ))}
        <button type="button" role="tab" aria-selected={isLocked} className={isLocked ? "is-active is-locked" : "is-locked"} onClick={() => goToPage(pages.length - 1)} aria-label="Buka halaman 13 terkunci">🔒<span>13</span></button>
      </div>

      <div className="part3-benefits">
        <p>✓ <span>Kandungan sebenar, bukan gambar contoh rekaan</span></p>
        <p>✓ <span>Boleh dibuka melalui telefon</span></p>
        <p>✓ <span>Boleh dicetak untuk ulang kaji</span></p>
      </div>

      <a className="part3-cta" href="#pakej">Lihat Pakej Ikut Tahun Anak <span aria-hidden="true">→</span></a>

    </section>
  );
}
