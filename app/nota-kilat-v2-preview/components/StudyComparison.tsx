import Image from "next/image";
import studyComparisonImage from "../assets/study-comparison-final.webp";
import styles from "./StudyComparison.module.css";

const comparisonItems = [
  {
    icon: "📚",
    title: "Buku Teks KAFA",
    points: [
      "Kandungan lengkap",
      "Bacaan lebih panjang",
      "Rujukan pembelajaran harian",
    ],
    tone: "textbook",
  },
  {
    icon: "📱",
    title: "PandaiKids Nota Digital",
    points: [
      "Isi penting disusun semula",
      "Berwarna dan mudah difahami",
      "Sesuai untuk ulang kaji pantas",
    ],
    tone: "digital",
  },
] as const;

export default function StudyComparison() {
  return (
    <section className={styles.section} aria-labelledby="study-comparison-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="study-comparison-title">
            Anak masih ulang kaji menggunakan buku teks sahaja?
          </h2>
          <p>
            Buku teks KAFA sangat penting. Tetapi apabila peperiksaan semakin
            hampir, anak juga perlukan nota ringkas untuk mengulang kaji dengan
            lebih cepat.
          </p>
        </header>

        <div className={styles.visualWrap}>
          <figure className={styles.visual}>
            <Image
              src={studyComparisonImage}
              alt="Perbandingan buku teks KAFA dengan nota digital PandaiKids Aqidah Tahun 5"
              sizes="(max-width: 640px) calc(100vw - 24px), 560px"
            />
          </figure>

          <p className={styles.visualLabel}>Contoh: Aqidah Tahun 5</p>
        </div>

        <div className={styles.grid}>
          {comparisonItems.map((item) => (
            <article
              key={item.title}
              className={styles.card}
              data-tone={item.tone}
            >
              <div className={styles.cardTitle}>
                <span aria-hidden="true">{item.icon}</span>
                <h3>{item.title}</h3>
              </div>

              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className={styles.supporting}>
          Kandungan buku teks yang panjang disusun semula menjadi nota sekitar
          25 halaman untuk ulang kaji yang lebih cepat.
        </p>

        <p className={styles.note}>
          PandaiKids melengkapkan buku teks, bukan menggantikannya.
        </p>
      </div>
    </section>
  );
}
