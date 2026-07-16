import Image from "next/image";
import { faqs, ONPAY_URL } from "../data";
import styles from "./landing.module.css";

export default function FaqSection() {
  return (
    <>
      <section className={styles.faqSection} id="faq">
        <div className={styles.faqLayout}>
          <div className={styles.faqIntro}>
            <p className={styles.eyebrow}>SOALAN BIASA</p>
            <h2>Sebelum buat pilihan.</h2>
            <p>Jawapan ringkas kepada perkara yang selalu ditanya tentang pakej PDF PandaiKids.</p>
          </div>

          <div className={styles.faqList}>
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalCtaGlow} aria-hidden="true" />
        <div className={styles.finalCtaCopy}>
          <p className={styles.eyebrow}>MULA HARI INI</p>
          <h2>Ringkaskan ulang kaji. Cerahkan perjalanan belajar.</h2>
          <p>Pilih tahun anak dan dapatkan empat subjek teras bermula RM19.</p>
          <a href={ONPAY_URL} className={styles.finalButton}>
            Pilih pakej sekarang
            <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className={styles.finalMascot}>
          <Image
            src="/pandaikids/nota-kilat-v3/mascot/pandi-book.webp"
            width={760}
            height={760}
            alt="Pandi memegang buku"
            sizes="(max-width: 760px) 240px, 360px"
          />
        </div>
      </section>
    </>
  );
}
