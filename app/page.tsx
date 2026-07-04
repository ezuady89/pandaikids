"use client";

import { useMemo, useState } from "react";

const missions = [
  {
    subject: "Matematik",
    chapter: "Nombor Mudah",
    question: "Berapakah 4 + 3?",
    options: ["5", "6", "7", "8"],
    answer: "7",
  },
  {
    subject: "Bahasa Melayu",
    chapter: "Ejaan Betul",
    question: "Pilih ejaan yang betul.",
    options: ["Sekolah", "Skolah", "Sekula", "Sikolah"],
    answer: "Sekolah",
  },
  {
    subject: "Sains",
    chapter: "Dunia Haiwan",
    question: "Haiwan manakah yang boleh terbang?",
    options: ["Kucing", "Burung", "Ikan", "Kambing"],
    answer: "Burung",
  },
];

const worlds = [
  { icon: "🔢", name: "Math Quest", detail: "Kira cepat, kumpul bintang dan naik level." },
  { icon: "📚", name: "Bahasa Land", detail: "Ejaan, suku kata dan perkataan harian." },
  { icon: "🌿", name: "Sains Safari", detail: "Kenal haiwan, tumbuhan dan dunia sekitar." },
];

const habits = ["5 minit sehari", "Hadiah selepas misi", "Laporan ibu bapa"];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(180);
  const [stars, setStars] = useState(3);
  const [mood, setMood] = useState("/pandi-wave.png");
  const [message, setMessage] = useState("Hai! Saya Pandi. Jom belajar sambil main game!");

  const mission = missions[index];
  const progress = useMemo(() => Math.round(((index + 1) / missions.length) * 100), [index]);

  function pick(option: string) {
    if (selected) return;
    setSelected(option);

    if (option === mission.answer) {
      setXp((value) => value + 20);
      setCoins((value) => value + 10);
      setStars((value) => value + 1);
      setMood("/pandi-excited.png");
      setMessage("Mantap! Jawapan betul. Pandi bangga dengan awak! 🎉");
    } else {
      setMood("/pandi-think.png");
      setMessage("Tak apa. Cuba tengok pilihan jawapan sekali lagi. Pandi bantu ya 💪");
    }
  }

  function next() {
    setSelected("");
    setMood("/pandi-focus.png");
    setMessage("Fokus misi seterusnya. Awak makin hebat!");
    setIndex((value) => (value + 1) % missions.length);
  }

  return (
    <main className="pk-shell">
      <div className="sky-orb orb-one" />
      <div className="sky-orb orb-two" />
      <div className="moving-cloud cloud-one" />
      <div className="moving-cloud cloud-two" />
      <div className="moving-cloud cloud-three" />

      <header className="app-header">
        <div className="brand-lockup">
          <div className="brand-badge">P</div>
          <div>
            <p>PandaiKids</p>
            <span>Belajar • Main • Berkembang</span>
          </div>
        </div>
        <div className="player-stats">
          <span>⭐ {stars}</span>
          <span>🪙 {coins}</span>
          <span>⚡ {xp} XP</span>
        </div>
      </header>

      <section className="hero-grid">
        <div className="hero-copy">
          <div className="notice-pill">✨ Sprint 6 • Pandi Visual Rebuild</div>
          <h1>Belajar jadi seronok bersama Pandi.</h1>
          <p>
            Pengalaman baru PandaiKids dengan maskot Pandi sebenar, dunia belajar yang ceria,
            sistem XP, syiling dan misi harian seperti aplikasi pendidikan premium.
          </p>
          <div className="cta-row">
            <a href="#mission" className="main-cta">Mula Belajar</a>
            <a href="#worlds" className="secondary-cta">Lihat Dunia</a>
          </div>
          <div className="habit-row">
            {habits.map((item) => <span key={item}>✓ {item}</span>)}
          </div>
        </div>

        <div className="pandi-showcase">
          <div className="showcase-bg" />
          <div className="spark spark-a">⭐</div>
          <div className="spark spark-b">✨</div>
          <div className="spark spark-c">💙</div>
          <img className="pandi-hero-img" src="/pandi-main.png" alt="Pandi mascot" />
          <div className="speech-card">Jom jadi pandai hari ini!</div>
          <div className="floating-card float-left">
            <span>Level</span>
            <b>1</b>
          </div>
          <div className="floating-card float-right">
            <span>Progress</span>
            <b>{progress}%</b>
          </div>
        </div>
      </section>

      <section className="mission-bar">
        <div>
          <span>Misi hari ini</span>
          <strong>Selesaikan 3 soalan untuk buka hadiah Pandi</strong>
        </div>
        <div className="bar-track"><div style={{ width: `${progress}%` }} /></div>
        <b>{progress}%</b>
      </section>

      <section id="worlds" className="world-grid">
        {worlds.map((world) => (
          <article key={world.name} className="world-tile">
            <div className="world-emoji">{world.icon}</div>
            <h3>{world.name}</h3>
            <p>{world.detail}</p>
            <button>Masuk Dunia</button>
          </article>
        ))}
      </section>

      <section id="mission" className="learn-panel">
        <aside className="coach-card">
          <div className="coach-frame">
            <img src={mood} alt="Reaksi Pandi" />
          </div>
          <span>Pandi kata</span>
          <p>{message}</p>
        </aside>

        <section className="question-card">
          <div className="question-top">
            <div>
              <span>{mission.subject} • {mission.chapter}</span>
              <h2>{mission.question}</h2>
            </div>
            <div className="mission-pill">Misi {index + 1}/3</div>
          </div>

          <div className="answer-grid">
            {mission.options.map((option) => {
              const correct = selected && option === mission.answer;
              const wrong = selected === option && option !== mission.answer;
              return (
                <button
                  key={option}
                  onClick={() => pick(option)}
                  className={`answer-option ${correct ? "is-correct" : ""} ${wrong ? "is-wrong" : ""}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <button className="next-mission" onClick={next}>Teruskan Misi →</button>
        </section>
      </section>
    </main>
  );
}
