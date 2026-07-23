import styles from "./landing.module.css";

export default function MobileBuyBar() {
  return (
    <div className={styles.mobileBuyBar}>
      <div className={styles.mobilePromoPrice}>
        <small>Pakej satu tahun</small>
        <span><del>RM19</del><strong>RM12.90</strong></span>
      </div>
      <a href="#pakej">Pilih pakej</a>
    </div>
  );
}
