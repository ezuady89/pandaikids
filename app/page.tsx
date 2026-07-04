'use client';

import { useState } from "react";
import { Home, BookOpen, Trophy, UserRound, Map, Sparkles } from "lucide-react";
import { PandaMascot } from "@/components/PandaMascot";
import { BottomNav } from "@/components/BottomNav";
import { ScreenHeader } from "@/components/ScreenHeader";
import { subjects, topics, places, badges } from "@/data/content";

type Screen =
  | "landing"
  | "onboard"
  | "home"
  | "learn"
  | "subjects"
  | "topics"
  | "quiz"
  | "result"
  | "treasure"
  | "map"
  | "friends"
  | "rewards"
  | "profile";

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [childName, setChildName] = useState("Aisyah");

  const go = (next: Screen) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="app-shell">
      {screen === "landing" && (
        <section className="screen active">
          <div className="hero">
            <div className="cloud c1" />
            <div className="cloud c2" />
            <div className="cloud c3" />

            <div className="brand">
              <div className="brandLogo">🐼</div>
              <span>PandaiKids</span>
            </div>

            <h1>Belajar dengan Pandi.</h1>
            <p>
              Dunia kecil untuk anak belajar melalui kuiz, ganjaran, peta
              pengembaraan dan sahabat yang memberi semangat.
            </p>

            <div className="heroActions">
              <button className="btn primary" onClick={() => go("onboard")}>
                Masuk Dunia Pandai 🚀
              </button>
              <button className="btn light" onClick={() => go("friends")}>
                Kenal Sahabat 🐼
              </button>
            </div>

            <div className="heroPandi">
              <PandaMascot name="Pandi" tone="pandi" size="large" />
            </div>
          </div>

          <div className="founderNote">
            “PandaiKids lahir daripada impian seorang ayah yang mahu menjadikan
            pembelajaran lebih menyeronokkan untuk anak-anaknya.”
          </div>
        </section>
      )}

      {screen === "onboard" && (
        <section className="screen active">
          <ScreenHeader title="Selamat Datang" subtitle="Rasa macam game, bukan login." onBack={() => go("landing")} />
          <div className="centerCard">
            <div className="bigEmoji">👋</div>
            <h2>Hai, nama awak?</h2>
            <input
              className="input"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
            />
            <input className="input" defaultValue="7 tahun" />
            <button className="btn primary" onClick={() => go("home")}>
              Jom Mula 🌈
            </button>
          </div>
        </section>
      )}

      {screen === "home" && (
        <section className="screen active">
          <ScreenHeader
            title={`Hai ${childName || "adik"} 👋`}
            subtitle="Pandi dah tunggu untuk belajar hari ini."
            right="🔥 Streak 3"
          />

          <section className="section">
            <div className="helperCard">
              <div className="helperIcon">🐼</div>
              <div>
                <b>Pandi</b>
                <p>Hari ini kita cuba Tambah Mudah. Tak perlu takut salah.</p>
              </div>
            </div>

            <div className="sectionTitle">
              <h2>Aktiviti Hari Ini</h2>
              <span>⭐ 1,250 XP</span>
            </div>

            <div className="cards">
              <button className="activityCard" onClick={() => go("learn")}>
                <span className="activityIcon">🔢</span>
                <h3>Tambah Mudah</h3>
                <p>Sambung kuiz terakhir bersama Amani.</p>
                <b>⭐ 80 XP lagi</b>
              </button>

              <button className="activityCard" onClick={() => go("map")}>
                <span className="activityIcon">🗺️</span>
                <h3>Peta Pengembaraan</h3>
                <p>Buka lokasi baru selepas kuiz.</p>
                <b>🌳 Hutan Nombor</b>
              </button>
            </div>
          </section>
        </section>
      )}

      {screen === "friends" && (
        <section className="screen active">
          <ScreenHeader title="Sahabat Pandai" subtitle="Watak utama dunia PandaiKids." onBack={() => go("landing")} right="4 watak" />

          <section className="section friendsGrid">
            <FriendCard name="Pandi" tone="pandi" desc="Mentor penyayang. Jom belajar perlahan-lahan." />
            <FriendCard name="Amani" tone="amani" desc="Berani mencuba. Tak apa salah, cuba lagi." />
            <FriendCard name="Auliyaa" tone="auliyaa" desc="Suka bertanya. Jom cari jawapan bersama." />
            <FriendCard name="Aisyah" tone="aisyah" desc="Lembut & membantu. Hebat, awak makin pandai." />
          </section>

          <section className="section">
            <div className="sectionTitle">
              <h2>Emosi Pandi</h2>
              <span>Untuk app</span>
            </div>
            <div className="emotionGrid">
              {["😀 Gembira", "🤔 Berfikir", "🥳 Teruja", "😮 Terkejut", "💪 Semangat", "🎉 Raikan"].map((e) => (
                <div className="emotion" key={e}>
                  <div>{e.split(" ")[0]}</div>
                  <span>{e.split(" ").slice(1).join(" ")}</span>
                </div>
              ))}
            </div>
          </section>
        </section>
      )}

      {screen === "learn" && (
        <section className="screen active">
          <ScreenHeader title="Belajar" subtitle="Pilih tahun dan subjek." onBack={() => go("home")} right="Tahun 1" />
          <section className="section">
            <div className="cards">
              <button className="activityCard" onClick={() => go("subjects")}>
                <span className="activityIcon">📘</span>
                <h3>Tahun 1</h3>
                <p>Matematik, BM, Pendidikan Islam.</p>
                <b>⭐⭐⭐⭐⭐</b>
              </button>

              <button className="activityCard locked">
                <span className="activityIcon">📗</span>
                <h3>Tahun 2</h3>
                <p>Akan dibuka kemudian.</p>
                <b>🔒 Coming soon</b>
              </button>
            </div>
          </section>
        </section>
      )}

      {screen === "subjects" && (
        <section className="screen active">
          <ScreenHeader title="Tahun 1" subtitle="Pilih subjek." onBack={() => go("learn")} right="3 aktif" />
          <section className="section subjectGrid">
            {subjects.map((subject) => (
              <button
                key={subject.title}
                className={`subjectTile ${subject.theme}`}
                onClick={() => subject.title === "Matematik" ? go("topics") : undefined}
              >
                <span>{subject.icon}</span>
                <h3>{subject.title}</h3>
                <p>{subject.desc}</p>
              </button>
            ))}
          </section>
        </section>
      )}

      {screen === "topics" && (
        <section className="screen active">
          <ScreenHeader title="Matematik" subtitle="Sahabat kecil muncul semasa latihan." onBack={() => go("subjects")} right="Level 4" />
          <section className="section">
            {topics.map((topic, index) => (
              <button className="topic" key={topic.title} onClick={() => index === 0 ? go("quiz") : undefined}>
                <div>
                  <b>{topic.title}</b>
                  <span>{topic.progress}%</span>
                </div>
                <div className="bar">
                  <i style={{ width: `${topic.progress}%` }} />
                </div>
              </button>
            ))}
          </section>
        </section>
      )}

      {screen === "quiz" && (
        <section className="screen active">
          <ScreenHeader title="Kuiz" subtitle="Tambah Mudah" onBack={() => go("topics")} right="4/10" />

          <div className="companionCard">
            <PandaMascot name="Amani" tone="amani" size="small" />
            <div>
              <b>Amani teman kuiz ini</b>
              <p>Berani cuba dulu. Kalau salah, kita belajar sama-sama.</p>
            </div>
          </div>

          <div className="quizCard">
            <div className="quizTop">
              <span>Soalan 4/10</span>
              <span className="heart">❤️❤️❤️</span>
              <span>⭐ 120 XP</span>
            </div>
            <h2>8 + 6 = ?</h2>
            {["12", "13", "14 ✅", "15"].map((answer) => (
              <button
                key={answer}
                className={`answer ${answer.includes("14") ? "correct" : ""}`}
                onClick={() => answer.includes("14") ? go("result") : undefined}
              >
                {answer}
              </button>
            ))}
          </div>
        </section>
      )}

      {screen === "result" && (
        <ResultScreen
          emoji="🎉"
          title="Betul!"
          text={`${childName || "Adik"} makin hebat hari ini.`}
          button="Buka Hadiah Pip 🎁"
          onNext={() => go("treasure")}
        />
      )}

      {screen === "treasure" && (
        <ResultScreen
          emoji="🐦🎁"
          title="Pip Datang!"
          text="Pip bawa kotak hadiah untuk awak."
          button="Pergi Peta 🗺️"
          onNext={() => go("map")}
          reward="+50 XP • Sticker Pandi"
        />
      )}

      {screen === "map" && (
        <section className="screen active">
          <ScreenHeader title="Dunia PandaiKids" subtitle="Belajar melalui pengembaraan." onBack={() => go("home")} right="🗺️" />
          <section className="section path">
            {places.map((place) => (
              <div className={`place ${place.done ? "done" : ""} ${place.lock ? "lock" : ""}`} key={place.title}>
                <div className="pin">{place.icon}</div>
                <h3>{place.title}</h3>
                <p>{place.desc}</p>
              </div>
            ))}
          </section>
        </section>
      )}

      {screen === "rewards" && (
        <section className="screen active">
          <ScreenHeader title="Ganjaran" subtitle="Badge, XP dan sticker." onBack={() => go("home")} right="5 badge" />
          <section className="section badgeGrid">
            {badges.map((badge) => (
              <div className={`badge ${badge.lock ? "locked" : ""}`} key={badge.title}>
                <div>{badge.icon}</div>
                <h3>{badge.title}</h3>
                <p>{badge.lock ? "Terkunci" : "Aktif"}</p>
              </div>
            ))}
          </section>
        </section>
      )}

      {screen === "profile" && (
        <section className="screen active">
          <section className="profile">
            <div className="profileCard">
              <div className="avatar">👧</div>
              <div>
                <h2>{childName || "Aisyah"}</h2>
                <p>Tahun 1 • Level 4</p>
                <b>⭐ 1,250 XP</b>
              </div>
            </div>

            <div className="statGrid">
              <Stat value="25m" label="Belajar hari ini" />
              <Stat value="92%" label="Ketepatan" />
              <Stat value="4" label="Kuiz selesai" />
              <Stat value="3" label="Hari streak" />
            </div>

            <div className="founderNote">
              <b>Nota Founder:</b>
              <br />
              Tiga sahabat kecil dalam PandaiKids menjadi tanda kasih dan
              kenangan untuk Amani, Auliyaa dan Aisyah — tanpa menggunakan wajah
              sebenar mereka.
            </div>
          </section>
        </section>
      )}

      {screen !== "landing" && screen !== "onboard" && (
        <BottomNav
          active={screen}
          items={[
            { label: "Home", icon: <Home size={22} />, onClick: () => go("home") },
            { label: "Belajar", icon: <BookOpen size={22} />, onClick: () => go("learn") },
            { label: "Sahabat", icon: <Sparkles size={22} />, onClick: () => go("friends") },
            { label: "Reward", icon: <Trophy size={22} />, onClick: () => go("rewards") },
            { label: "Profil", icon: <UserRound size={22} />, onClick: () => go("profile") },
          ]}
        />
      )}
    </main>
  );
}

function FriendCard({ name, tone, desc }: { name: string; tone: "pandi" | "amani" | "auliyaa" | "aisyah"; desc: string }) {
  return (
    <div className="friend">
      <PandaMascot name={name} tone={tone} size="small" />
      <h3>{name}</h3>
      <p>{desc}</p>
    </div>
  );
}

function ResultScreen({
  emoji,
  title,
  text,
  button,
  reward = "+10 XP • Level Naik",
  onNext,
}: {
  emoji: string;
  title: string;
  text: string;
  button: string;
  reward?: string;
  onNext: () => void;
}) {
  return (
    <section className="screen active">
      <div className="result">
        <div className="bigEmoji">{emoji}</div>
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="stars">★★★★★</div>
        <div className="xp">{reward}</div>
        <button className="btn primary" onClick={onNext}>{button}</button>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <p>{label}</p>
    </div>
  );
}
