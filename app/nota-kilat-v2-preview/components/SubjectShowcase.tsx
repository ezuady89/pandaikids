import Image from "next/image";
import { coverPath, subjects } from "../data";
import styles from "./landing.module.css";

export default function SubjectShowcase() {
  return (
    <section className={styles.subjectSection} id="subjek">
      <div className={styles.sectionIntro}>
        <p className={styles.eyebrow}>EMPAT SUBJEK TERAS</p>
        <h2>Satu subjek. Satu fokus. Lebih mudah difahami.</h2>
        <p>
          Setiap subjek menggunakan identiti warna tersendiri supaya anak cepat
          mengenal, mengingat dan membuat ulang kaji.
        </p>
      </div>

      <div className={styles.subjectGrid}>
        {subjects.map((subject) => (
          <article
            key={subject.key}
            className={styles.subjectCard}
            data-accent={subject.accent}
          >
            <div className={styles.subjectCardThumbnail}>
              <Image
                src={coverPath(4, subject.key)}
                width={760}
                height={1140}
                alt={`Buku ${subject.name} Tahun 4`}
                sizes="(max-width: 980px) 32vw, 150px"
              />
            </div>

            <div className={styles.subjectCardBody}>
              <h3>{subject.name}</h3>
              <p>{subject.tagline}</p>
              <a
                href="#smart-preview"
                className={styles.subjectCardButton}
                aria-label={`Lihat contoh ${subject.name}`}
              >
                Lihat Contoh
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
