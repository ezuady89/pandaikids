import Image from "next/image";
import styles from "./landing.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <Image
          src="/pandaikids/nota-kilat-v3/logo.webp"
          width={1100}
          height={233}
          alt="PandaiKids"
          className={styles.footerLogo}
        />
        <p>Belajar seronok, faham senang.</p>
        <div className={styles.footerLinks}>
          <a href="#subjek">Subjek</a>
          <a href="#contoh">Contoh</a>
          <a href="#pakej">Pakej</a>
          <a href="#faq">FAQ</a>
        </div>
        <small>© 2026 PandaiKids. Produk digital untuk kegunaan pembeli dan keluarga sendiri.</small>
      </div>
    </footer>
  );
}
