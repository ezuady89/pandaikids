"use client";

import { useMemo, useState } from "react";

type Question = {
  id: number;
  subject: string;
  level: string;
  question: string;
  options: string[];
  answer: string;
  hint: string;
  fact: string;
};

const questions: Question[] = [
  {
    id: 1,
    subject: "Matematik",
    level: "Tahun 1",
    question: "Berapakah 4 + 3?",
    options: ["5", "6", "7", "8"],
    answer: "7",
    hint: "Kira 4 jari dahulu, kemudian tambah 3 lagi.",
    fact: "Hebat! 4 + 3 memang sama dengan 7.",
  },
  {
    id: 2,
    subject: "Bahasa Melayu",
    level: "Ejaan",
    question: "Pilih ejaan yang betul.",
    options: ["Sekolah", "Skolah", "Sekula", "Sikolah"],
    answer: "Sekolah",
    hint: "Perkataan ini bermula dengan 'Se'.",
    fact: "Betul! Ejaan yang tepat ialah Sekolah.",
  },
  {
    id: 3,
    subject: "Sains",
    level: "Alam Sekitar",
    question: "Haiwan manakah yang boleh terbang?",
    options: ["Kucing", "Burung", "Ikan", "Kambing"],
    answer: "Burung",
    hint: "Haiwan ini ada sayap dan suka berkicau.",
    fact: "Ya! Burung menggunakan sayap untuk terbang.",
  },
  {
    id: 4,
    subject: "Matematik",
    level: "Nombor",
    question: "Nombor manakah yang paling besar?",
    options: ["9", "12", "7", "10"],
    answer: "12",
    hint: "Cari nombor yang nilainya paling tinggi.",
    fact: "Pandai! 12 lebih besar daripada 9, 10 dan 7.",
  },
  {
    id: 5,
    subject: "Bahasa Melayu",
    level: "Perkataan",
    question: "Apakah lawan bagi perkataan 'besar'?",
    options: ["Tinggi", "Kecil", "Panjang", "Cepat"],
    answer: "Kecil",
    hint: "Besar lawannya bukan panjang, tetapi saiz yang lebih kecil.",
    fact: "Betul! Lawan bagi besar ialah kecil.",
  },
  {
    id: 6,
    subject: "Sains",
    level: "Tubuh Badan",
    question: "Kita menggunakan mata untuk apa?",
    options: ["Mendengar", "Melihat", "Makan", "Berjalan"],
    answer: "Melihat",
    hint: "Mata membantu kita nampak dunia sekeliling.",
    fact: "Tepat! Mata digunakan untuk melihat.",
  },
];

const worlds = [
  { icon: "🔢", title: "Math Quest", text: "Kira, padankan dan menang bintang.", color: "blue" },
  { icon: "📚", title: "Bahasa Land", text: "Ejaan, suku kata dan ayat mudah.", color: "pink" },
  { icon: "🌿", title: "Sains Safari", text: "Haiwan, tumbuhan dan dunia sekitar.", color: "green" },
];

const badges = ["Starter Pandi", "Jawab 3 Betul", "Fokus Hebat", "Misi Lengkap"];

