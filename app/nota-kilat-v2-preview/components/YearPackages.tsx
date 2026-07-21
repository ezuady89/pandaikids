import Image from "next/image";
import { years } from "../data";
import styles from "./landing.module.css";

const FEATURES = [
  "4 subjek: Aqidah, Ibadah, Sirah & Adab",
  "PDF Berwarna + Nota Kilat",
  "Uji Minda + Skema Jawapan",
  "Boleh dibuka di telefon, tablet & komputer",
  "Boleh dicetak sendiri",
];

const PURCHASE_REASSURANCE =
  "Bayaran sekali • PDF digital • Tiada caj bulanan • Muat turun selepas pembayaran";

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
                    src={`/pandaikids/nota-kilat-v3/products/tahun-${item.year}.webp`}
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

                <a
                  href={
                    item.year === 5
                      ? "https://naico.onpay.my/order/form/pandaikids-t5"
                      : "https://naico.onpay.my/order/form/pandaikids-t3-t4"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.packageBuyButton}
                >
                  Dapatkan {item.label} – RM19
                </a>

                <p className={styles.packageMicrocopy}>
                  {PURCHASE_REASSURANCE}
                </p>
              </div>
            </article>
          ))}
        </div>

        <article className={styles.bundleCardPremium}>
          <div className={styles.bundlePopular}>PALING BERBALOI</div>

          <div className={styles.bundleVisual}>
            <Image
              src="/pandaikids/nota-kilat-v3/products/bundle.webp"
              width={1400}
              height={1400}
              alt="Bundle Nota Digital PandaiKids Tahun 3, 4 dan 5"
              sizes="(max-width: 760px) 90vw, 430px"
            />
          </div>

          <div className={styles.bundleCopyPremium}>
            <div className={styles.bundleEyebrowRow}>
              <p className={styles.eyebrow}>BUNDLE LENGKAP</p>
              <span className={styles.bundleDigitalPill}>PDF DIGITAL</span>
            </div>

            <h3>Bundle 3 Tahun</h3>

            <ul className={styles.bundleFeatureList}>
              <li>Tahun 3 + Tahun 4 + Tahun 5</li>
              <li>Semua 12 modul</li>
              <li>Semua Nota Kilat</li>
              <li>Semua Uji Minda</li>
              <li>Semua Skema Jawapan</li>
              <li>Sesuai untuk adik-beradik atau simpanan sehingga Tahun 5</li>
            </ul>
          </div>

          <div className={styles.bundlePricePremium}>
            <span>Harga bundle</span>

            <del>RM57</del>

            <strong>RM45</strong>

            <span className={styles.bundleSaving}>Jimat RM12</span>

            <a
              href="https://naico.onpay.my/order/form/pandaikids-premium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dapatkan Bundle 3 Tahun – RM45
            </a>

            <small>{PURCHASE_REASSURANCE}</small>
          </div>
        </article>
      </div>
    </section>
  );
}
