"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import type { PreviewCategory, PreviewPage } from "./PreviewData";
import PreviewModal from "./PreviewModal";

interface PreviewGalleryProps {
  category: PreviewCategory;
}

export default function PreviewGallery({ category }: PreviewGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: category.pages.length > 1,
    align: "center",
    skipSnaps: false,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalPage, setModalPage] = useState<PreviewPage | null>(null);

  const pages = category.pages;
  const activePage = pages[activeIndex] ?? pages[0];

  const syncSelectedIndex = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    syncSelectedIndex();
    emblaApi.on("select", syncSelectedIndex);
    emblaApi.on("reInit", syncSelectedIndex);

    return () => {
      emblaApi.off("select", syncSelectedIndex);
      emblaApi.off("reInit", syncSelectedIndex);
    };
  }, [emblaApi, syncSelectedIndex]);

  const goToPrevious = () => emblaApi?.scrollPrev();
  const goToNext = () => emblaApi?.scrollNext();
  const goToPage = (index: number) => emblaApi?.scrollTo(index);

  const modalIndex = modalPage
    ? pages.findIndex((page) => page.id === modalPage.id)
    : -1;

  const showPreviousModalPage = () => {
    if (modalIndex <= 0) return;
    setModalPage(pages[modalIndex - 1]);
  };

  const showNextModalPage = () => {
    if (modalIndex < 0 || modalIndex >= pages.length - 1) return;
    setModalPage(pages[modalIndex + 1]);
  };

  if (!activePage) return null;

  return (
    <>
      <div className="preview-gallery">
        <div className="preview-gallery-reader-shell">
          <div className="preview-gallery-toolbar" aria-hidden="true">
            <span className="preview-gallery-toolbar-dot" />
            <span className="preview-gallery-toolbar-title">PandaiKids Reader</span>
            <span className="preview-gallery-toolbar-status">
              {activeIndex + 1} / {pages.length}
            </span>
          </div>

          <div className="preview-gallery-main">
            {pages.length > 1 && (
              <button
                type="button"
                className="preview-gallery-arrow preview-gallery-arrow-left"
                onClick={goToPrevious}
                aria-label="Lihat halaman sebelumnya"
              >
                <span aria-hidden="true">‹</span>
              </button>
            )}

            <div className="preview-gallery-viewport" ref={emblaRef}>
              <div className="preview-gallery-track">
                {pages.map((page, index) => (
                  <div className="preview-gallery-slide" key={page.id}>
                    <button
                      type="button"
                      className="preview-gallery-image-button"
                      onClick={() => setModalPage(page)}
                      aria-label={`Besarkan ${page.alt}`}
                    >
                      <span className="preview-gallery-image-frame">
                        <Image
                          src={page.src}
                          alt={page.alt}
                          width={900}
                          height={1350}
                          className="preview-gallery-image"
                          priority={index === 0}
                          sizes="(max-width: 640px) 78vw, (max-width: 980px) 62vw, 560px"
                        />
                        <span className="preview-gallery-page-corner">
                          {page.pageNumber}
                        </span>
                        <span className="preview-gallery-zoom">
                          <span aria-hidden="true">⌕</span>
                          Klik untuk besarkan
                        </span>
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {pages.length > 1 && (
              <button
                type="button"
                className="preview-gallery-arrow preview-gallery-arrow-right"
                onClick={goToNext}
                aria-label="Lihat halaman seterusnya"
              >
                <span aria-hidden="true">›</span>
              </button>
            )}
          </div>
        </div>

        <p className="preview-gallery-swipe-hint">
          <span aria-hidden="true">↔</span>
          Leret halaman atau gunakan anak panah
        </p>

        <div
          className="preview-gallery-thumbnails"
          role="tablist"
          aria-label="Pilih halaman contoh"
        >
          {pages.map((page, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={page.id}
                type="button"
                className={`preview-gallery-thumbnail ${
                  isActive ? "preview-gallery-thumbnail-active" : ""
                }`}
                onClick={() => goToPage(index)}
                role="tab"
                aria-selected={isActive}
                aria-label={`Buka halaman ${page.pageNumber}`}
              >
                <Image
                  src={page.src}
                  alt=""
                  width={140}
                  height={210}
                  className="preview-gallery-thumbnail-image"
                  sizes="84px"
                />
                <span className="preview-gallery-thumbnail-number">
                  {page.pageNumber}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <PreviewModal
        isOpen={Boolean(modalPage)}
        page={modalPage}
        onClose={() => setModalPage(null)}
        onPrevious={showPreviousModalPage}
        onNext={showNextModalPage}
        hasPrevious={modalIndex > 0}
        hasNext={modalIndex >= 0 && modalIndex < pages.length - 1}
      />
    </>
  );
}
