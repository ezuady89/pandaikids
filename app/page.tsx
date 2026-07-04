"use client";

import { useEffect, useMemo, useState } from "react";

type Question = {
  subject: string;
  level: string;
  question: string;
  options: string[];
  answer: string;
  hint: string;
};

type SaveData = {
  xp: number;
  coins: number;
  level: number;
  streak: number;
  bestScore: number;
  badges: string[];
  avatar: string;
  chestReady: boolean;
};

const questions: Question[] = [
  { subject: "Matematik", level: "Tahun 1", question: "Berapakah 4 + 3?", options: ["5", "6", "7", "8"], answer: "7", hint: "Kira 4 jari, kemudian tambah 3 jari lagi." },
  { subject: "Bahasa Melayu", level: "Ejaan", question: "Pilih ejaan yang betul.", options: ["Sekolah", "Skolah", "Sekula", "Sikolah"], answer: "Sekolah", hint: "Perkataan ini bermula dengan 'Se' dan berakhir dengan 'lah'." },
  { subject: "Sains", level: "Alam Sekitar", question: "Haiwan manakah yang boleh terbang?", options: ["Kucing", "Burung", "Ikan", "Kambing"], answer: "Burung", hint: "Haiwan ini ada sayap dan suka hinggap di pokok." },
  { subject: "Matematik", level: "Nombor", question: "Nombor selepas 9 ialah?", options: ["8", "10", "11", "7"], answer: "10", hint: "Selepas 9, kita mula nombor dua digit pertama." },
  { subject: "Sains", level: "Tubuh Badan", question: "Kita guna apa untuk melihat?", options: ["Telinga", "Mata", "Kaki", "Mulut"], answer: "Mata", hint: "Organ ini berada di muka dan kita kelip setiap hari." },
  { subject: "Bahasa Melayu", level: "Perkataan", question: "Pilih perkataan lawan bagi 'besar'.", options: ["Tinggi", "Kecil", "Panjang", "Bulat"], answer: "Kecil", hint: "Lawan besar ialah sesuatu yang tidak besar." },
];

const defaultSave: SaveData = {
  xp: 40,
  coins: 120,
  level: 1,
  streak: 3,
  bestScore: 0,
  badges: ["Murid Ceria"],
  avatar: "/pandi-main.png",
  chestReady: false,
};

const rewardShop = [
  { name: "Pandi Wave", img: "/pandi-wave.png", price: 80 },
  { name: "Pandi Focus", img: "/pandi-focus.png", price: 120 },
  { name: "Pandi Happy", img: "/pandi-happy.png", price: 160 },
];

const badgeRules = ["Murid Ceria", "Jawapan Tepat", "Streak Hebat", "Pemburu XP", "Juara Mini", "Murid Faham" ];

const aiNotes: Record<string, { explain: string; miniLesson: string; review: string }> = {
  "7": {
    explain: "4 + 3 bermaksud mula dengan 4, kemudian tambah 3 lagi. Jadi kiraannya 5, 6, 7.",
    miniLesson: "Cara mudah: lukis 4 bulatan, kemudian tambah 3 bulatan. Kira semua bulatan itu.",
    review: "Latihan ulang kaji: cuba kira 5 + 2 pula. Jawapannya juga 7."
  },
  "Sekolah": {
    explain: "Ejaan yang betul ialah 'Sekolah'. Bunyi awalnya 'Se', bukan 'Sko'.",
    miniLesson: "Pandi cadang baca perlahan-lahan: Se-ko-lah. Pecahkan kepada suku kata supaya anak lebih mudah ingat.",
    review: "Latihan ulang kaji: sebut dan tulis 'sekolah' sebanyak 3 kali."
  },
  "Burung": {
    explain: "Burung boleh terbang kerana mempunyai sayap. Tidak semua haiwan ada sayap.",
    miniLesson: "Perhatikan ciri haiwan: sayap membantu terbang, sirip membantu berenang, kaki membantu berjalan.",
    review: "Latihan ulang kaji: namakan 2 haiwan lain yang boleh terbang."
  },
  "10": {
    explain: "Nombor selepas 9 ialah 10. Selepas 9, nombor mula menjadi dua digit.",
    miniLesson: "Susunan nombor ialah 7, 8, 9, 10, 11. Jadi selepas 9 datang 10.",
    review: "Latihan ulang kaji: sebut nombor 1 hingga 10 dengan kuat."
  },
  "Mata": {
    explain: "Kita menggunakan mata untuk melihat. Telinga untuk mendengar, kaki untuk berjalan dan mulut untuk bercakap atau makan.",
    miniLesson: "Padankan anggota badan dengan fungsi: mata-melihat, telinga-mendengar, hidung-menghidu.",
    review: "Latihan ulang kaji: sentuh mata, telinga dan hidung sambil sebut fungsinya."
  },
  "Kecil": {
    explain: "Lawan bagi besar ialah kecil. Perkataan lawan mempunyai maksud bertentangan.",
    miniLesson: "Contoh lain: tinggi lawannya rendah, panjang lawannya pendek, banyak lawannya sedikit.",
    review: "Latihan ulang kaji: cari 3 benda besar dan 3 benda kecil di rumah."
  }
};

