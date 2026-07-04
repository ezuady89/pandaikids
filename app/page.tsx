'use client';

import { useMemo, useState } from 'react';

type Screen = 'welcome' | 'home' | 'quiz' | 'box' | 'parents';

const states = ['Johor','Kedah','Kelantan','Terengganu','Sabah','Sarawak','Selangor','Perak','Pahang'];

export default function Page() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const displayName = useMemo(() => name.trim() || 'kawan baru', [name]);

  function start() {
    if (!name.trim() || !state) return;
    setScreen('home');
  }

  return (
    <main className="stage">
      <div className="worldBg" />
      <div className="sunBeam" />
      <div className="leaf leaf1">🍃</div>
      <div className="leaf leaf2">🍃</div>
      <div className="butterfly b1">🦋</div>
      <div className="butterfly b2">🦋</div>
      <div className="badge">BUILD 08 • PREMIUM HOME ACTIVE</div>

      <header className="topbar">
        <div className="brand">
          <img src="/assets/pandi-logo.png" alt="PandaiKids" />
          <div>
            <b>PandaiKids</b>
            <span>Belajar Sambil Bermain</span>
          </div>
        </div>
        <div className="wallet">
          <span>⭐ {screen === 'welcome' ? 0 : 135}</span>
          <span>💎 {screen === 'welcome' ? 0 : 855}</span>
          <button>⚙️</button>
        </div>
      </header>

      {screen === 'welcome' && (
        <section className="welcomeLayout">
          <div className="glassPanel onboarding">
            <span className="pill">Hai kawan baru! 👋</span>
            <h1>Pandi nak <span>kenal awak dulu!</span></h1>
            <p>Biar Pandi tahu nama dan negeri awak ya. Lepas tu kita mula pengembaraan belajar.</p>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama awak" maxLength={18} />
            <select value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Pilih negeri</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="big green" onClick={start}>Jom Mulakan! ›</button>
            <small>Tiada nama preset. Pandi tanya dahulu setiap pengguna baru.</small>
          </div>

          <div className="pandiCenter" aria-label="Pandi premium">
            <img src="/assets/pandi-hero.png" alt="Pandi" />
          </div>

          <aside className="missionBoard">
            <h2>🎯 Misi Harian <b>1/3</b></h2>
            <p><span>🏅 Jawab 10 soalan matematik</span><b>0/10</b></p>
            <p><span>🪙 Kumpul 5 coin</span><b>0/5</b></p>
            <p><span>🎁 Buka 1 Blind Box</span><b>0/1</b></p>
          </aside>
        </section>
      )}

      {screen === 'home' && (
        <section className="homeLayout">
          <div className="speech glassPanel">
            <span className="pill">Selamat datang, {displayName}! 👋</span>
            <h1>Jom hidupkan <span>Hutan Matematik</span></h1>
            <p>Negeri awak: <b>{state}</b>. Jawab soalan, kumpul coin dan buka hadiah untuk Pandi.</p>
            <button className="big green" onClick={() => setScreen('quiz')}>▶ Mula Belajar</button>
          </div>
          <div className="pandiCenter homePandi"><img src="/assets/pandi-hero.png" alt="Pandi" /></div>
          <aside className="missionBoard boxCard">
            <h2>🎁 Blind Box</h2>
            <p>Buka dan dapatkan ganjaran menarik untuk Pandi.</p>
            <button className="big purple" onClick={() => setScreen('box')}>Buka Sekarang ›</button>
          </aside>
          <div className="quickCards">
            <button onClick={() => setScreen('quiz')}>📗 <b>Quiz</b><span>Jawab & Belajar</span></button>
            <button>🌍 <b>Dunia</b><span>Teroka & Main</span></button>
            <button onClick={() => setScreen('box')}>🎒 <b>Koleksi</b><span>Item Pandi</span></button>
            <button onClick={() => setScreen('parents')}>👨‍👩‍👧 <b>Ibu Bapa</b><span>Laporan</span></button>
          </div>
        </section>
      )}

      {screen === 'quiz' && (
        <section className="playCard quizCard">
          <span className="pill">🌳 Hutan Matematik</span>
          <h1>5 + 3 = ?</h1>
          <div className="apples">🍎🍎🍎🍎🍎 <b>+</b> 🍎🍎🍎</div>
          <div className="answers">
            {[6,7,8,9].map(n => <button key={n} className={n===8 ? 'correct' : ''}> {n} </button>)}
          </div>
          <button className="big green" onClick={() => setScreen('box')}>Teruskan ›</button>
        </section>
      )}

      {screen === 'box' && (
        <section className="playCard rewardCard">
          <h1>Tahniah!</h1>
          <div className="gift">🎁</div>
          <p>Kamu dapat item baru: <b>Beg Sekolah Pandi</b></p>
          <button className="big green" onClick={() => setScreen('home')}>Kembali Home</button>
        </section>
      )}

      {screen === 'parents' && (
        <section className="playCard parentCard">
          <span className="pill">Untuk Ibu Bapa</span>
          <h1>Ringkasan Hari Ini</h1>
          <div className="stats"><b>10</b><b>8</b><b>80 XP</b></div>
          <p>Topik lemah: Tolak. Cadangan: latihan 5 minit setiap hari.</p>
          <button className="big green" onClick={() => setScreen('home')}>Selesai</button>
        </section>
      )}

      <nav className="dock">
        <button onClick={() => setScreen(name && state ? 'home' : 'welcome')}>🏠 Home</button>
        <button onClick={() => setScreen('quiz')}>📗 Quiz</button>
        <button onClick={() => setScreen('box')}>🎁 Box</button>
        <button onClick={() => setScreen('parents')}>👨‍👩‍👧 Ibu Bapa</button>
      </nav>
    </main>
  );
}
