import Image from "next/image";
import { coverPath, ONPAY_URL, subjects, years } from "../data";
import styles from "./landing.module.css";

export default function YearPackages() {
  return (
    <section className={styles.packageSection} id="pakej">
      <div className={styles.container}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>PILIH PAKEJ</p>
          <h2>Pilih ikut tahun anak.</h2>
          <p>Satu harga yang jelas. Empat subjek teras dalam setiap pakej.</p>
        </div>

        <div className={styles.packageGrid}>
          {years.map((item) => (
            <article className={styles.packageCard} key={item.year}>
              <div className={styles.packageBadge}>{item.badge}</div>
              <div className={styles.packageBooks}>
                {subjects.map((subject, index) => (
                  <div
                    key={subject.key}
                    className={styles.packageBook}
                    style={{
                      transform: `translateX(${(index - 1.5) * 26}px) rotate(${(index - 1.5) * 4}deg)`,
                      zIndex: index + 1,
                    }}
                  >
                    <Image
                      src={coverPath(item.year, subject.key)}
                      width={760}
                      height={1140}
                      alt={`${subject.name} ${item.label}`}
                      sizes="(max-width: 760px) 22vw, 118px"
                    />
                  </div>
                ))}
              </div>

              <div className={styles.packageBody}>
                <p className={styles.packageLabel}>Pakej 4 subjek teras</p>
                <h3>{item.label}</h3>
                <p>{item.description}</p>
                <div className={styles.packageFeatures}>
                  <span>Aqidah</span>
                  <span>Ibadah</span>
                  <span>Sirah</span>
                  <span>Adab</span>
                </div>
                <div className={styles.packagePrice}>
                  <del>{item.oldPrice}</del>
                  <strong>{item.price}</strong>
                  <small>bayaran sekali</small>
                </div>
                <a href={ONPAY_URL} className={styles.primaryButton}>
                  Beli {item.label}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <article className={styles.bundleCard}>
          <div className={styles.bundleMascot}>
            <Image
              src="/pandaikids/nota-kilat-v3/mascot/pandi-point.webp"
              width={760}
              height={760}
              alt="Pandi menunjukkan pakej bundle"
              sizes="(max-width: 760px) 210px, 300px"
            />
          </div>
          <div className={styles.bundleCopy}>
            <p className={styles.eyebrow}>PALING JIMAT</p>
            <h3>Bundle Tahun 3, 4 &amp; 5</h3>
            <p>
              Semua 12 modul: empat subjek untuk setiap tahun. Sesuai untuk keluarga
              yang mempunyai lebih daripada seorang anak atau mahu simpan untuk tahun seterusnya.
            </p>
          </div>
          <div className={styles.bundlePrice}>
            <del>RM57</del>
            <strong>RM45</strong>
            <a href={ONPAY_URL}>Dapatkan bundle →</a>
          </div>
        </article>
      </div>
    </section>
  );
}
