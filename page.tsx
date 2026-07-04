"use client";

import { useMemo, useState } from "react";

const lessons = [
  {
    subject: "Matematik",
    level: "Tahun 1",
    icon: "🔢",
    color: "sun",
    question: "Berapakah jumlah 8 + 5?",
    options: ["11", "12", "13", "15"],
    answer: "13",
    reward: 15,
  },
  {
    subject: "Bahasa Melayu",
    level: "Ejaan",
    icon: "📚",
    color: "berry",
    question: "Pilih perkataan yang dieja dengan betul.",
    options: ["Sekolah", "Skolah", "Sekula", "Sikolah"],
    answer: "Sekolah",
    reward: 10,
  },
  {
    subject: "Sains",
    level: "Alam Sekitar",
    icon: "🌱",
    color: "leaf",
    question: "Bahagian tumbuhan yang menyerap air ialah...",
    options: ["Daun", "Akar", "Bunga", "Buah"],
    answer: "Akar",
    reward: 15,
  },
  {
    subject: "Logik",
    level: "Cabaran Mini",
    icon: "🧩",
    color: "ocean",
    question: "Yang mana nombor paling besar?",
    options: ["17", "71", "27", "19"],
    answer: "71",
    reward: 20,
  },
];

const worlds = [
  { icon: "🏝️", title: "Pulau Nombor", text: "Latihan kira cepat", progress: 68 },
  { icon: "📖", title: "Kampung Bahasa", text: "Ejaan & perkataan", progress: 44 },
  { icon: "🔬", title: "Makmal Sains", text: "Eksperimen mudah", progress: 31 },
  { icon: "🏆", title: "Arena Pandi", text: "Cabaran harian", progress: 18 },
];

const missions = ["Jawab 3 soalan", "Kumpul 50 syiling", "Buka 1 badge baru"];