function getAiCoach(question: Question, picked: string) {
  const note = aiNotes[question.answer];
  if (!note) return "Pandi akan bantu pecahkan soalan kepada langkah kecil supaya lebih mudah faham.";
  if (picked === question.answer) return `Betul! ${note.explain} ${note.review}`;
  return `Jawapan kamu ialah '${picked}'. Jawapan sebenar ialah '${question.answer}'. ${note.explain} ${note.miniLesson}`;
}


export default function Home() {
  const [save, setSave] = useState<SaveData>(defaultSave);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState("Hai! Pandi dah buka Command Center belajar hari ini 🐼");
  const [pandiMood, setPandiMood] = useState("/pandi-wave.png");
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [chestOpen, setChestOpen] = useState(false);
  const [aiCoach, setAiCoach] = useState("Pilih jawapan. Lepas itu Pandi akan terangkan kenapa jawapan betul atau salah.");
  const [reviewList, setReviewList] = useState<string[]>([]);
  const [focusSkill, setFocusSkill] = useState("Belum ada kelemahan dikesan");
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [parentPin, setParentPin] = useState("");
  const [activeChild, setActiveChild] = useState("Aisyah");
  const [dailyGoal, setDailyGoal] = useState(20);
  const [reportReady, setReportReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem("pandaikids-sprint9-save");
    if (raw) {
      try { setSave({ ...defaultSave, ...JSON.parse(raw) }); } catch {}
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("pandaikids-sprint9-save", JSON.stringify(save));
  }, [save]);

  const current = questions[step];
  const missionProgress = useMemo(() => Math.round(((step + (selected ? 1 : 0)) / questions.length) * 100), [step, selected]);
  const levelProgress = save.xp % 100;
  const accuracy = questions.length ? Math.round((score / (questions.length * 10)) * 100) : 0;
  const weeklyMinutes = [12, 18, 15, 22, 28, 20, Math.max(10, step * 6 + score / 5)];
  const weeklyLabels = ["Isn", "Sel", "Rab", "Kha", "Jum", "Sab", "Ahd"];
  const parentSummary = useMemo(() => {
    const weak = reviewList.length ? reviewList.join(", ") : "Belum dikesan";
    const status = accuracy >= 70 ? "Sangat baik" : selected ? "Perlu bimbingan lembut" : "Sedang belajar";
    return { weak, status, minutes: weeklyMinutes.reduce((a, b) => a + b, 0) };
  }, [accuracy, reviewList, selected]);

  function awardBadge(next: SaveData, badge: string) {
    if (!next.badges.includes(badge)) next.badges = [...next.badges, badge];
  }

  function choose(option: string) {
    if (selected || showResult || hearts <= 0) return;
    setSelected(option);
    const coachText = getAiCoach(current, option);
    setAiCoach(coachText);

    if (option === current.answer) {
      const bonus = combo >= 2 ? 5 : 0;
      const xpGain = 15 + bonus;
      const coinGain = 10 + bonus;
      const nextXp = save.xp + xpGain;
      const newLevel = Math.floor(nextXp / 100) + 1;
      const nextCombo = combo + 1;
      const nextScore = score + 10;

      setScore(nextScore);
      setCombo(nextCombo);
      setPandiMood("/pandi-excited.png");
      setFeedback(bonus ? `Combo x${nextCombo}! +${xpGain} XP dan +${coinGain} coin 🎉` : `Betul! +${xpGain} XP dan +${coinGain} coin 🎉`);

      setSave((old) => {
        const next: SaveData = {
          ...old,
          xp: nextXp,
          coins: old.coins + coinGain,
          level: newLevel,
          streak: old.streak + 1,
          bestScore: Math.max(old.bestScore, nextScore),
          chestReady: nextScore >= 40 || old.chestReady,
        };
        if (nextScore >= 20) awardBadge(next, "Jawapan Tepat");
        if (nextCombo >= 3) awardBadge(next, "Streak Hebat");
        if (next.xp >= 150) awardBadge(next, "Pemburu XP");
        if (nextScore >= 50) awardBadge(next, "Juara Mini");
        if (nextScore >= 30 && nextCombo >= 2) awardBadge(next, "Murid Faham");
        if (newLevel > old.level) {
          setLevelUp(true);
          setTimeout(() => setLevelUp(false), 1800);
        }
        return next;
      });
    } else {
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      setCombo(0);
      setPandiMood("/pandi-think.png");
      setFeedback(nextHearts > 0 ? "Tak apa. Pandi bagi hint, cuba lagi misi seterusnya 💪" : "Nyawa habis. Rehat sekejap, kemudian main semula ❤️");
      setReviewList((old) => Array.from(new Set([...old, current.subject])).slice(-3));
      setFocusSkill(`${current.subject} • ${current.level}`);
      setSave((old) => ({ ...old, streak: 0 }));
    }
  }

  function nextQuestion() {
    setSelected("");
    setShowHint(false);
    setPandiMood("/pandi-focus.png");
    setFeedback("Soalan baru sudah muncul. Fokus ya! ✨");
    setAiCoach("Baca soalan perlahan-lahan. Pandi akan beri penerangan selepas kamu jawab.");

    if (step >= questions.length - 1 || hearts <= 0) {
      setShowResult(true);
      return;
    }
    setStep((value) => value + 1);
  }

  function restart() {
    setStep(0);
    setSelected("");
    setScore(0);
    setHearts(3);
    setCombo(0);
    setShowHint(false);
    setShowResult(false);
    setChestOpen(false);
    setPandiMood("/pandi-wave.png");
    setFeedback("Misi baru bermula. Pandi yakin kamu boleh! 🚀");
    setAiCoach("Pilih jawapan. Lepas itu Pandi akan terangkan kenapa jawapan betul atau salah.");
    setReviewList([]);
    setFocusSkill("Belum ada kelemahan dikesan");
  }

  function buyAvatar(item: typeof rewardShop[number]) {
    if (save.coins < item.price) {
      setFeedback("Coin belum cukup. Jawab lebih banyak soalan untuk kumpul coin 🪙");
      setPandiMood("/pandi-sad.png");
      return;
    }
    setSave((old) => ({ ...old, coins: old.coins - item.price, avatar: item.img }));
    setPandiMood(item.img);
    setFeedback(`${item.name} berjaya dibuka! Avatar Pandi sudah bertukar ✨`);
  }

  function openChest() {
    if (!save.chestReady) return;
    setChestOpen(true);
    setSave((old) => {
      const next = { ...old, coins: old.coins + 50, xp: old.xp + 35, chestReady: false };
      if (!next.badges.includes("Pembuka Hadiah")) next.badges = [...next.badges, "Pembuka Hadiah"];
      next.level = Math.floor(next.xp / 100) + 1;
      return next;
    });
    setFeedback("Hadiah dibuka! +50 coin dan +35 XP 🎁");
    setPandiMood("/pandi-goodjob.png");
  }

  function unlockParentPortal() {
    if (parentPin.trim() === "1234") {
      setParentUnlocked(true);
      setFeedback("Portal ibu bapa dibuka. Semua progress anak boleh disemak 📊");
      setPandiMood("/pandi-goodjob.png");
    } else {
      setFeedback("PIN demo ialah 1234. Nanti versi sebenar kita sambung login Google.");
      setPandiMood("/pandi-think.png");
    }
  }

  function generateReport() {
    setReportReady(true);
    setSave((old) => {
      const next = { ...old };
      if (!next.badges.includes("Laporan Pertama")) next.badges = [...next.badges, "Laporan Pertama"];
      return next;
    });
    setFeedback("Laporan mingguan sudah dijana untuk ibu bapa 📄");
    setPandiMood("/pandi-goodjob.png");
  }

  return (
    <main className="pk-page">
      <div className="cloud cloud-a" />
      <div className="cloud cloud-b" />
      <div className="cloud cloud-c" />
      <div className="sun">☀️</div>
      {levelUp && <div className="level-up">LEVEL UP! 🎉</div>}

      <nav className="topbar">
        <div className="brand">
          <div className="brand-logo">P</div>
          <div><strong>PandaiKids</strong><span>Parent Portal</span></div>
        </div>
        <div className="top-actions">
          <span>❤️ {hearts}</span><span>⭐ Level {save.level}</span><span>🪙 {save.coins}</span><span>🔥 {save.streak}</span>
        </div>
      </nav>

      <section className="hero sprint8-hero">
        <div className="hero-copy">
          <span className="tag">👨‍👩‍👧 Sprint 10 • Parent Portal</span>
          <h1>Dashboard ibu bapa untuk pantau progres anak.</h1>
          <p>Sprint 10 tambah portal ibu bapa, laporan mingguan, sasaran belajar, graf progres dan ringkasan topik lemah supaya ibu bapa tahu perkembangan anak dengan cepat.</p>
          <div className="hero-actions">
            <a className="primary-btn" href="#quiz">Mula Misi</a>
            <a className="ghost-btn" href="#parent">Portal Ibu Bapa</a>
          </div>
          <div className="reward-row">
            <span>👨‍👩‍👧 Parent Portal</span><span>📊 Graf Progress</span><span>📄 Laporan</span><span>🎯 Sasaran Harian</span>
          </div>
        </div>

        <div className="hero-stage">
          <div className="stage-card main-pandi-card">
            <div className="spark star-one">⭐</div><div className="spark star-two">✨</div>
            <img src={save.avatar} alt="Pandi mascot" className="pandi-main" />
            <div className="speech-bubble">Jom unlock badge!</div>
          </div>
          <div className="mini-panel xp-panel"><span>XP Terkumpul</span><strong>{save.xp} XP</strong></div>
          <div className="mini-panel coin-panel"><span>Wallet</span><strong>{save.coins}</strong></div>
        </div>
      </section>

      <section className="mission-strip">
        <div><span>Misi Sprint 10</span><strong>Belajar, kumpul data progres dan semak laporan ibu bapa</strong></div>
        <div className="mission-progress"><div style={{ width: `${missionProgress}%` }} /></div>
        <b>{missionProgress}%</b>
      </section>

      <section id="dashboard" className="game-dashboard">
        <article className="dash-card big"><span>Level Progress</span><strong>Level {save.level}</strong><div className="level-meter"><div style={{ width: `${levelProgress}%` }} /></div><p>{levelProgress}/100 XP ke level seterusnya</p></article>
        <article className="dash-card"><span>Best Score</span><strong>{save.bestScore}</strong><p>Rekod markah tertinggi</p></article>
        <article className="dash-card"><span>Combo</span><strong>x{combo}</strong><p>Jawapan betul berturut-turut</p></article>
        <article className={`dash-card chest ${save.chestReady ? "ready" : ""}`} onClick={openChest}><span>Reward Chest</span><strong>{chestOpen ? "Dibuka!" : save.chestReady ? "Buka 🎁" : "Terkunci"}</strong><p>{save.chestReady ? "Klik untuk ambil hadiah" : "Capai 40 markah untuk buka"}</p></article>
      </section>

      <section className="ai-learning-zone">
        <div className="section-title"><span>🤖 Pandi AI Coach</span><h2>Penerangan pintar selepas setiap jawapan</h2></div>
        <div className="ai-grid">
          <article className="ai-card coach">
            <div className="ai-orb">AI</div>
            <div>
              <span>Coach Response</span>
              <p>{aiCoach}</p>
            </div>
          </article>
          <article className="ai-card">
            <span>Fokus Ulang Kaji</span>
            <strong>{focusSkill}</strong>
            <p>{reviewList.length ? `Subjek perlu ulang: ${reviewList.join(", ")}` : "Pandi akan kesan topik yang anak kerap salah."}</p>
          </article>
          <article className="ai-card">
            <span>Tahap Soalan</span>
            <strong>{accuracy >= 70 ? "Naik Tahap" : selected ? "Kekal Mudah" : "Menunggu"}</strong>
            <p>{accuracy >= 70 ? "Pandi boleh beri soalan lebih mencabar." : "Soalan masih mesra beginner supaya anak tak cepat putus asa."}</p>
          </article>
        </div>
      </section>

      <section id="parent" className="parent-portal-zone">
        <div className="section-title"><span>👨‍👩‍👧 Parent Portal</span><h2>Command Center untuk ibu bapa</h2></div>
        {!parentUnlocked ? (
          <div className="parent-lock-card">
            <div>
              <span>PIN Demo</span>
              <h3>Buka dashboard ibu bapa</h3>
              <p>Masukkan PIN <strong>1234</strong> untuk lihat laporan, sasaran harian dan topik yang anak perlu ulang kaji.</p>
            </div>
            <div className="pin-box">
              <input value={parentPin} onChange={(e) => setParentPin(e.target.value)} placeholder="Masukkan PIN" inputMode="numeric" />
              <button onClick={unlockParentPortal}>Buka Portal</button>
            </div>
          </div>
        ) : (
          <div className="parent-grid">
            <article className="parent-card profile-card">
              <span>Profil Anak</span>
              <div className="child-tabs">
                {["Aisyah", "Maryam", "Sofia"].map((child) => <button key={child} onClick={() => setActiveChild(child)} className={activeChild === child ? "active" : ""}>{child}</button>)}
              </div>
              <h3>{activeChild}</h3>
              <p>Status minggu ini: <strong>{parentSummary.status}</strong></p>
              <p>Topik ulang kaji: <strong>{parentSummary.weak}</strong></p>
            </article>

            <article className="parent-card report-card">
              <span>Laporan Ringkas</span>
              <strong>{accuracy}%</strong>
              <p>Ketepatan semasa • Best score {save.bestScore} • Level {save.level}</p>
              <button onClick={generateReport}>{reportReady ? "Laporan Siap ✅" : "Jana Laporan"}</button>
            </article>

            <article className="parent-card goal-card">
              <span>Sasaran Harian</span>
              <strong>{dailyGoal} minit</strong>
              <input type="range" min="10" max="60" step="5" value={dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))} />
              <p>Sasaran ini akan jadi panduan sesi belajar harian.</p>
            </article>

            <article className="parent-card chart-card">
              <span>Graf Mingguan</span>
              <div className="bar-chart">
                {weeklyMinutes.map((value, index) => <div key={weeklyLabels[index]}><b style={{ height: `${Math.min(100, value * 3)}px` }} /><small>{weeklyLabels[index]}</small></div>)}
              </div>
              <p>Jumlah minggu ini: <strong>{Math.round(parentSummary.minutes)} minit</strong></p>
            </article>
          </div>
        )}
      </section>

      <section className="badge-zone">
        <div className="section-title"><span>🏅 Badge Pencapaian</span><h2>Koleksi anak hari ini</h2></div>
        <div className="badges">
          {badgeRules.map((badge) => <div key={badge} className={`badge ${save.badges.includes(badge) ? "active" : "locked"}`}>{save.badges.includes(badge) ? "🏅" : "🔒"}<strong>{badge}</strong></div>)}
        </div>
      </section>

      <section className="shop-zone">
        <div className="section-title"><span>🛍️ Kedai Pandi</span><h2>Unlock avatar dengan coin</h2></div>
        <div className="shop-grid">
          {rewardShop.map((item) => (
            <article className="shop-card" key={item.name}>
              <img src={item.img} alt={item.name} />
              <h3>{item.name}</h3>
              <button onClick={() => buyAvatar(item)}>🪙 {item.price} Unlock</button>
            </article>
          ))}
        </div>
      </section>

      <section id="quiz" className="quiz-zone">
        <div className="pandi-chat-card">
          <img src={pandiMood} alt="Pandi reaction" />
          <div><span>Pandi kata</span><p>{feedback}</p></div>
        </div>

        <div className="quiz-card">
          {!showResult ? (
            <>
              <div className="quiz-header">
                <div><span className="mini-label">{current.subject} • {current.level}</span><h2>{current.question}</h2></div>
                <div className="level-pill">Misi {step + 1}/{questions.length}</div>
              </div>
              {showHint && <div className="hint-box">💡 {current.hint}<br/><small>Strategi Pandi: buang pilihan yang memang salah, kemudian pilih jawapan paling tepat.</small></div>}
              <div className="answers">
                {current.options.map((option) => {
                  const isCorrect = selected && option === current.answer;
                  const isWrong = selected === option && option !== current.answer;
                  return <button key={option} onClick={() => choose(option)} className={`answer-btn ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}><span>{option}</span></button>;
                })}
              </div>
              <div className="quiz-actions">
                <button onClick={() => setShowHint(true)} className="hint-btn">💡 Hint Pintar</button>
                <button onClick={nextQuestion} className="next-btn">{step >= questions.length - 1 ? "Lihat Result" : "Teruskan Misi →"}</button>
              </div>
            </>
          ) : (
            <div className="result-card">
              <img src="/pandi-goodjob.png" alt="Pandi good job" />
              <span>Result Misi</span>
              <h2>{accuracy >= 70 ? "Hebat!" : "Bagus, terus cuba!"}</h2>
              <p>Skor: <strong>{score}/{questions.length * 10}</strong> • Ketepatan: <strong>{accuracy}%</strong></p>
              <button onClick={restart} className="next-btn">Main Semula</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
