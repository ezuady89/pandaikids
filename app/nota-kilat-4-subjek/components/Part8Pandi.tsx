import styles from "./landing.module.css";

export default function Part8Pandi() {
  return (
    <section className={styles.pandiSection} aria-labelledby="pandi-title">
      <div className={styles.pandiInner}>
        <div className={styles.pandiCopy}>
          <p className={styles.eyebrow}>BELAJAR BERSAMA PANDI</p>
          <h2 id="pandi-title">Anak <span>tidak perlu belajar sendirian.</span></h2>
          <p className={styles.pandiLead}>Dalam setiap halaman, Pandi hadir membantu anak memahami pelajaran dengan cara yang lebih mesra, ringkas dan menyeronokkan.</p>
        </div>

        <div className={styles.pandiVisual}>
          <img src="/assets/pandi-landing-page-ensemble-transparent.webp" alt="Kumpulan watak Pandi sebagai kawan belajar, guru, ustaz, ayah, atok, pencerita dan pemberi semangat" loading="lazy" decoding="async" draggable={false} />
        </div>

        <div className={styles.pandiStory}>
          <h3>Seorang Pandi, pelbagai peranan.</h3>
          <p>Kadangkala dia menjadi kawan, kadangkala guru, ustaz, ayah atau atok—tetapi tujuannya tetap sama: membantu anak lebih mudah memahami KAFA.</p>
        </div>

        <blockquote className={styles.pandiQuote}>Bila anak mula faham, keyakinan untuk belajar akan datang semula.</blockquote>

        <div className={styles.pandiCtaBlock}>
          <h2>Bantu anak mulakan ulang kaji hari ini.</h2>
          <a className={styles.pandiCta} href="#pakej">Pilih Pakej Untuk Anak <span aria-hidden="true">→</span></a>
          <p className={styles.pandiMeta}>Bayaran sekali • Terus muat turun • Boleh dibuka melalui telefon</p>
          <p className={styles.pandiPromo}>Harga promosi bermula RM12.90</p>
        </div>
      </div>
    </section>
  );
}
