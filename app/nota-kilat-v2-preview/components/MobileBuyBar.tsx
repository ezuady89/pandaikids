import styles from "./landing.module.css";

export default function MobileBuyBar() {
  return (
    <div className={styles.mobileBuyBar}>
      <div><small>Pakej satu tahun</small><strong>RM19</strong></div>
      <a href="#pakej">Pilih pakej</a>
    </div>
  );
}
