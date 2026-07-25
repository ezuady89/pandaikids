import styles from "./landing.module.css";

const steps = [
  {
    title: "Pilih pakej",
    body: "Pilih Tahun 3, 4, 5 atau Bundle mengikut tahun anak.",
  },
  {
    title: "Buat pembayaran",
    body: "Bayar sekali sahaja dengan selamat melalui OnPay.",
  },
  {
    title: "Terima nota digital",
    body: "Pautan muat turun diberikan selepas bayaran dan dihantar melalui e-mel.",
  },
];

export default function Part6HowToBuy() {
  return (
    <section className={styles.howToBuySection} aria-labelledby="how-to-buy-title">
      <div className={styles.howToBuyInner}>
        <div className={styles.howToBuyIntro}>
          <p className={styles.eyebrow}>MUDAH &amp; TERUS DAPAT</p>
          <h2 id="how-to-buy-title">Cara beli sangat mudah.</h2>
          <p>Selepas pembayaran, nota digital boleh terus dimuat turun dan dibuka melalui telefon.</p>
        </div>

        <ol className={styles.howToBuySteps}>
          {steps.map((step, index) => (
            <li key={step.title}>
              <span className={styles.howToBuyNumber} aria-hidden="true">{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.howToBuyMicrocopy} aria-label="Kelebihan pembayaran">
          <span>✓ Bayaran sekali sahaja</span>
          <span>✓ Tiada caj bulanan</span>
          <span>✓ Boleh dibuka melalui telefon</span>
        </div>

        <a className={styles.howToBuyCta} href="#pakej">
          Pilih Pakej Sekarang <span aria-hidden="true">→</span>
        </a>
        <p className={styles.howToBuyHelp}>Ada masalah membuka fail? Bantuan WhatsApp disediakan.</p>
      </div>
    </section>
  );
}