export default function Home() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(120);
  const [streak, setStreak] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [pandiMood, setPandiMood] = useState("/pandi-wave.png");
  const [feedback, setFeedback] = useState("Hai! Pandi sedia teman kamu belajar hari ini 🐼");
  const [celebrate, setCelebrate] = useState(false);

  const current = questions[step];
  const progress = useMemo(() => Math.round((step / questions.length) * 100), [step]);
  const finalProgress = finished ? 100 : progress;
  const accuracy = correctCount + wrongCount === 0 ? 0 : Math.round((correctCount / (correctCount + wrongCount)) * 100);
  const level = Math.max(1, Math.floor(score / 50) + 1);

  function choose(option: string) {
    if (selected || finished) return;
    setSelected(option);
    setShowHint(false);

    if (option === current.answer) {
      setScore((value) => value + 10);
      setCoins((value) => value + 8);
      setStreak((value) => value + 1);
      setCorrectCount((value) => value + 1);
      setPandiMood("/pandi-excited.png");
      setFeedback(`Tahniah! ${current.fact} +10 XP dan +8 syiling 🎉`);
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 900);
    } else {
      setStreak(0);
      setWrongCount((value) => value + 1);
      setPandiMood("/pandi-think.png");
      setFeedback(`Tak apa. Jawapan sebenar ialah ${current.answer}. Jom cuba soalan seterusnya 💪`);
    }
  }

  function nextQuestion() {
    if (step + 1 >= questions.length) {
      setFinished(true);
      setPandiMood("/pandi-goodjob.png");
      setFeedback("Misi selesai! Pandi sangat bangga dengan usaha kamu 🏆");
      setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 1200);
      return;
    }

    setSelected("");
    setShowHint(false);
    setPandiMood("/pandi-focus.png");
    setFeedback("Soalan baru sudah muncul. Fokus ya! ✨");
    setStep((value) => value + 1);
  }

  function restartMission() {
    setStep(0);
    setSelected("");
    setScore(0);
    setCoins(120);
    setStreak(3);
    setCorrectCount(0);
    setWrongCount(0);
    setFinished(false);
    setShowHint(false);
    setPandiMood("/pandi-wave.png");
    setFeedback("Misi baru bermula! Pandi akan teman kamu belajar 🐼");
  }

  return (
    <main className="pk-page">
      {celebrate && <div className="confetti-layer" aria-hidden="true"><span>🎉</span><span>⭐</span><span>🪙</span><span>✨</span><span>🎊</span></div>}
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
          <span>⭐ Level {level}</span>
          <span>🪙 {coins}</span>
          <span>🔥 {streak}</span>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="tag">🚀 Sprint 6 • Quiz Game Progress</span>
          <h1>Belajar rasa macam main game.</h1>
          <p>
            Sprint 6 tambah sistem quiz yang lebih hidup: XP, syiling, streak, hint, progress, keputusan akhir dan ganjaran misi.
          </p>
          <div className="hero-actions">
            <a className="primary-btn" href="#quiz">Mula Quiz Sekarang</a>
            <a className="ghost-btn" href="#worlds">Lihat Dunia Belajar</a>
          </div>
          <div className="reward-row">
            {badges.map((item) => <span key={item}>🏅 {item}</span>)}
          </div>
        </div>

        <div className="hero-stage">
          <div className="stage-card main-pandi-card">
            <div className="spark star-one">⭐</div>
            <div className="spark star-two">✨</div>
            <img src="/pandi-main.png" alt="Pandi mascot" className="pandi-main" />
            <div className="speech-bubble">Jom lengkapkan misi!</div>
          </div>
          <div className="mini-panel xp-panel">
            <span>XP Hari Ini</span>
            <strong>{score} XP</strong>
          </div>
          <div className="mini-panel coin-panel">
            <span>Ketepatan</span>
            <strong>{accuracy}%</strong>
          </div>
        </div>
      </section>

      <section className="mission-strip">
        <div>
          <span>Misi Sprint 6</span>
          <strong>{finished ? "Misi lengkap — anak dapat lihat keputusan akhir" : `Soalan ${step + 1} daripada ${questions.length}`}</strong>
        </div>
        <div className="mission-progress">
          <div style={{ width: `${finalProgress}%` }} />
        </div>
        <b>{finalProgress}%</b>
      </section>

      <section id="worlds" className="worlds">
        {worlds.map((item) => (
          <article className={`world-card ${item.color}`} key={item.title}>
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
          <div className="stats-grid">
            <div><b>{correctCount}</b><small>Betul</small></div>
            <div><b>{wrongCount}</b><small>Salah</small></div>
            <div><b>{score}</b><small>XP</small></div>
          </div>
        </div>

        {!finished ? (
          <div className="quiz-card">
            <div className="quiz-header">
              <div>
                <span className="mini-label">{current.subject} • {current.level}</span>
                <h2>{current.question}</h2>
              </div>
              <div className="level-pill">Misi {step + 1}/{questions.length}</div>
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

            <div className="quiz-tools">
              <button onClick={() => setShowHint((value) => !value)} className="hint-btn">💡 Hint</button>
              <button onClick={nextQuestion} className="next-btn" disabled={!selected}>Teruskan Misi →</button>
            </div>
            {showHint && <div className="hint-box">{current.hint}</div>}
          </div>
        ) : (
          <div className="quiz-card result-card">
            <span className="mini-label">Keputusan Akhir</span>
            <h2>Tahniah! Misi selesai 🏆</h2>
            <p className="result-text">Kamu jawab {correctCount} daripada {questions.length} soalan dengan betul.</p>
            <div className="result-score">
              <div><b>{score}</b><small>Jumlah XP</small></div>
              <div><b>{coins}</b><small>Syiling</small></div>
              <div><b>{accuracy}%</b><small>Ketepatan</small></div>
            </div>
            <div className="badge-wall">
              <span>🏅 Starter Pandi</span>
              <span>⭐ Fokus Hebat</span>
              <span>🪙 Pemburu Syiling</span>
              <span>🏆 Misi Lengkap</span>
            </div>
            <button onClick={restartMission} className="next-btn">Main Semula</button>
          </div>
        )}
      </section>
    </main>
  );
}
