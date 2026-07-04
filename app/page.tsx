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

const subjects = [
  { icon: "🔢", title: "Matematik", text: "Kira nombor dengan cara menyeronokkan." },
  { icon: "📚", title: "Bahasa Melayu", text: "Belajar ejaan, perkataan dan ayat mudah." },
  { icon: "🌱", title: "Sains", text: "Kenali dunia, haiwan dan alam sekitar." },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(120);
  const [streak, setStreak] = useState(3);
  const [feedback, setFeedback] = useState("Pandi sedia bantu kamu belajar! 🐼");

  const current = questions[step];
  const progress = useMemo(() => Math.round(((step + 1) / questions.length) * 100), [step]);

  function choose(option: string) {
    if (selected) return;
    setSelected(option);

    if (option === current.answer) {
      setScore((value) => value + 10);
      setCoins((value) => value + 5);
      setStreak((value) => value + 1);
      setFeedback("Hebat! Jawapan betul. +10 XP 🎉");
    } else {
      setStreak(0);
      setFeedback("Tak apa, cuba lagi. Pandi percaya kamu boleh! 💪");
    }
  }

  function nextQuestion() {
    setSelected("");
    setFeedback("Soalan baru! Fokus ya ✨");
    setStep((value) => (value + 1) % questions.length);
  }

  return (
    <main className="pk-page">
      <div className="sky-bubble bubble-one" />
      <div className="sky-bubble bubble-two" />
      <div className="sky-bubble bubble-three" />

      <nav className="topbar">
        <div className="brand">
          <div className="brand-mark">🐼</div>
          <div>
            <strong>PandaiKids</strong>
            <span>Belajar sambil bermain</span>
          </div>
        </div>
        <div className="nav-pills">
          <span>⭐ Level 1</span>
          <span>🪙 {coins}</span>
          <span>🔥 {streak}</span>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="tag">✨ Sprint 5 Premium UI</div>
          <h1>Belajar jadi seronok bersama Pandi.</h1>
          <p>
            Latihan interaktif untuk kanak-kanak dengan markah, syiling, XP dan animasi yang buat mereka rasa macam bermain game.
          </p>
          <div className="hero-actions">
            <a href="#quiz" className="primary-btn">Mula Belajar</a>
            <a href="#subjects" className="secondary-btn">Lihat Subjek</a>
          </div>
          <div className="trust-row">
            <span>✅ Mesra kanak-kanak</span>
            <span>✅ Mobile friendly</span>
            <span>✅ Gaya aplikasi</span>
          </div>
        </div>

        <div className="pandi-stage" aria-label="Pandi mascot">
          <div className="sparkle sparkle-a">⭐</div>
          <div className="sparkle sparkle-b">✨</div>
          <div className="pandi">
            <div className="ear left" />
            <div className="ear right" />
            <div className="face">
              <div className="eye left-eye" />
              <div className="eye right-eye" />
              <div className="nose" />
              <div className="smile" />
              <div className="badge">P</div>
            </div>
            <div className="paw left-paw" />
            <div className="paw right-paw" />
          </div>
          <div className="speech">Jom jawab soalan! 🚀</div>
        </div>
      </section>

      <section className="stats-panel">
        <div>
          <span>XP Hari Ini</span>
          <strong>{score} XP</strong>
        </div>
        <div>
          <span>Progress</span>
          <strong>{progress}%</strong>
        </div>
        <div>
          <span>Syiling</span>
          <strong>{coins}</strong>
        </div>
        <div>
          <span>Streak</span>
          <strong>{streak}🔥</strong>
        </div>
      </section>

      <section id="subjects" className="subjects">
        {subjects.map((item) => (
          <article className="subject-card" key={item.title}>
            <div className="subject-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>

      <section id="quiz" className="quiz-shell">
        <div className="quiz-card">
          <div className="quiz-header">
            <div>
              <span className="mini-label">{current.subject} • {current.level}</span>
              <h2>{current.question}</h2>
            </div>
            <div className="score-badge">+{score} XP</div>
          </div>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
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
                  {option}
                </button>
              );
            })}
          </div>

          <div className="feedback-row">
            <p>{feedback}</p>
            <button onClick={nextQuestion} className="next-btn">Soalan Seterusnya →</button>
          </div>
        </div>
      </section>
    </main>
  );
}
