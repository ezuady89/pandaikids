"use client";

import { useEffect, useMemo, useState } from "react";

type Screen = "intro" | "welcome" | "story" | "quiz" | "reward" | "box" | "boxResult" | "map" | "parent";

type Question = {
  question: string;
  answer: string;
  options: string[];
  teach: string;
};

const stateThemes: Record<string, { flag: string; line: string; costume: string }> = {
  Kelantan: { flag: "🏴", line: "Pandi bawa semangat Kelantan.", costume: "Tema Negeri" },
  Terengganu: { flag: "🏳️", line: "Pandi bawa semangat Terengganu.", costume: "Tema Negeri" },
  Selangor: { flag: "🔴", line: "Pandi bawa semangat Selangor.", costume: "Tema Negeri" },
  Johor: { flag: "🔵", line: "Pandi bawa semangat Johor.", costume: "Tema Negeri" },
  Sabah: { flag: "🌺", line: "Pandi bawa semangat Sabah.", costume: "Tema Negeri" },
  Sarawak: { flag: "🪶", line: "Pandi bawa semangat Sarawak.", costume: "Tema Negeri" },
  Kedah: { flag: "🌾", line: "Pandi bawa semangat Kedah.", costume: "Tema Negeri" },
  Pahang: { flag: "🌿", line: "Pandi bawa semangat Pahang.", costume: "Tema Negeri" },
};

const questions: Question[] = [
  { question: "5 + 3 = ?", answer: "8", options: ["6", "7", "8", "9"], teach: "Bayangkan 5 epal ditambah 3 epal. Kita kira semua epal itu menjadi 8." },
  { question: "Nombor selepas 9 ialah?", answer: "10", options: ["8", "10", "11", "12"], teach: "Kita ikut turutan nombor. Selepas 9, kita sebut 10." },
  { question: "3 + 1 = ?", answer: "4", options: ["3", "4", "5", "6"], teach: "Ada 3 objek. Tambah 1 lagi. Semuanya jadi 4." },
  { question: "Mana nombor paling besar?", answer: "7", options: ["2", "4", "7", "5"], teach: "7 paling besar kerana nilainya lebih tinggi daripada 2, 4 dan 5." },
  { question: "2 + 2 = ?", answer: "4", options: ["3", "4", "5", "6"], teach: "2 tambah 2 sama dengan 4. Cuba bayangkan dua pasang jari." },
  { question: "7 - 2 = ?", answer: "5", options: ["4", "5", "6", "7"], teach: "Mula dengan 7. Ambil keluar 2. Tinggal 5." },
  { question: "1 + 6 = ?", answer: "7", options: ["6", "7", "8", "9"], teach: "1 ditambah 6 menjadi 7. Kita gabungkan semua objek." },
  { question: "Mana nombor sebelum 6?", answer: "5", options: ["4", "5", "7", "8"], teach: "Sebelum 6 ialah 5. Cuba kira: 4, 5, 6." },
  { question: "4 + 4 = ?", answer: "8", options: ["6", "7", "8", "9"], teach: "4 tambah 4 ialah 8. Bayangkan dua kumpulan yang sama banyak." },
  { question: "10 - 3 = ?", answer: "7", options: ["6", "7", "8", "9"], teach: "Mula dengan 10. Tolak 3. Tinggal 7." },
  { question: "6 + 2 = ?", answer: "8", options: ["7", "8", "9", "10"], teach: "6 tambah 2 menjadi 8. Tambah dua langkah selepas 6." },
  { question: "Nombor antara 3 dan 5 ialah?", answer: "4", options: ["2", "4", "6", "7"], teach: "Turutan nombor ialah 3, 4, 5. Jadi nombor di tengah ialah 4." },
  { question: "9 - 4 = ?", answer: "5", options: ["4", "5", "6", "7"], teach: "Mula dengan 9. Keluarkan 4. Kita akan tinggal 5." },
  { question: "3 + 3 = ?", answer: "6", options: ["5", "6", "7", "8"], teach: "3 tambah 3 ialah 6. Ini dua kumpulan yang sama banyak." },
  { question: "Mana nombor paling kecil?", answer: "1", options: ["1", "3", "6", "9"], teach: "1 paling kecil kerana nilainya paling rendah." },
  { question: "8 - 1 = ?", answer: "7", options: ["6", "7", "8", "9"], teach: "Mula dengan 8. Ambil keluar 1. Tinggal 7." },
  { question: "5 + 5 = ?", answer: "10", options: ["8", "9", "10", "11"], teach: "5 tambah 5 menjadi 10. Dua tangan ada 10 jari." },
  { question: "Nombor selepas 14 ialah?", answer: "15", options: ["13", "14", "15", "16"], teach: "Selepas 14, kita sebut 15." },
  { question: "12 - 2 = ?", answer: "10", options: ["9", "10", "11", "12"], teach: "Mula dengan 12. Tolak 2. Tinggal 10." },
  { question: "4 + 6 = ?", answer: "10", options: ["8", "9", "10", "11"], teach: "4 tambah 6 menjadi 10. Kita gabungkan dua kumpulan nombor." },
];

