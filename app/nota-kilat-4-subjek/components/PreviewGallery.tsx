"use client";

import Image from "next/image";
import { useState } from "react";
import { subjects, type SubjectKey } from "../data";
import styles from "./landing.module.css";

export default function PreviewGallery() {
  const [activeKey, setActiveKey] = useState<SubjectKey>("aqidah");
  const activeSubject = subjects.find((subject) => subject.key === activeKey) ?? subjects[0];

  return (
    <section className={styles.previewSection} id="contoh">
      <div className={styles.container}>
        <div className={styles.previewHeader}>
          <div>
            <p className={styles.eyebrow}>LIHAT SEBELUM BELI</p>
            <h2>Bukan sekadar cover yang cantik.</h2>
            <p>
              Lihat contoh halaman sebenar untuk menilai susunan, ilustrasi dan
              gaya ulang kaji dalam modul PandaiKids.
            </p>
          </div>

          <div className={styles.previewTabs} role="tablist" aria-label="Pilih subjek">
            {subjects.map((subject) => (
              <button
                key={subject.key}
                type="button"
                role="tab"
                aria-selected={activeKey === subject.key}
                className={activeKey === subject.key ? styles.previewTabActive : undefined}
                data-accent={subject.accent}
                onClick={() => setActiveKey(subject.key)}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.previewPanel} data-accent={activeSubject.accent}>
          <div className={styles.previewCopy}>
            <span>{activeSubject.arabic}</span>
            <h3>{activeSubject.name}</h3>
            <p>{activeSubject.description}</p>
            <ul>
              <li>Isi disusun dalam bahagian kecil dan mudah dibaca</li>
              <li>Ilustrasi membantu anak memahami konteks</li>
              <li>Aktiviti dan soalan mengukuhkan ulang kaji</li>
            </ul>
            <a href="#pakej" className={styles.primaryButton}>
              Dapatkan pakej
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className={styles.previewPages}>
            {activeSubject.preview.map((image, index) => (
              <div key={image} className={styles.previewPage}>
                <Image
                  src={image}
                  width={760}
                  height={1140}
                  alt={`${activeSubject.name} contoh halaman ${index + 1}`}
                  sizes="(max-width: 800px) 46vw, 390px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
