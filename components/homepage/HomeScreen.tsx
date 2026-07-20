"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PandaiKidsOnboarding } from "./PandaiKidsOnboarding";
import styles from "./HomeScreen.module.css";

export default function HomeScreen() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [leaving, setLeaving] = useState(false);

  function startGame() {
    setLeaving(true);

    window.setTimeout(() => {
      setShowOnboarding(true);
    }, 550);
  }

  if (showOnboarding) {
    return <PandaiKidsOnboarding />;
  }

  return (
    <main className={`${styles.page} ${leaving ? styles.leaving : ""}`}>
      <Image
        src="/pandaikids/homepage/wallpaper.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.wallpaper}
      />

      <div className={styles.sunlight} aria-hidden="true" />
      <div className={styles.bottomShade} aria-hidden="true" />

      {/* Butang ibu bapa di penjuru */}
      <button
        className={styles.parentShortcut}
        type="button"
        onClick={() => router.push("/nota-kilat-4-subjek")}
        aria-label="Buka ruangan ibu bapa"
      >
        <span aria-hidden="true">👨‍👩‍👧</span>
        <strong>Ibu Bapa</strong>
      </button>

      {/* Logo */}
      <div className={styles.logo}>
        <Image
          src="/pandaikids/homepage/logo.webp"
          alt="PandaiKids"
          width={586}
          height={128}
          priority
        />
      </div>

      {/* Butang utama sahaja */}
      <section className={styles.controls}>
        <button
          className={styles.startButton}
          type="button"
          onClick={startGame}
          aria-label="Mula bermain PandaiKids"
        >
          <Image
            src="/pandaikids/homepage/start-button.webp"
            alt="Mula Bermain"
            width={1460}
            height={990}
            priority
          />
        </button>
      </section>

      {/* Pandi */}
      <div className={styles.pandi}>
        <Image
          src="/pandaikids/homepage/pandi.webp"
          alt="Pandi sedang melambai"
          width={1024}
          height={1024}
          priority
        />
      </div>
    </main>
  );
}