const visualRewards = [
  { at: 5, icon: "🎒", title: "Pandi dapat beg belajar!", text: "Setiap 5 soalan, Pandi akan nampak semakin bersedia mengembara." },
  { at: 10, icon: "🎓", title: "Pandi dapat topi pintar!", text: "Bagus! Hutan Matematik semakin hidup." },
  { at: 15, icon: "🧭", title: "Pandi dapat kompas!", text: "Pandi kini lebih berani meneroka jalan baru." },
  { at: 20, icon: "🏆", title: "Hutan Matematik berjaya diselamatkan!", text: "Sekarang barulah Pandi tunjuk dunia lain yang masih menunggu." },
];

const boxPrizes = ["Pandi Explorer", "Pandi Saintis", "Pandi Chef", "Pandi Guru", "Pandi Bomba", "Pandi Rahsia Legenda"];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [childName, setChildName] = useState("");
  const [stateName, setStateName] = useState("Kelantan");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [coachText, setCoachText] = useState("");
  const [showCoach, setShowCoach] = useState(false);
  const [reward, setReward] = useState(visualRewards[0]);
  const [owned, setOwned] = useState<string[]>([]);
  const [lastPrize, setLastPrize] = useState("");
  const [isWalking, setIsWalking] = useState(false);
  const [pandiMood, setPandiMood] = useState<"happy" | "teach" | "celebrate">("happy");

  const current = questions[questionIndex];
  const answered = questionIndex;
  const theme = stateThemes[stateName] ?? stateThemes.Kelantan;
  const rewardIcons = useMemo(() => {
    return {
      bag: answered >= 5,
      hat: answered >= 10,
      compass: answered >= 15,
    };
  }, [answered]);

  useEffect(() => {
    const savedName = window.localStorage.getItem("pk_child_name");
    const savedState = window.localStorage.getItem("pk_state_name");
    const savedOwned = window.localStorage.getItem("pk_owned_prizes");
    if (savedName) {
      setChildName(savedName);
      setStateName(savedState || "Kelantan");
      setScreen("welcome");
    }
    if (savedOwned) {
      try { setOwned(JSON.parse(savedOwned)); } catch {}
    }
  }, []);

  function begin() {
    const clean = childName.trim() || "Adam";
    setChildName(clean);
    window.localStorage.setItem("pk_child_name", clean);
    window.localStorage.setItem("pk_state_name", stateName);
    setScreen("welcome");
  }

  function startQuiz() {
    setQuestionIndex(0);
    setShowCoach(false);
    setPandiMood("happy");
    setScreen("quiz");
  }

  function choose(option: string) {
    if (option === current.answer) {
      const nextCount = questionIndex + 1;
      setPandiMood("celebrate");
      const hitReward = visualRewards.find((item) => item.at === nextCount);
      if (hitReward) {
        setReward(hitReward);
        setScreen("reward");
      } else if (nextCount === 10 || nextCount === 20) {
        setScreen("box");
      } else {
        moveNext(nextCount);
      }
    } else {
      setPandiMood("teach");
      setCoachText(`Tak apa ${childName || "kawan"} 😊 ${current.teach} Jom cuba sekali lagi.`);
      setShowCoach(true);
    }
  }

  function moveNext(nextCount = questionIndex + 1) {
    setShowCoach(false);
    setIsWalking(true);
    window.setTimeout(() => setIsWalking(false), 850);
    if (nextCount >= questions.length) {
      setScreen("map");
      return;
    }
    setQuestionIndex(nextCount);
    setPandiMood("happy");
    setScreen("quiz");
  }

  function claimReward() {
    if (reward.at === 10 || reward.at === 20) {
      setScreen("box");
      return;
    }
    moveNext(reward.at);
  }

  function openBox() {
    const remaining = boxPrizes.filter((item) => !owned.includes(item));
    const pool = remaining.length ? remaining : boxPrizes;
    const prize = pool[Math.floor(Math.random() * pool.length)];
    const nextOwned = Array.from(new Set([...owned, prize]));
    setOwned(nextOwned);
    window.localStorage.setItem("pk_owned_prizes", JSON.stringify(nextOwned));
    setLastPrize(prize);
    setScreen("boxResult");
  }

  function continueAfterBox() {
    const nextCount = questionIndex + 1;
    if (nextCount >= questions.length) setScreen("map");
    else moveNext(nextCount);
  }

  function resetProfile() {
    window.localStorage.removeItem("pk_child_name");
    window.localStorage.removeItem("pk_state_name");
    setChildName("");
    setStateName("Kelantan");
    setScreen("intro");
  }

  return (
    <main className="pk-app">
      <div className="sky sun" />
      <div className="cloud cloud-a" />
      <div className="cloud cloud-b" />
      <div className="bird bird-a">🐦</div>
      <div className="bird bird-b">🕊️</div>
      <div className="mountain" />
      <div className="river" />
      <div className="ground" />
      <div className="path" />
      <div className="tree tree-a" />
      <div className="tree tree-b" />
      <div className={`flower flower-a ${answered >= 3 ? "show" : ""}`}>🌸</div>
      <div className={`flower flower-b ${answered >= 8 ? "show" : ""}`}>🌼</div>
      <div className={`flower flower-c ${answered >= 14 ? "show" : ""}`}>🌺</div>

      {screen !== "intro" && screen !== "welcome" && screen !== "story" && (
        <div className="topbar">
          <span>❤️❤️❤️</span>
          <span>🌱 Soalan {Math.min(questionIndex + 1, 20)}/20</span>
          <span>{theme.flag} {stateName}</span>
        </div>
      )}

      <section className={`pandi-stage ${isWalking ? "walk" : ""} mood-${pandiMood}`}>
        {rewardIcons.hat && <div className="pandi-hat">🎓</div>}
        <img src="/pandi-official.png" alt="Pandi Official" className="pandi-official" />
        <div className="pandi-flag">{theme.flag}</div>
        {rewardIcons.bag && <div className="pandi-bag">🎒</div>}
        {rewardIcons.compass && <div className="pandi-compass">🧭</div>}
      </section>

      {screen === "intro" && (
        <section className="panel center intro-panel">
          <img src="/pandaikids-logo-official.png" alt="PandaiKids" className="brand-logo-img" />
          <h1>Assalamualaikum 👋</h1>
          <p>Pandi nak kenal kawan baru sebelum mula belajar.</p>
          <input value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Nama anak" />
          <select value={stateName} onChange={(e) => setStateName(e.target.value)}>
            {Object.keys(stateThemes).map((state) => <option key={state}>{state}</option>)}
          </select>
          <button onClick={begin}>Jom Kenal Pandi</button>
        </section>
      )}

      {screen === "welcome" && (
        <section className="panel center">
          <span className="tag">{theme.line}</span>
          <h1>Hai {childName}! 😊</h1>
          <p>Saya Pandi, kawan belajar awak. Hari ini kita nak hidupkan Hutan Matematik.</p>
          <button onClick={() => setScreen("story")}>Mula Pengembaraan</button>
          <button className="ghost" onClick={resetProfile}>Tukar Nama / Negeri</button>
        </section>
      )}

      {screen === "story" && (
        <section className="panel story-card">
          <span className="tag">🌳 Hutan Matematik</span>
          <h1>Pokok nombor semakin layu...</h1>
          <p>Pandi perlukan bantuan {childName}. Jawab soalan dengan tenang. Kalau keliru, Pandi akan ajar.</p>
          <button onClick={startQuiz}>Bantu Pandi</button>
        </section>
      )}

      {screen === "quiz" && current && (
        <section className="panel quiz-card">
          <div className="progress-seeds">
            {Array.from({ length: 20 }).map((_, index) => <i key={index} className={index < questionIndex ? "on" : ""} />)}
          </div>
          <span className="tag">🌱 Pokok Nombor</span>
          <h2>{current.question}</h2>
          <div className="answers">
            {current.options.map((option) => <button key={option} onClick={() => choose(option)}>{option}</button>)}
          </div>
          {showCoach && (
            <div className="coach-card">
              <b>🐼 Pandi mengajar</b>
              <p>{coachText}</p>
              <button className="ghost" onClick={() => setShowCoach(false)}>Saya faham, cuba lagi</button>
            </div>
          )}
        </section>
      )}

      {screen === "reward" && (
        <section className="modal-card">
          <div className="big-icon">{reward.icon}</div>
          <h1>{reward.title}</h1>
          <p>{reward.text}</p>
          <button onClick={claimReward}>Teruskan</button>
        </section>
      )}

      {screen === "box" && (
        <section className="modal-card">
          <div className="big-icon shake">🎁</div>
          <h1>Kotak Kejutan Pandi</h1>
          <p>Pilih kotak. Hadiah ini hanya diperoleh melalui pembelajaran, bukan dibeli.</p>
          <div className="box-grid">
            {Array.from({ length: 6 }).map((_, index) => <button key={index} onClick={openBox}>🐼❓</button>)}
          </div>
        </section>
      )}

      {screen === "boxResult" && (
        <section className="modal-card">
          <div className="big-icon">🐼✨</div>
          <h1>{lastPrize}</h1>
          <p>Hadiah masuk ke Album Pandi. Tiada hadiah berulang selagi koleksi belum lengkap.</p>
          <button onClick={continueAfterBox}>Sambung Belajar</button>
        </section>
      )}

      {screen === "map" && (
        <section className="modal-card wide">
          <div className="big-icon">🗺️</div>
          <h1>Eh, ada dunia lain!</h1>
          <p>{childName} sudah merasai pengalaman belajar bersama Pandi. Sekarang baru Pandi tunjuk dunia lain yang menunggu.</p>
          <div className="world-map">
            <div>🌳 Hutan Matematik ✅</div>
            <div className="locked">🏰 Istana BM 🔒</div>
            <div className="locked">🚀 Planet Sains 🔒</div>
            <div className="locked">🌊 Pulau English 🔒</div>
            <div className="locked">🕌 Taman Akhlak 🔒</div>
            <div className="locked">🎨 Studio Kreatif 🔒</div>
          </div>
          <button onClick={() => setScreen("parent")}>Ringkasan Ibu Bapa</button>
        </section>
      )}

      {screen === "parent" && (
        <section className="panel center">
          <h1>Untuk Ibu Bapa ❤️</h1>
          <p>{childName} menyelesaikan 20 soalan pertama, menerima bimbingan bila keliru, dan membuka ganjaran visual melalui pembelajaran.</p>
          <p className="parent-note">Fokus PandaiKids: bina keyakinan belajar, bukan sekadar kejar markah.</p>
          <button onClick={() => setScreen("welcome")}>Kembali</button>
        </section>
      )}
    </main>
  );
}
