"use client";

import { useState } from "react";
import styles from "./landing.module.css";

const faqs = [
  ["Nota ini sesuai untuk tahun berapa?", "Nota PandaiKids disediakan untuk murid KAFA Tahun 3, Tahun 4 dan Tahun 5. Pilih pakej mengikut tahun anak atau Bundle untuk mendapatkan ketiga-tiganya."],
  ["Adakah nota ini merangkumi semua tajuk KAFA?", "Nota ini disusun berdasarkan tajuk utama dalam rujukan KAFA yang digunakan bagi subjek Aqidah, Ibadah, Sirah dan Adab. Ia membantu ulang kaji dengan lebih ringkas, tetapi tetap melengkapi—bukan menggantikan—buku teks dan pengajaran guru."],
  ["Ini buku fizikal atau nota digital?", "Ini ialah produk digital dalam format PDF. Tiada buku fizikal atau penghantaran melalui pos."],
  ["Boleh dibuka melalui telefon?", "Ya. Fail boleh dibuka melalui telefon, tablet, komputer atau laptop menggunakan aplikasi pembaca PDF."],
  ["Bagaimana nota diterima selepas pembayaran?", "Pautan muat turun tersedia selepas pembayaran dan turut dihantar melalui e-mel yang digunakan semasa membuat pesanan."],
  ["Boleh cetak nota ini?", "Ya. Fail PDF boleh digunakan secara digital atau dicetak untuk kegunaan pembelajaran anak sendiri."],
  ["Bayaran sekali atau setiap bulan?", "Bayaran hanya sekali sahaja. Tiada langganan dan tiada caj bulanan."],
  ["Apa perbezaan pakej satu tahun dengan Bundle?", "Pakej satu tahun menyediakan nota mengikut tahun yang dipilih. Bundle pula menyediakan bahan Tahun 3, Tahun 4 dan Tahun 5 dalam satu pembelian dengan harga lebih jimat."],
] as const;

export default function Part7Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={styles.faqSection} aria-labelledby="faq-title">
      <div className={styles.faqInner}>
        <p className={styles.eyebrow}>SOALAN LAZIM</p>
        <h2 id="faq-title">Masih ada yang ingin ditanya?</h2>
        <p className={styles.faqIntro}>Ini jawapan ringkas sebelum ibu dan ayah memilih pakej untuk anak.</p>

        <div className={styles.faqList}>
          {faqs.map(([question, answer], index) => {
            const isOpen = openIndex === index;
            const answerId = `faq-answer-${index}`;
            return (
              <div className={`${styles.faqItem}${isOpen ? ` ${styles.faqItemOpen}` : ""}`} key={question}>
                <button
                  className={styles.faqQuestion}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>{question}</span>
                  <span className={styles.faqIcon} aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
                <div id={answerId} className={`${styles.faqAnswer}${isOpen ? ` ${styles.faqAnswerOpen}` : ""}`} aria-hidden={!isOpen}>
                  <p>{answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        <p className={styles.faqCtaLead}>Sudah jelas? Pilih pakej yang sesuai untuk anak.</p>
        <a className={styles.faqCta} href="#pakej">Lihat Pakej Sekarang <span aria-hidden="true">→</span></a>
      </div>
    </section>
  );
}
