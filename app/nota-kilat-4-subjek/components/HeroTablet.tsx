"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  coverPath,
  subjects,
  type SchoolYear,
  type SubjectKey,
} from "../data";
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
  mobile?: boolean;
};

const AUTOPLAY_DELAY = 4000;
const RESUME_DELAY = 7000;

export default function HeroTablet({
  year,
  activeSubject,
  onSubjectChange,
  slides,
  mobile = false,
}: HeroTabletProps) {
  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: false,
      skipSnaps: false,
    },
    [autoplay.current],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const resumeTimer = useRef<number | null>(null);

  const activeSubjectData = subjects.find(
    (subject) => subject.key === activeSubject,
  );

  const pauseThenResume = useCallback(() => {
    autoplay.current.stop();

    if (resumeTimer.current !== null) {
      window.clearTimeout(resumeTimer.current);
    }

    resumeTimer.current = window.setTimeout(() => {
      autoplay.current.play();
      resumeTimer.current = null;
    }, RESUME_DELAY);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", pauseThenResume);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", pauseThenResume);
    };
  }, [emblaApi, onSelect, pauseThenResume]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.reInit();
    emblaApi.scrollTo(0, true);
    setSelectedIndex(0);
    autoplay.current.reset();
  }, [emblaApi, activeSubject, year, slides.length]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current !== null) {
        window.clearTimeout(resumeTimer.current);
      }
    };
  }, []);

  function selectSubject(subject: SubjectKey) {
    onSubjectChange(subject);
    pauseThenResume();
  }

  function selectSlide(index: number) {
    emblaApi?.scrollTo(index);
    pauseThenResume();
  }

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
            onClick={() => selectSubject(subject.key)}
            aria-pressed={activeSubject === subject.key}
            aria-label={`Lihat contoh ${subject.name}`}
          >
            <Image
              src={coverPath(year, subject.key)}
              alt={`Cover ${subject.name} Tahun ${year}`}
              width={760}
              height={1140}
              priority
              draggable={false}
            />
          </button>
        ))}
      </div>

      <div className={styles.tabletFloat}>
        <div className={styles.tablet}>
          <span className={styles.tabletCamera} aria-hidden="true" />

          <div className={styles.tabletScreen}>
            <div className={styles.emblaViewport} ref={emblaRef}>
              <div className={styles.emblaContainer}>
                {slides.map((slide, index) => (
                  <div className={styles.emblaSlide} key={slide.src}>
                    <Image
                      src={slide.src}
                      alt={`${activeSubjectData?.name ?? ""} ${slide.label}`}
                      width={1200}
                      height={1800}
                      className={styles.tabletImage}
                      priority={index === 0}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.tabletBadge}>
              <span>{activeSubjectData?.name}</span>
              <strong>4 Halaman</strong>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.slideDots} aria-label="Pilih halaman">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={`${slide.label}-${index}`}
            onClick={() => selectSlide(index)}
            className={selectedIndex === index ? styles.slideDotActive : ""}
            aria-label={`Paparkan ${slide.label}`}
            aria-pressed={selectedIndex === index}
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
          draggable={false}
        />
      </div>

      <div className={styles.digitalTag}>
        <span>PDF DIGITAL</span>
        <strong>Tahun {year} · 4 Subjek</strong>
      </div>
    </div>
  );
}
