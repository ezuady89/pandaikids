"use client";

import { useMemo, useState } from "react";

const questions = [
  {
    subject: "Matematik",
    level: "Tahun 1",
    question: "Berapakah 4 + 3?",
    options: ["5", "6", "7", "8"],
    answer: "7",
  },
  {
    subject: "Bahasa Melayu",
    level: "Ejaan",
    question: "Pilih ejaan yang betul.",
    options: ["Sekolah", "Skolah", "Sekula", "Sikolah"],
    answer: "Sekolah",
  },
  {
    subject: "Sains",
    level: "Alam Sekitar",
    question: "Haiwan manakah yang boleh terbang?",
    options: ["Kucing", "Burung", "Ikan", "Kambing"],
    answer: "Burung",
  },
];

const worlds = [
  { icon: "🔢", title: "Math Quest", text: "Kira, padankan dan menang bintang." },
  { icon: "📚", title: "Bahasa Land", text: "Ejaan, suku kata dan ayat mudah." },
  { icon: "🌿", title: "Sains Safari", text: "Haiwan, tumbuhan dan dunia sekitar." },
];

const rewards = ["⭐ Badge Harian", "🪙 Syiling Pandi", "🏆 Trofi Mingguan"];

export default function Home() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(120);
  const [streak, setStreak] = useState(3);
  const [pandiMood, setPandiMood] = useState("/pandi-wave.png");
  const [feedback, setFeedback] = useState("Hai! Pandi sedia teman kamu belajar hari ini 🐼");

  const current = questions[step];
  const progress = useMemo(() => Math.round(((step + 1) / questions.length) * 100), [step]);

  function choose(option: string) {
    if (selected) return;
    setSelected(option);

    if (option === current.answer) {
      setScore((value) => value + 10);
      setCoins((value) => value + 5);
      setStreak((value) => value + 1);
      setPandiMood("/pandi-excited.png");
      setFeedback("Tahniah! Jawapan betul. Pandi bangga dengan kamu! 🎉");
    } else {
      setStreak(0);
      setPandiMood("/pandi-think.png");
      setFeedback("Tak apa. Cuba fikir semula, Pandi akan bantu kamu 💪");
    }
  }

  function nextQuestion() {
    setSelected("");
    setPandiMood("/pandi-focus.png");
    setFeedback("Soalan baru sudah muncul. Fokus ya! ✨");
    setStep((value) => (value + 1) % questions.length);
  }

  return (
    <main className="pk-page">
      <div className="cloud cloud-a" />
      <div className="cloud cloud-b" />
      <div className="cloud cloud-c" />
      <div className="sun">☀️</div>

      <nav className="topbar">
        <div className="brand">
          <div className="brand-logo">P</div>
          <div>
            <strong>PandaiKids</strong>
            <span>Play • Learn • Grow</span>
          </div>
        </div>
        <div className="top-actions">
          <span>⭐ Level 1</span>
          <span>🪙 {coins}</span>
          <span>🔥 {streak}</span>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="tag">🚀 Sprint 5.2 • Pandi sebenar</span>
          <h1>Belajar rasa macam main game.</h1>
          <p>
            PandaiKids kini guna maskot Pandi yang sama seperti konsep asal: comel, ceria dan mesra kanak-kanak.
          </p>
          <div className="hero-actions">
            <a className="primary-btn" href="#quiz">Mula Misi Hari Ini</a>
            <a className="ghost-btn" href="#worlds">Lihat Dunia Belajar</a>
          </div>
          <div className="reward-row">
            {rewards.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>

        <div className="hero-stage">
          <div className="stage-card main-pandi-card">
            <div className="spark star-one">⭐</div>
            <div className="spark star-two">✨</div>
            <img src="/pandi-main.png" alt="Pandi mascot" className="pandi-main" />
            <div className="speech-bubble">Jom belajar sama-sama!</div>
          </div>
          <div className="mini-panel xp-panel">
            <span>XP Hari Ini</span>
            <strong>{score} XP</strong>
          </div>
          <div className="mini-panel coin-panel">
            <span>Syiling</span>
            <strong>{coins}</strong>
          </div>
        </div>
      </section>

      <section className="mission-strip">
        <div>
          <span>Misi hari ini</span>
          <strong>Lengkapkan 3 soalan untuk buka hadiah Pandi</strong>
        </div>
        <div className="mission-progress">
          <div style={{ width: `${progress}%` }} />
        </div>
        <b>{progress}%</b>
      </section>

      <section id="worlds" className="worlds">
        {worlds.map((item) => (
          <article className="world-card" key={item.title}>
            <div className="world-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <button>Buka Dunia</button>
          </article>
        ))}
      </section>

      <section id="quiz" className="quiz-zone">
        <div className="pandi-chat-card">
          <img src={pandiMood} alt="Pandi reaction" />
          <div>
            <span>Pandi kata</span>
            <p>{feedback}</p>
          </div>
        </div>

        <div className="quiz-card">
          <div className="quiz-header">
            <div>
              <span className="mini-label">{current.subject} • {current.level}</span>
              <h2>{current.question}</h2>
            </div>
            <div className="level-pill">Misi {step + 1}/3</div>
          </div>

          <div className="answers">
            {current.options.map((option) => {
              const isCorrect = selected && option === current.answer;
              const isWrong = selected === option && option !== current.answer;
              return (
                <button
                  key={option}
                  onClick={() => choose(option)}
                  className={`answer-btn ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                >
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          <button onClick={nextQuestion} className="next-btn">Teruskan Misi →</button>
        </div>
      </section>
    </main>
  );
}
