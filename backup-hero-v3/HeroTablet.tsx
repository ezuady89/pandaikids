"use client";

import Image from "next/image";
import { subjects, coverPath, type SchoolYear, type SubjectKey } from "../data";
import styles from "./Hero.module.css";

type Slide = {
  src: string;
  label: string;
};

type HeroTabletProps = {
  year: SchoolYear;
  activeSubject: SubjectKey;
  onSubjectChange: (subject: SubjectKey) => void;
  slides: Slide[];
  activeSlide: number;
  onSlideChange: (index: number) => void;
  mobile?: boolean;
};

export default function HeroTablet({
  year,
  activeSubject,
  onSubjectChange,
  slides,
  activeSlide,
  onSlideChange,
  mobile = false,
}: HeroTabletProps) {
  const activeSubjectData = subjects.find(
    (subject) => subject.key === activeSubject,
  );

  return (
    <div
      className={`${styles.digitalStage} ${
        mobile ? styles.digitalStageMobile : ""
      }`}
    >
      <div className={styles.digitalGlow} aria-hidden="true" />

      <div className={styles.coverFan}>
        {subjects.map((subject, index) => (
          <button
            type="button"
            key={subject.key}
            className={`${styles.coverButton} ${
              styles[`coverPosition${index + 1}`]
            } ${activeSubject === subject.key ? styles.coverActive : ""}`}
            onClick={() => onSubjectChange(subject.key)}
            aria-pressed={activeSubject === subject.key}
            aria-label={`Lihat contoh ${subject.name}`}
          >
            <Image
              src={coverPath(year, subject.key)}
              alt={`Cover ${subject.name} Tahun ${year}`}
              width={760}
              height={1140}
              priority
            />
          </button>
        ))}
      </div>

      <div className={styles.tabletFloat}>
        <div className={styles.tablet}>
          <span className={styles.tabletCamera} aria-hidden="true" />

          <div className={styles.tabletScreen}>
            <Image
              key={`${activeSubject}-${activeSlide}`}
              src={slides[activeSlide].src}
              alt={`${activeSubjectData?.name} ${slides[activeSlide].label}`}
              width={1200}
              height={1800}
              className={styles.tabletImage}
              priority
            />

            <div className={styles.tabletBadge}>
              <span>{activeSubjectData?.name}</span>
              <strong>4 Halaman</strong>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.slideDots}>
        {slides.map((slide, index) => (
          <button
            type="button"
            key={`${slide.label}-${index}`}
            onClick={() => onSlideChange(index)}
            className={activeSlide === index ? styles.slideDotActive : ""}
            aria-label={`Paparkan ${slide.label}`}
            aria-pressed={activeSlide === index}
          />
        ))}
      </div>

      <div className={styles.digitalPandi}>
        <Image
          src="/pandaikids/nota-kilat-v3/mascot/pandi-point.webp"
          width={760}
          height={760}
          alt="Pandi menunjukkan nota digital"
          priority
        />
      </div>

      <div className={styles.digitalTag}>
        <span>PDF DIGITAL</span>
        <strong>Tahun {year} · 4 Subjek</strong>
      </div>
    </div>
  );
}