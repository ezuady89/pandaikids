"use client";

import { useEffect, useState } from "react";
import styles from "./landing.module.css";

const WHATSAPP_URL =
  "https://wa.me/60136867931?text=" +
  encodeURIComponent(
    "Assalamualaikum, saya ingin bertanya tentang Nota Digital KAFA PandaiKids.",
  );

export default function FloatingWhatsApp() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    const footer = document.querySelector<HTMLElement>("footer");
    if (!hero || !footer || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero) setHeroVisible(entry.isIntersecting);
          if (entry.target === footer) setFooterVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(hero);
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const isVisible = !heroVisible && !footerVisible;

  return (
    <a
      className={`${styles.floatingWhatsApp} ${isVisible ? styles.floatingWhatsAppVisible : ""}`}
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi PandaiKids melalui WhatsApp"
      title="WhatsApp PandaiKids"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20.5 3.5A11.9 11.9 0 0 0 12.07 0C5.5 0 .16 5.33.16 11.9c0 2.1.55 4.14 1.6 5.94L.06 24l6.3-1.65a11.86 11.86 0 0 0 5.7 1.46h.01c6.56 0 11.9-5.33 11.9-11.9 0-3.18-1.24-6.17-3.47-8.4Zm-8.43 18.3h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.64-.24-.37a9.87 9.87 0 1 1 8.39 4.62Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.1 4.5.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.56-.35Z" />
      </svg>
    </a>
  );
}
