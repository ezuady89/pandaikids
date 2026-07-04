'use client';

import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Gift, Home, Map, Sparkles, Star, Trophy, UserRound } from "lucide-react";
import { PandiMascot } from "@/components/PandiMascot";
import { mapPlaces, questions, subjects, years } from "@/data/content";

type Screen = "landing" | "onboarding" | "year" | "dashboard" | "learn" | "quiz" | "result" | "reward" | "map" | "profile";

export default function PandaiKidsApp() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [childName, setChildName] = useState("Aisyah");
  const [selectedYear, setSelectedYear] = useState("Tahun 1");
  const [qIndex, setQIndex] = useState(0);
  const [xp, setXp] = useState(120);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const question = questions[qIndex];

  const go = (next: Screen) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const answer = (value: string) => {
    const correct = value === question.correct;
    setLastCorrect(correct);
    if (correct) setXp((n) => n + 10);
    setTimeout(() => go("result"), 300);
  };

  const nextQuestion = () => {
    if (qIndex < questions.length - 1) {
      setQIndex((n) => n + 1);
      setLastCorrect(null);
      go("quiz");
    } else {
      go("reward");
    }
  };

  const level = useMemo(() => Math.max(1, Math.floor(xp / 100)), [xp]);

  return (
    <main className="app">
      {screen === "landing" && (
        <section className="heroScreen">
          <div className="cloud c1" />
          <div className="cloud c2" />
          <div className="sun" />

          <div className="brand"><div>🐼</div><span>PandaiKids</span></div>

          <div className="heroGrid">
            <div className="heroText">
              <div className="tag"><Sparkles size={16}/> Sprint 3 Mini App</div>
              <h1>Masuk dunia belajar bersama Pandi.</h1>
              <p>Bukan sekadar landing page. Sekarang anak boleh isi nama, pilih tahun, masuk dashboard, jawab kuiz dan dapat XP.</p>
              <button className="btn primary" onClick={() => go("onboarding")}>Mula Sekarang <ArrowRight size={18}/></button>
            </div>
            <div className="heroMascot"><PandiMascot /></div>
          </div>
        </section>
      )}

      {screen === "onboarding" && (
        <section className="screen">
          <Header title="Selamat datang" subtitle="Biar rasa macam game, bukan login." onBack={() => go("landing")} />
          <div className="centerCard">
            <PandiMascot small />
            <h2>Siapa nama awak?</h2>
            <p>Pandi akan panggil nama ini sepanjang pengembaraan.</p>
            <input value={childName} onChange={(e) => setChildName(e.target.value)} className="input" />
            <button className="btn primary full" onClick={() => go("year")}>Seterusnya 🌈</button>
          </div>
        </section>
      )}

      {screen === "year" && (
        <section className="screen">
          <Header title="Pilih Tahun" subtitle="Untuk alpha, kita fokus Tahun 1 dahulu." onBack={() => go("onboarding")} />
          <div className="yearGrid">
            {years.map((year, index) => (
              <button key={year} className={`yearCard ${index > 0 ? "locked" : ""}`} onClick={() => {
                if (index === 0) {
                  setSelectedYear(year);
                  go("dashboard");
                }
              }}>
                <span>{index === 0 ? "📘" : "🔒"}</span>
                <h3>{year}</h3>
                <p>{index === 0 ? "Aktif untuk percubaan awal." : "Coming soon"}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {screen === "dashboard" && (
        <section className="screen withNav">
          <Header title={`Hai ${childName || "Adik"} 👋`} subtitle={`${selectedYear} • Level ${level}`} right={`⭐ ${xp} XP`} />
          <div className="dashboardHero">
            <div>
              <div className="tag blue">Hari ini</div>
              <h2>Jom sambung belajar 5 minit.</h2>
              <p>Amani dah sedia tunggu di Hutan Nombor.</p>
              <button className="btn primary" onClick={() => go("learn")}>Mula Belajar</button>
            </div>
            <PandiMascot label="Pandi" small />
          </div>

          <div className="stats">
            <Stat value="3" label="Hari streak" />
            <Stat value="92%" label="Ketepatan" />
            <Stat value="2" label="Kuiz siap" />
            <Stat value={String(level)} label="Level" />
          </div>

          <div className="sectionTitle"><h2>Modul Aktif</h2><span>Alpha</span></div>
          <div className="moduleCard" onClick={() => go("quiz")}>
            <span>🔢</span>
            <div><h3>Tambah Mudah</h3><p>Kuiz pertama untuk uji flow PandaiKids.</p></div>
            <ArrowRight size={20}/>
          </div>
        </section>
      )}

      {screen === "learn" && (
        <section className="screen withNav">
          <Header title="Pilih Subjek" subtitle="Sahabat kecil muncul ketika latihan." onBack={() => go("dashboard")} />
          <div className="subjectGrid">
            {subjects.map((s, idx) => (
              <button key={s.title} className={`subjectTile ${s.theme}`} onClick={() => idx === 0 ? go("quiz") : undefined}>
                <span>{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <b>{s.friend}</b>
              </button>
            ))}
          </div>
        </section>
      )}

      {screen === "quiz" && (
        <section className="screen withNav">
          <Header title="Kuiz Matematik" subtitle="Amani teman latihan ini." onBack={() => go("dashboard")} right={`${qIndex + 1}/${questions.length}`} />
          <div className="companion">
            <PandiMascot label="Amani" tone="amani" small />
            <div><b>Amani:</b><p>Berani cuba dulu. Kalau salah, kita belajar sama-sama.</p></div>
          </div>
          <div className="quizCard">
            <div className="quizMeta"><span>❤️❤️❤️</span><span>⭐ {xp} XP</span></div>
            <h2>{question.question}</h2>
            <div className="answers">
              {question.answers.map((a) => (
                <button key={a} onClick={() => answer(a)}>{a}</button>
              ))}
            </div>
          </div>
        </section>
      )}

      {screen === "result" && (
        <section className="screen">
          <div className="resultCard">
            <div className="bigEmoji">{lastCorrect ? "🎉" : "😊"}</div>
            <h2>{lastCorrect ? "Betul!" : "Tak apa, cuba lagi."}</h2>
            <p>{lastCorrect ? `${childName || "Adik"} dapat +10 XP.` : question.help}</p>
            <div className="xpPill">⭐ {xp} XP</div>
            <button className="btn primary full" onClick={nextQuestion}>{qIndex < questions.length - 1 ? "Soalan Seterusnya" : "Buka Hadiah Pip 🎁"}</button>
          </div>
        </section>
      )}

      {screen === "reward" && (
        <section className="screen">
          <div className="resultCard">
            <div className="bigEmoji">🐦🎁</div>
            <h2>Pip datang bawa hadiah!</h2>
            <p>Tahniah. Kuiz pertama selesai. Awak buka badge pertama.</p>
            <div className="badgeReward">🥇 Juara Nombor</div>
            <button className="btn primary full" onClick={() => go("map")}>Pergi Peta Pengembaraan</button>
          </div>
        </section>
      )}

      {screen === "map" && (
        <section className="screen withNav">
          <Header title="Dunia PandaiKids" subtitle="Setiap topik jadi lokasi pengembaraan." onBack={() => go("dashboard")} />
          <div className="path">
            {mapPlaces.map((p) => (
              <div key={p.title} className={`place ${p.done ? "done" : ""} ${p.lock ? "lock" : ""}`}>
                <div className="pin">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {screen === "profile" && (
        <section className="screen withNav">
          <Header title="Profil Anak" subtitle="Dashboard ringkas untuk alpha." onBack={() => go("dashboard")} />
          <div className="profileCard">
            <div className="avatar">👧</div>
            <div><h2>{childName || "Aisyah"}</h2><p>{selectedYear} • Level {level}</p><b>⭐ {xp} XP</b></div>
          </div>
          <div className="note">Tiga sahabat kecil menjadi tanda kasih dan kenangan untuk Amani, Auliyaa dan Aisyah — tanpa menggunakan wajah sebenar mereka.</div>
        </section>
      )}

      {screen !== "landing" && screen !== "onboarding" && screen !== "year" && (
        <nav className="bottomNav">
          <button onClick={() => go("dashboard")}><Home size={21}/><span>Home</span></button>
          <button onClick={() => go("learn")}><BookOpen size={21}/><span>Belajar</span></button>
          <button onClick={() => go("map")}><Map size={21}/><span>Peta</span></button>
          <button onClick={() => go("reward")}><Trophy size={21}/><span>Reward</span></button>
          <button onClick={() => go("profile")}><UserRound size={21}/><span>Profil</span></button>
        </nav>
      )}
    </main>
  );
}

function Header({ title, subtitle, right, onBack }: { title: string; subtitle?: string; right?: string; onBack?: () => void }) {
  return (
    <header className="header">
      {onBack && <button className="back" onClick={onBack}>←</button>}
      <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
      {right && <span>{right}</span>}
    </header>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return <div className="stat"><strong>{value}</strong><span>{label}</span></div>;
}
