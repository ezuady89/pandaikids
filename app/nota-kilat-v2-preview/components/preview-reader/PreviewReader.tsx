"use client";

import "./PreviewReader.css";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ONPAY_URL } from "../../data";
import PreviewGallery from "./PreviewGallery";
import {
  getPreviewCategory,
  getPreviewSubject,
  previewSubjects,
  type PreviewCategoryId,
  type PreviewSubjectId,
} from "./PreviewData";

const CATEGORY_ICONS: Record<PreviewCategoryId, string> = {
  pdf: "▣",
  nota: "✦",
  uji: "✎",
  skema: "✓",
};

export default function PreviewReader() {
  const [activeSubjectId, setActiveSubjectId] =
    useState<PreviewSubjectId>("adab");
  const [activeCategoryId, setActiveCategoryId] =
    useState<PreviewCategoryId>("pdf");

  const activeSubject = useMemo(
    () => getPreviewSubject(activeSubjectId),
    [activeSubjectId],
  );

  const activeCategory = useMemo(
    () => getPreviewCategory(activeSubjectId, activeCategoryId),
    [activeCategoryId, activeSubjectId],
  );

  const handleSubjectChange = (subjectId: PreviewSubjectId) => {
    setActiveSubjectId(subjectId);
    setActiveCategoryId("pdf");
  };

  return (
    <section
      id="preview-reader"
      className={`preview-reader-section preview-reader-theme-${activeSubjectId}`}
      aria-labelledby="preview-reader-title"
    >
      <div className="preview-reader-orb preview-reader-orb-one" aria-hidden="true" />
      <div className="preview-reader-orb preview-reader-orb-two" aria-hidden="true" />

      <div className="preview-reader-container">
        <header className="preview-reader-heading">
          <span className="preview-reader-eyebrow">PREVIEW KANDUNGAN NOTA KILAT PANDAIKIDS</span>
          <h2 id="preview-reader-title" className="preview-reader-title">
            Lihat Contoh. <span>Yakin Dulu, Baru Beli.</span>
          </h2>
          <p className="preview-reader-intro">
            Terokai halaman sebenar Nota Digital PandaiKids sebelum membuat keputusan pembelian.
            Buka, leret dan besarkan seperti membaca PDF sebenar.
          </p>
        </header>

        <div className="preview-reader-subject-tabs-wrap">
          <span className="preview-reader-tab-label">Pilih subjek</span>
          <div className="preview-reader-subject-tabs" role="tablist" aria-label="Pilih subjek">
            {previewSubjects.map((subject) => {
              const isActive = subject.id === activeSubjectId;
              return (
                <button
                  key={subject.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`preview-reader-subject-tab preview-reader-subject-tab-${subject.id} ${
                    isActive ? "preview-reader-subject-tab-active" : ""
                  }`}
                  onClick={() => handleSubjectChange(subject.id)}
                >
                  <span className="preview-reader-subject-book" aria-hidden="true">▤</span>
                  <span>{subject.label}<small>Tahun 5</small></span>
                </button>
              );
            })}
          </div>
        </div>

        <article className="preview-reader-card">
          <div className="preview-reader-subject-copy">
            <div className="preview-reader-subject-heading">
              <span className="preview-reader-year">CONTOH TAHUN 5</span>
              <h3 className="preview-reader-subject-title">{activeSubject.label}</h3>
              <p className="preview-reader-subject-subtitle">{activeSubject.subtitle}</p>
            </div>
            <p className="preview-reader-subject-description">
              {activeSubject.description}
            </p>
          </div>

          <div className="preview-reader-category-tabs" role="tablist" aria-label={`Jenis kandungan ${activeSubject.label}`}>
            {activeSubject.categories.map((category) => {
              const isActive = category.id === activeCategoryId;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`preview-reader-category-tab ${
                    isActive ? "preview-reader-category-tab-active" : ""
                  }`}
                  onClick={() => setActiveCategoryId(category.id)}
                >
                  <span className="preview-reader-category-icon" aria-hidden="true">
                    {CATEGORY_ICONS[category.id]}
                  </span>
                  <span className="preview-reader-category-label">{category.shortLabel}</span>
                  {category.badge && (
                    <span className="preview-reader-category-badge">{category.badge}</span>
                  )}
                  <span className="preview-reader-category-underline" aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <div className="preview-reader-category-info">
            <div className="preview-reader-category-heading-row">
              <div>
                <h4 className="preview-reader-category-title">{activeCategory.label}</h4>
                <p className="preview-reader-category-description">
                  {activeCategory.description}
                </p>
              </div>
              <span className="preview-reader-page-total">
                {activeCategory.pages.length} halaman contoh
              </span>
            </div>

            {activeCategory.id === "nota" && (
              <div className="preview-reader-print-note">
                <span className="preview-reader-print-icon" aria-hidden="true">🖨️</span>
                <span>
                  <strong>Mesra pencetak.</strong> Direka khas untuk cetakan hitam putih dan menjimatkan dakwat.
                </span>
              </div>
            )}
          </div>

          <PreviewGallery
            key={`${activeSubjectId}-${activeCategoryId}`}
            category={activeCategory}
          />

          <div className="preview-reader-cta">
            <div className="preview-reader-cta-mascot" aria-hidden="true">
              <Image
                src="/pandaikids/nota-kilat-v3/mascot/pandi-hold-books.png"
                width={675}
                height={922}
                alt=""
                sizes="(max-width: 640px) 130px, 170px"
              />
            </div>
            <div className="preview-reader-cta-copy">
              <span className="preview-reader-cta-kicker">SUKA CONTOH KANDUNGAN INI?</span>
              <h4>Dapatkan semua halaman penuh.</h4>
              <p>Lengkap dengan Nota Kilat, Uji Minda dan Skema Jawapan.</p>
            </div>
            <div className="preview-reader-cta-action">
              <a href={ONPAY_URL} className="preview-reader-cta-button">
                Dapatkan Sekarang
                <span aria-hidden="true">→</span>
              </a>
              <small>🔒 Pembayaran selamat melalui OnPay</small>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
