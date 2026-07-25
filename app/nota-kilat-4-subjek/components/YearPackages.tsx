"use client";

import { useEffect, useState } from "react";
import { ONPAY_URLS, years } from "../data";
import styles from "./landing.module.css";

const FEATURES = [
  "Nota lengkap + Nota Kilat",
  "Uji Minda + Skema",
  "Boleh baca di telefon & cetak",
];

const PROMO_END = new Date("2026-07-27T23:59:59+08:00").getTime();
const packageOnpayUrl = (year: 3 | 4 | 5) => {
  if (year === 3) return ONPAY_URLS.year3;
  if (year === 4) return ONPAY_URLS.year4;
  return ONPAY_URLS.year5;
};

function usePromoCountdown() {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => setRemaining(Math.max(0, PROMO_END - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return remaining;
}

function PromoCountdown({ remaining, compact = false, title, label }: { remaining: number; compact?: boolean; title?: string; label?: string }) {
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const expired = remaining === 0;
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    <div className={`${styles.promoCountdown} ${compact ? styles.promoCountdownCompact : ""}`} aria-live="polite">
      <strong>🔥 PROMOSI 3 HARI SAHAJA</strong>
      <span>Tawaran tamat dalam:</span>
      <div className={styles.promoDigits} aria-label={expired ? "Promosi telah tamat" : "Countdown promosi"}>
        <b>{pad(days)}<small>Hari</small></b>
        <b>{pad(hours)}<small>Jam</small></b>
        <b>{pad(minutes)}<small>Minit</small></b>
        <b>{pad(seconds)}<small>Saat</small></b>
      </div>
      {expired && <em>Promosi telah tamat</em>}
    </div>
  );
}

export default function YearPackages() {
  const remaining = usePromoCountdown();

  return (
    <section className={styles.packageSection} id="pakej">
      <div className={styles.container}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>PILIH IKUT TAHUN ANAK</p>
          <h2>Mulakan dengan pakej <em>yang sesuai untuk anak.</em></h2>
          <p>
            Setiap pakej mengandungi empat subjek KAFA: Aqidah, Ibadah, Sirah dan Adab.
          </p>
        </div>

        <PromoCountdown remaining={remaining} />

        <div className={styles.packageGrid}>
          {years.map((item, index) => (
            <article
              className={`${styles.packageCard} ${
                index === 1 ? styles.packageCardFeatured : ""
              }`}
              key={item.year}
            >
              <div className={styles.packageTopline}>
                <span className={styles.digitalPill}>PDF DIGITAL</span>
              </div>

              <div className={styles.packageTitle}>
                <h3>Nota Digital {item.label}</h3>
              </div>

              <div className={styles.packageVisual}>
                <img
                  src={
                    item.year === 3
                      ? "/pandaikids/nota-kilat-v3/products/package-tahun-3.webp"
                      : item.year === 4
                        ? "/pandaikids/nota-kilat-v3/products/package-tahun-4.webp"
                        : "/pandaikids/nota-kilat-v3/products/package-tahun-5.webp"
                  }
                  alt={`Pakej Nota Digital PandaiKids ${item.label}`}
                  className={styles.packageProductImage}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </div>

              <div className={styles.packageBody}>
                <p className={styles.packageSummary}>4 subjek lengkap: Aqidah, Ibadah, Sirah &amp; Adab.</p>

                <ul className={styles.packageFeatureList}>
                  {FEATURES.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <div className={styles.packagePriceBlock}>
                  <div>
                    <del>{item.oldPrice}</del>
                    <strong>{item.price}</strong>
                  </div>
                  <small>Bayaran sekali sahaja</small>
                </div>

                <a
                  href={packageOnpayUrl(item.year)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.packageBuyButton}
                >
                  Beli {item.label}
                  <span aria-hidden="true">→</span>
                </a>

                <p className={styles.packageMicrocopy}>
                  Muat turun selepas pembayaran · Tiada penghantaran fizikal
                </p>
              </div>
            </article>
          ))}
        </div>

        <article className={styles.bundleCardPremium}>
          <div className={styles.bundlePopular}>⭐ PILIHAN PALING BERBALOI</div>

          <div className={styles.bundleTitle}>
            <p className={styles.eyebrow}>KOLEKSI PREMIUM</p>
            <h3>Semua Nota KAFA<br />Dalam Satu Bundle</h3>
            <p>Tahun 3, 4 &amp; 5</p>
          </div>

          <div className={styles.bundleVisual}>
            <img
              src="/pandaikids/nota-kilat-v3/products/package-bundle.webp"
              alt="Bundle Nota Digital PandaiKids Tahun 3, 4 dan 5"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>

          <div className={styles.bundleCopyPremium}>
              <div className={styles.bundleStats}>
                <span><strong>12 Modul Digital</strong></span>
                <span><strong>3 Tahun Lengkap</strong></span>
            </div>
          </div>

          <div className={styles.bundlePricePremium}>
            <span>HARGA BUNDLE</span>
            <del>RM45</del>
            <strong>RM29.90</strong>
            <em className={styles.bundleSavings}>JIMAT RM15.10</em>
            <a className={styles.bundleCta} href={ONPAY_URLS.bundle} target="_blank" rel="noopener noreferrer">
              Dapatkan Bundle Tahun 3–5 <b>→</b>
            </a>
            <small>Bayaran sekali · Muat turun digital</small>
          </div>
        </article>

      </div>
    </section>
  );
}
