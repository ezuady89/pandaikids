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
          <div className="part2-body-copy">
            <p className="part2-support-copy">Kadang-kadang ibu ayah baru sedar <strong>buku anak banyak dalam Jawi</strong> bila nak mula ulang kaji. Nota PandaiKids bantu susun isi penting dalam Rumi supaya anak lebih mudah faham.</p>
            <p>Kadang-kadang ibu ayah baru sedar buku anak banyak dalam Jawi. Nota PandaiKids bantu susun isi penting dalam Rumi supaya anak lebih mudah ulang kaji di rumah.</p>
            <p>Sebab itu Nota PandaiKids susun semula isi penting dalam Rumi — supaya anak lebih mudah faham, mudah ingat dan ibu ayah lebih senang bantu di rumah.</p>
          </div>
          <h2 id="part2-title">Buku teks KAFA memang lengkap.<br />Tapi ulang kaji harian perlukan cara yang lebih ringkas.</h2>
          <p>Buku teks KAFA/Jawi kekal menjadi rujukan utama di sekolah. PandaiKids membantu anak mengulang kaji isi penting dalam Rumi, berwarna dan mudah difahami — supaya masa yang tinggal sebelum UPKK dapat digunakan dengan lebih tersusun.</p>
        </div>
        <figure className="part2-reference-visual">
          <img
            src="/assets/part2-textbook-vs-nota.png"
            alt="Buku teks KAFA, buku terbuka dan nota PandaiKids pada telefon di atas meja"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <p className="part2-bridge">Sebab itu kami ringkaskan isi penting untuk ulang kaji harian.</p>
        <div className="part2-benefits-clean" aria-label="Tiga manfaat Nota Kilat">
          <div className="part2-benefit-card"><span aria-hidden="true">✓</span><strong>Dalam Rumi</strong><small>Mudah dibaca dan diingat.</small></div>
          <div className="part2-benefit-card"><span aria-hidden="true">✓</span><strong>Isi penting diringkaskan</strong><small>Tak perlu cari panjang-panjang.</small></div>
          <div className="part2-benefit-card"><span aria-hidden="true">✓</span><strong>Buka di telefon</strong><small>Ulang kaji bila ada masa.</small></div>
        </div>
        <div className="part2-benefits part2-benefits-final" aria-hidden="true">
          <p>✓ <span>Dalam Rumi</span> — Mudah faham untuk semua.</p>
          <p>✓ <span>Penuh gambar</span> — Anak lebih tertarik untuk belajar.</p>
          <p>✓ <span>Mudah ulang kaji</span> — Ringkas, padat dan senang ingat.</p>
        </div>
        <p className="part2-disclaimer">PandaiKids bukan menggantikan buku teks. Ia membantu anak ulang kaji dengan lebih mudah sebelum UPKK.</p>
        <div className="part2-benefits part2-benefits-legacy" aria-hidden="true">
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
