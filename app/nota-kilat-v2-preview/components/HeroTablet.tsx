"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
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

const AUTOPLAY_DELAY = 4200;
const RESUME_DELAY = 7000;

export default function HeroTablet({
  year,
  activeSubject,
  slides,
  mobile = false,
}: HeroTabletProps) {
  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
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

  const activeSubjectData =
    subjects.find((subject) => subject.key === activeSubject) ?? subjects[0];

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
  }, [emblaApi, activeSubject, slides]);

  useEffect(() => {
    return () => {
      if (resumeTimer.current !== null) {
        window.clearTimeout(resumeTimer.current);
      }
    };
  }, []);

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
      <div className={styles.tableSurface} aria-hidden="true" />

      <div className={styles.coverFan} aria-hidden="true">
        {slides.map((slide, index) => (
          <div
            key={`${slide.src}-background`}
            className={`${styles.coverButton} ${
              styles[`coverPosition${index + 1}`]
            } ${selectedIndex === index ? styles.coverActive : ""}`}
          >
            <Image
              src={slide.src}
              alt=""
              width={760}
              height={1140}
              draggable={false}
            />
          </div>
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
                      alt={`${activeSubjectData.name}: ${slide.label}`}
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
              <span>{activeSubjectData.name}</span>
              <strong>{slides[selectedIndex]?.label}</strong>
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

      <div className={styles.swipeLabel} aria-hidden="true">
        <span>←</span>
        <strong>Swipe</strong>
        <span>→</span>
      </div>

      <div className={styles.digitalTag}>
        <span>CONTOH SEBENAR</span>
        <strong>
          Tahun {year} · {activeSubjectData.name}
        </strong>
      </div>
    </div>
  );
}
