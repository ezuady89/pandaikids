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

      <div className={styles.subjectStories}>
        {subjects.map((subject, index) => (
          <article
            key={subject.key}
            className={styles.subjectStory}
            data-accent={subject.accent}
          >
            <div className={styles.storyInner}>
              <div className={styles.storyCopy}>
                <p className={styles.storyArabic}>{subject.arabic}</p>
                <h3>{subject.name}</h3>
                <p className={styles.storyTagline}>{subject.tagline}</p>
                <p className={styles.storyDescription}>{subject.description}</p>
                <div className={styles.storyPoints}>
                  <span>Nota ringkas</span>
                  <span>Fakta penting</span>
                  <span>Aktiviti ulang kaji</span>
                </div>
                <a href="#contoh">Lihat contoh {subject.name} →</a>
              </div>

              <div className={styles.storyVisual}>
                <div className={styles.previewSheetOne}>
                  <Image
                    src={subject.preview[0]}
                    width={760}
                    height={1140}
                    alt={`Contoh halaman ${subject.name}`}
                    sizes="(max-width: 800px) 44vw, 280px"
                  />
                </div>
                <div className={styles.subjectBook}>
                  <Image
                    src={coverPath(4, subject.key)}
                    width={760}
                    height={1140}
                    alt={`Buku ${subject.name} Tahun 4`}
                    sizes="(max-width: 800px) 52vw, 340px"
                  />
                </div>
                <div className={styles.previewSheetTwo}>
                  <Image
                    src={subject.preview[1]}
                    width={760}
                    height={1140}
                    alt={`Aktiviti ${subject.name}`}
                    sizes="(max-width: 800px) 40vw, 250px"
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