export default function Home() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState("");
  const [xp, setXp] = useState(40);
  const [coins, setCoins] = useState(185);
  const [hearts, setHearts] = useState(5);
  const [combo, setCombo] = useState(2);
  const [showWin, setShowWin] = useState(false);
  const [message, setMessage] = useState("Pandi tunggu kamu jawab soalan pertama! 🐼");

  const current = lessons[step];
  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;
  const lessonProgress = useMemo(() => Math.round(((step + 1) / lessons.length) * 100), [step]);

  function choose(option: string) {
    if (selected) return;
    setSelected(option);

    if (option === current.answer) {
      setXp((value) => value + current.reward);
      setCoins((value) => value + 12);
      setCombo((value) => value + 1);
      setShowWin(true);
      setMessage(`Mantap! +${current.reward} XP dan +12 syiling 🎉`);
      window.setTimeout(() => setShowWin(false), 1200);
    } else {
      setCombo(0);
      setHearts((value) => Math.max(0, value - 1));
      setMessage("Hampir betul. Cuba fikir sekali lagi, Pandi bantu! 💪");
    }
  }

  function nextQuestion() {
    setSelected("");
    setMessage("Soalan baru dibuka. Fokus dan pilih jawapan terbaik ✨");
    setStep((value) => (value + 1) % lessons.length);
  }

  return (
    <main className="pk-app">
      {showWin && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 22 }).map((_, index) => (
            <span key={index} style={{ "--i": index } as React.CSSProperties}>★</span>
          ))}
        </div>
      )}

      <div className="cloud cloud-a">☁️</div>
      <div className="cloud cloud-b">☁️</div>
      <div className="cloud cloud-c">☁️</div>
      <div className="orb orb-a" />
      <div className="orb orb-b" />

      <nav className="app-bar">
        <div className="brand-block">
          <div className="logo-face">🐼</div>
          <div>
            <strong>PandaiKids</strong>
            <span>Premium learning game</span>
          </div>
        </div>
        <div className="top-rewards">
          <span>❤️ {hearts}</span>
          <span>🪙 {coins}</span>
          <span>⚡ Level {level}</span>
        </div>
      </nav>

      <section className="hero-grid">
        <div className="hero-copy glass-card">
          <div className="live-chip">🚀 Sprint 5: Big Visual Upgrade</div>
          <h1>Belajar rasa macam main game.</h1>
          <p>
            Pandi bawa anak ke dunia pembelajaran interaktif dengan XP, syiling, badge, misi harian dan quiz yang lebih hidup.
          </p>
          <div className="hero-buttons">
            <a href="#play" className="btn btn-main">Mula Main Sekarang</a>
            <a href="#worlds" className="btn btn-soft">Lihat Dunia Belajar</a>
          </div>
          <div className="mini-proof">
            <span>🎮 App-like UI</span>
            <span>✨ Animasi</span>
            <span>📱 Mobile ready</span>
          </div>
        </div>

        <div className="pandi-console">
          <div className="console-top">
            <span>Today Mission</span>
            <strong>{lessonProgress}%</strong>
          </div>
          <div className="pandi-scene">
            <div className="sun">☀️</div>
            <div className="planet planet-one">🔢</div>
            <div className="planet planet-two">📚</div>
            <div className="pandi-hero" aria-label="Pandi mascot">
              <div className="pandi-ear left" />
              <div className="pandi-ear right" />
              <div className="pandi-head">
                <div className="pandi-eye left" />
                <div className="pandi-eye right" />
                <div className="pandi-cheek left" />
                <div className="pandi-cheek right" />
                <div className="pandi-nose" />
                <div className="pandi-mouth" />
                <div className="pandi-badge">P</div>
              </div>
              <div className="pandi-hand left">👋</div>
              <div className="pandi-hand right" />
            </div>
            <div className="speech-bubble">{message}</div>
          </div>
        </div>
      </section>

      <section className="dashboard-strip">
        <div className="dash-card xp-card">
          <span>XP Level</span>
          <strong>{xp} XP</strong>
          <div className="meter"><i style={{ width: `${levelProgress}%` }} /></div>
        </div>
        <div className="dash-card">
          <span>Combo</span>
          <strong>{combo}x 🔥</strong>
        </div>
        <div className="dash-card">
          <span>Lesson</span>
          <strong>{step + 1}/{lessons.length}</strong>
        </div>
        <div className="dash-card">
          <span>Badge</span>
          <strong>Rookie 🏅</strong>
        </div>
      </section>

      <section id="worlds" className="world-section">
        <div className="section-title">
          <span>🌈 Dunia Belajar</span>
          <h2>Pilih dunia, kumpul bintang.</h2>
        </div>
        <div className="world-grid">
          {worlds.map((world) => (
            <article className="world-card" key={world.title}>
              <div className="world-icon">{world.icon}</div>
              <h3>{world.title}</h3>
              <p>{world.text}</p>
              <div className="mini-meter"><i style={{ width: `${world.progress}%` }} /></div>
            </article>
          ))}
        </div>
      </section>

      <section id="play" className="play-layout">
        <aside className="mission-card">
          <span className="eyebrow">Misi Harian</span>
          <h3>Siapkan misi untuk buka hadiah.</h3>
          <ul>
            {missions.map((mission, index) => (
              <li key={mission}><b>{index + 1}</b>{mission}</li>
            ))}
          </ul>
          <div className="gift-box">🎁 Hadiah terkunci</div>
        </aside>

        <section className={`quiz-arena ${current.color}`}>
          <div className="quiz-head">
            <div>
              <span className="eyebrow">{current.icon} {current.subject} • {current.level}</span>
              <h2>{current.question}</h2>
            </div>
            <div className="reward-badge">+{current.reward} XP</div>
          </div>

          <div className="lesson-meter"><i style={{ width: `${lessonProgress}%` }} /></div>

          <div className="answer-grid">
            {current.options.map((option) => {
              const isCorrect = selected && option === current.answer;
              const isWrong = selected === option && option !== current.answer;
              return (
                <button
                  key={option}
                  onClick={() => choose(option)}
                  className={`answer-tile ${isCorrect ? "right" : ""} ${isWrong ? "nope" : ""}`}
                >
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          <div className="arena-footer">
            <p>{selected ? message : "Pilih satu jawapan untuk bantu Pandi."}</p>
            <button className="btn next" onClick={nextQuestion}>Soalan Seterusnya →</button>
          </div>
        </section>
      </section>
    </main>
  );
}
