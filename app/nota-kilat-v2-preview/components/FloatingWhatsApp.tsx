import styles from "./FloatingWhatsApp.module.css";

const WHATSAPP_URL =
  "https://wa.me/60136867931?text=Assalamualaikum.%20Saya%20ingin%20bertanya%20tentang%20Nota%20Kilat%20PandaiKids.";

export default function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi Admin PandaiKids melalui WhatsApp"
      className={styles.button}
    >
      <span className={styles.icon} aria-hidden="true">
        💬
      </span>

      <span className={styles.text}>
        <strong>WhatsApp Kami</strong>
      </span>
    </a>
  );
}
