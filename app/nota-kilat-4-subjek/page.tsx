import type { Metadata } from "next";
import "./landing-legacy.module.css";
import Part3Preview from "./components/part3-preview";
import Part6HowToBuy from "./components/Part6HowToBuy";
import Part7Faq from "./components/Part7Faq";
import Part8Pandi from "./components/Part8Pandi";
import Part9Footer from "./components/Part9Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import YearPackages from "./components/YearPackages";
import NotaKilatAnalytics from "./NotaKilatAnalytics";
import UrgencyStrip from "./UrgencyStrip";

export const metadata: Metadata = {
  title: "Nota Kilat PandaiKids | Ulang Kaji KAFA Lebih Mudah",
  description:
    "Nota digital ringkas dan berwarna untuk membantu anak Darjah 3, 4 dan 5 mengulang kaji KAFA dengan lebih mudah.",
};

export default function NotaKilat4SubjekPage() {
  return (
    <main className="notaKilatLanding">
      {/* Bahagian 1 — Hero ibu dan anak */}
      <section className="hero" aria-labelledby="hero-title">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="PandaiKids, kembali ke atas">
            <img src="/assets/pandaikids-logo.png" alt="PandaiKids.com" />
          </a>
          <button className="menu" type="button" aria-label="Buka menu">
            <span />
            <span />
            <span />
          </button>
        </header>

        <div className="hero-copy" id="top">
          <p className="hero-kicker">NOTA KILAT KAFA</p>
          <h1 id="hero-title">Anak Susah<br />Faham<br /><em>KAFA?</em></h1>
          <p className="hero-lead">
            Bantu anak<br />
            <strong>bina semula keyakinan</strong><br />
            dengan nota yang ringkas,<br />
            berwarna dan<br />
            mudah difahami.
          </p>
        </div>

        <div className="hero-visual" role="img" aria-label="Ibu bertudung menemani anak perempuan yang sedang berusaha memahami buku KAFA" />

        <div className="hero-action">
          <a className="primary-cta" href="#contoh-nota">Lihat Sampel Nota Percuma <span aria-hidden="true">→</span></a>
          <UrgencyStrip />
          <p className="hero-price-note">4 subjek digital • Bermula RM12.90 • Bayaran sekali</p>
          <p>✓ Boleh dibuka terus di telefon&nbsp;&nbsp; ✓ Tidak perlu daftar</p>
        </div>
      </section>

      {/* Bahagian 2 — Buku teks dan nota yang lebih ringkas */}
      <section className="part2-section" aria-labelledby="part2-title">
        <div className="part2-copy">
          <p className="section-kicker">BUKU TEKS TETAP PENTING</p>
          <h2 id="part2-title">Tapi ulang kaji perlukan<br />cara yang <em>lebih ringkas.</em></h2>
          <p>Buku teks membantu anak belajar dengan lengkap. Nota Kilat pula membantu anak mengulang kaji isi penting dengan lebih cepat dan mudah.</p>
        </div>
        <img
          src="/assets/part2-textbook-phone.png"
          alt="Buku KAFA Aqidah Tahun 5 dan telefon yang memaparkan Nota Adab pada stand"
          loading="lazy"
          decoding="async"
        />
        <div className="part2-benefits" aria-label="Tiga manfaat Nota Kilat">
          <p>✓ <span>Ringkas kepada isi penting</span></p>
          <p>✓ <span>Berwarna dan mudah difahami</span></p>
          <p>✓ <span>Boleh dibuka terus di telefon</span></p>
        </div>
        <a className="secondary-cta" href="#contoh-nota">Lihat Contoh Nota <span aria-hidden="true">→</span></a>
      </section>

      {/* Bahagian 3 & 4 — Penerangan produk dan SmartPreview */}
      <Part3Preview />

      {/* Bahagian 5 — Pakej, harga promosi dan countdown */}
      <YearPackages />

      {/* Bahagian 6 — Cara beli dan terima fail */}
      <Part6HowToBuy />

      {/* Bahagian 7 — Soalan lazim */}
      <Part7Faq />

      {/* Bahagian 8 — Penutup emosi bersama Pandi */}
      <Part8Pandi />
      <Part9Footer />
      <FloatingWhatsApp />
      <NotaKilatAnalytics />
    </main>
  );
}
