"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { PreviewPage } from "./PreviewData";

interface PreviewModalProps {
  isOpen: boolean;
  page: PreviewPage | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export default function PreviewModal({
  isOpen,
  page,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: PreviewModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasPrevious) onPrevious();
      if (event.key === "ArrowRight" && hasNext) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasNext, hasPrevious, isOpen, onClose, onNext, onPrevious]);

  if (!isOpen || !page) return null;

  return (
    <div
      className="preview-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={page.alt}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const distance = endX - touchStartX.current;
        touchStartX.current = null;
        if (distance > 60 && hasPrevious) onPrevious();
        if (distance < -60 && hasNext) onNext();
      }}
    >
      <div className="preview-modal-topbar">
        <span className="preview-modal-brand">PandaiKids Reader</span>
        <span className="preview-modal-caption">Halaman {page.pageNumber}</span>
        <button
          ref={closeButtonRef}
          type="button"
          className="preview-modal-close"
          onClick={onClose}
          aria-label="Tutup paparan besar"
        >
          ×
        </button>
      </div>

      {hasPrevious && (
        <button
          type="button"
          className="preview-modal-nav preview-modal-nav-left"
          onClick={onPrevious}
          aria-label="Halaman sebelumnya"
        >
          ‹
        </button>
      )}

      <div className="preview-modal-content">
        <div className="preview-modal-image-wrap">
          <Image
            src={page.src}
            alt={page.alt}
            width={1200}
            height={1800}
            className="preview-modal-image"
            priority
            sizes="(max-width: 768px) 94vw, 72vw"
          />
        </div>
        <p className="preview-modal-hint">Tekan ESC untuk tutup · Leret untuk tukar halaman</p>
      </div>

      {hasNext && (
        <button
          type="button"
          className="preview-modal-nav preview-modal-nav-right"
          onClick={onNext}
          aria-label="Halaman seterusnya"
        >
          ›
        </button>
      )}
    </div>
  );
}
