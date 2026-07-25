import styles from "./landing.module.css";

export default function Part9Footer() {
  return (
    <footer className={styles.part9Footer} aria-labelledby="part9-title">
      <div className={styles.part9Inner}>
        <div className={styles.part9Brand}>
          <img src="/assets/pandaikids-logo-colour.png" alt="PandaiKids.com" loading="lazy" decoding="async" />
          <h2 id="part9-title">Belajar Seronok, Faham Senang!</h2>
          <p>Nota digital KAFA yang membantu anak mengulang kaji dengan lebih ringkas, berwarna dan mudah difahami.</p>
        </div>
        <div className={styles.part9Help} hidden>
          <h3>Perlukan bantuan?</h3>
          <p>Hubungi kami jika ibu atau ayah mempunyai pertanyaan tentang pakej, pembayaran atau cara memuat turun nota.</p>
          <button className={styles.part9Whatsapp} type="button" disabled aria-describedby="whatsapp-status">WhatsApp Kami <span aria-hidden="true">→</span></button>
          <small id="whatsapp-status">Pautan WhatsApp rasmi belum tersedia dalam projek ini.</small>
        </div>
        <p className={styles.part9ProductNote}>Produk digital dalam format PDF. Tiada buku fizikal atau penghantaran melalui pos.</p>
        <nav className={styles.part9Links} aria-label="Pautan polisi" hidden />
        <p className={styles.part9Copyright}>© 2026 PandaiKids.com. Hak cipta terpelihara.</p>
      </div>
    </footer>
  );
}
