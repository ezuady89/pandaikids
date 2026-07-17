import Image from "next/image";
import { ONPAY_URL, years } from "../data";
import styles from "./landing.module.css";

const FEATURES = [
  "4 subjek teras",
  "PDF digital berwarna",
  "Boleh dibaca di telefon, tablet & komputer",
  "Boleh dicetak sendiri",
];

export default function YearPackages() {
  return (
    <section className={styles.packageSection} id="pakej">
      <div className={styles.container}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>PILIH PAKEJ</p>
          <h2>Pilih ikut tahun anak.</h2>
          <p>
            Setiap pakej mengandungi empat modul digital: Aqidah, Ibadah,
            Sirah dan Adab.
          </p>
        </div>

        <div className={styles.packageGrid}>
          {years.map((item, index) => (
            <article
              className={`${styles.packageCard} ${
                index === 1 ? styles.packageCardFeatured : ""
              }`}
              key={item.year}
            >
              <div className={styles.packageTopline}>
                <span className={styles.packageBadge}>{item.badge}</span>
                <span className={styles.digitalPill}>PDF DIGITAL</span>
              </div>

              <div className={styles.packageVisual}>
                <div className={styles.packageImageFrame}>
                  <Image
                    src={`/pandaikids/nota-kilat-v3/products/tahun-${item.year}.png`}
                    width={1200}
                    height={1200}
                    alt={`Pakej Nota Digital PandaiKids ${item.label}`}
                    sizes="(max-width: 760px) 86vw, 360px"
                    className={styles.packageProductImage}
                  />
                </div>
              </div>

              <div className={styles.packageBody}>
                <p className={styles.packageLabel}>Pakej 4 subjek teras</p>
                <h3>{item.label}</h3>
                <p>{item.description}</p>

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

                <a href={ONPAY_URL} className={styles.packageBuyButton}>
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
          <div className={styles.bundlePopular}>PALING JIMAT</div>

          <div className={styles.bundleVisual}>
            <Image
              src="/pandaikids/nota-kilat-v3/products/bundle.png"
              width={1400}
              height={1400}
              alt="Bundle Nota Digital PandaiKids Tahun 3, 4 dan 5"
              sizes="(max-width: 760px) 90vw, 430px"
            />
          </div>

          <div className={styles.bundleCopyPremium}>
            <p className={styles.eyebrow}>BUNDLE LENGKAP</p>
            <h3>Tahun 3, 4 &amp; 5</h3>
            <p>
              Semua 12 modul digital dalam satu pembelian. Sesuai untuk keluarga
              yang mempunyai lebih daripada seorang anak atau mahu simpan untuk
              tahun seterusnya.
            </p>

            <div className={styles.bundleStats}>
              <span><strong>12</strong> modul digital</span>
              <span><strong>3</strong> tahun pembelajaran</span>
              <span><strong>RM12</strong> penjimatan</span>
            </div>
          </div>

          <div className={styles.bundlePricePremium}>
            <span>Harga bundle</span>
            <del>RM57</del>
            <strong>RM45</strong>
            <a href={ONPAY_URL}>Dapatkan bundle <b>→</b></a>
            <small>Bayaran sekali · Muat turun digital</small>
          </div>
        </article>
      </div>
    </section>
  );
}
