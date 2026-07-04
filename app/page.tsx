'use client';

import { useMemo, useState } from 'react';

type Screen = 'home' | 'quiz' | 'reward' | 'blind' | 'collection' | 'parent';

const skins = [
  ['pandi-front.png', 'Pandi Hijau', 'Dipakai'],
  ['pandi-explorer.png', 'Explorer', 'Unlocked'],
  ['pandi-doctor.png', 'Doktor', 'Unlocked'],
  ['pandi-polis.png', 'Polis', 'Locked'],
  ['pandi-bomba.png', 'Bomba', 'Locked'],
  ['pandi-teacher.png', 'Guru', 'Unlocked']
];

export default function PandaiKidsBuild07() {
  const [screen, setScreen] = useState<Screen>('home');
  const [name, setName] = useState('Adam');
  const [stateName, setStateName] = useState('Kelantan');
  const [boxOpen, setBoxOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [coins, setCoins] = useState(850);
  const [stars, setStars] = useState(125);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat pagi';
    if (h < 19) return 'Selamat petang';
    return 'Selamat malam';
  }, []);

  function go(next: Screen) {
    setBoxOpen(false);
    setCelebrate(false);
    setScreen(next);
  }

  function correctAnswer() {
    setStars((s) => s + 10);
    setCoins((c) => c + 5);
    setCelebrate(true);
    setTimeout(() => go('reward'), 450);
  }

  function renameChild() {
    const v = window.prompt('Nama anak?', name);
    if (v && v.trim()) setName(v.trim().slice(0, 14));
  }

  function changeState() {
    const v = window.prompt('Negeri?', stateName);
    if (v && v.trim()) setStateName(v.trim().slice(0, 18));
  }

  return (
    <main className={`pk-app screen-${screen} ${celebrate ? 'celebrate-now' : ''}`}>
      <AnimatedWorld />
      <div className="build-stamp">NEXT BUILD 07 • NEW FILE ACTIVE</div>

      <header className="pk-topbar">
        <div className="pk-brand" onClick={() => go('home')}>
          <img src="/assets/pandi-icon.png" alt="Pandi" />
          <div>
            <strong>Pandai<span>K</span><i>i</i><em>ds</em></strong>
            <small>Belajar Sambil Bermain</small>
          </div>
        </div>
        <div className="pk-stats">
          <div>⭐ <b>{stars}</b></div>
          <div>🪙 <b>{coins}</b></div>
          <div>🚩 <b>{stateName}</b></div>
        </div>
      </header>

      {screen === 'home' && (
        <section className="pk-screen home-screen">
          <div className="hero-canvas">
            <div className="sun-ray" />
            <div className="hero-glow" />
            <div className="speech-card">
              <span>{greeting}, kawan Pandi 👋</span>
              <h1>Hai <b>{name}</b>!</h1>
              <p>Hari ini Pandi bawa awak masuk ke dunia belajar yang lebih hidup.</p>
            </div>
            <img className="hero-pandi" src="/assets/pandi-front.png" alt="Pandi" />
            <div className="floating-badge badge-a">🌳 Hutan Matematik</div>
            <div className="floating-badge badge-b">📦 Blind Box</div>
            <div className="floating-badge badge-c">⭐ Reward</div>
          </div>

          <aside className="game-menu">
            <div className="menu-logo">
              <div className="logo-text">Pandai<span>K</span><i>i</i><em>ds</em></div>
              <p>Main. Belajar. Pandai.</p>
            </div>

            <div className="adventure-map">
              <div className="map-line" />
              <div className="node active">1</div>
              <div className="node">2</div>
              <div className="node locked">🔒</div>
              <h2>Pengembaraan Hari Ini</h2>
              <p>Jawab 10 soalan, kumpul coin dan buka item baru untuk Pandi.</p>
            </div>

            <div className="menu-buttons">
              <button className="primary" onClick={() => go('quiz')}>▶ Mula Belajar</button>
              <button onClick={() => go('blind')}>📦 Blind Box</button>
              <button onClick={() => go('collection')}>🎒 Koleksi</button>
              <button onClick={() => go('parent')}>👨‍👩‍👧 Ibu Bapa</button>
            </div>

            <div className="tiny-actions">
              <button onClick={renameChild}>Tukar Nama</button>
              <button onClick={changeState}>Tukar Negeri</button>
            </div>
          </aside>
        </section>
      )}

      {screen === 'quiz' && (
        <section className="pk-screen center-screen">
          <div className="quiz-card premium-panel">
            <button className="back" onClick={() => go('home')}>← Home</button>
            <div className="quiz-hud">
              <span>❤️❤️❤️</span><span>Soalan 3/10</span><span>⏱️ 00:18</span>
            </div>
            <div className="quiz-layout">
              <div className="teacher-zone">
                <img src="/assets/pandi-teacher.png" alt="Pandi mengajar" />
                <div className="teacher-bubble">Jom kira epal sama-sama. Pandi tahu awak boleh!</div>
              </div>
              <div className="wood-board">
                <div className="lesson-pill">🍎 Pokok Nombor</div>
                <h1>5 + 3 = ?</h1>
                <div className="apple-row">🍎🍎🍎🍎🍎 <b>+</b> 🍎🍎🍎</div>
                <div className="answer-grid">
                  {[6, 7, 8, 9].map((n) => (
                    <button key={n} onClick={n === 8 ? correctAnswer : undefined} className={n === 8 ? 'right-answer' : ''}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {screen === 'reward' && (
        <section className="pk-screen center-screen">
          <div className="reward-stage premium-panel dark-panel">
            <button className="back light" onClick={() => go('home')}>← Home</button>
            <Confetti />
            <h1>BETUL!</h1>
            <img src="/assets/pandi-front.png" alt="Pandi reward" />
            <div className="reward-row">
              <div>⭐ <b>+10 XP</b></div>
              <div>🪙 <b>+5 Coin</b></div>
              <div>📦 <b>+1 Box</b></div>
            </div>
            <button className="primary big" onClick={() => go('blind')}>Buka Blind Box →</button>
          </div>
        </section>
      )}

      {screen === 'blind' && (
        <section className="pk-screen center-screen">
          <div className="blind-stage premium-panel dark-panel">
            <button className="back light" onClick={() => go('home')}>← Home</button>
            <h1>Blind Box Pandi</h1>
            <p>Tekan kotak untuk buka item baru.</p>
            <button className={`gift-box ${boxOpen ? 'opened' : ''}`} onClick={() => setBoxOpen(true)}>🎁</button>
            {boxOpen && (
              <div className="item-card">
                <img src="/assets/pandi-explorer.png" alt="Pandi Explorer" />
                <h2>Kostum Explorer!</h2>
                <p>Pandi boleh meneroka dunia nombor dengan gaya baru.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {screen === 'collection' && (
        <section className="pk-screen center-screen">
          <div className="collection-panel premium-panel">
            <button className="back" onClick={() => go('home')}>← Home</button>
            <h1>Koleksi Pandi</h1>
            <div className="skin-grid">
              {skins.map(([img, title, status]) => (
                <div className={`skin-card ${status === 'Locked' ? 'locked' : ''}`} key={title}>
                  <img src={`/assets/${img}`} alt={title} />
                  <b>{title}</b>
                  <small>{status}</small>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {screen === 'parent' && (
        <section className="pk-screen center-screen">
          <div className="parent-panel premium-panel">
            <button className="back" onClick={() => go('home')}>← Home</button>
            <h1>Untuk Ibu Bapa</h1>
            <div className="metrics">
              <div><b>30</b><span>Soalan</span></div>
              <div><b>27</b><span>Betul</span></div>
              <div><b>3</b><span>Salah</span></div>
              <div><b>8m</b><span>Masa</span></div>
            </div>
            <div className="weak-topic">
              <h2>Topik Lemah</h2>
              <label>Tolak <span>60%</span></label><i style={{ width: '60%' }} />
              <label>Wang <span>70%</span></label><i style={{ width: '70%' }} />
              <label>Masa <span>90%</span></label><i className="green" style={{ width: '90%' }} />
            </div>
            <div className="parent-note">💡 Cadangan: {name} perlu lebih latihan dalam topik Tolak.</div>
          </div>
        </section>
      )}

      <nav className="dock">
        <button onClick={() => go('home')}>🏠 Home</button>
        <button onClick={() => go('quiz')}>🧮 Quiz</button>
        <button onClick={() => go('blind')}>📦 Box</button>
        <button onClick={() => go('collection')}>🎒 Koleksi</button>
        <button onClick={() => go('parent')}>📊 Ibu Bapa</button>
      </nav>
    </main>
  );
}

function AnimatedWorld() {
  return (
    <div className="world" aria-hidden="true">
      <div className="sky-orb" />
      <div className="cloud c1" /><div className="cloud c2" /><div className="cloud c3" />
      <div className="mountain m1" /><div className="mountain m2" /><div className="mountain m3" />
      <div className="hill back" /><div className="hill front" />
      <div className="river" />
      <div className="tree t1" /><div className="tree t2" /><div className="tree t3" /><div className="tree t4" />
      <span className="bird b1">🦜</span><span className="bird b2">🐦</span>
      <span className="leaf l1">🍃</span><span className="leaf l2">🍂</span><span className="leaf l3">🌸</span><span className="leaf l4">🍃</span>
      <span className="spark s1" /><span className="spark s2" /><span className="spark s3" /><span className="spark s4" />
    </div>
  );
}

function Confetti() {
  return <>{Array.from({ length: 18 }).map((_, i) => <span className="confetti" key={i} style={{ left: `${(i * 7) % 96}%`, animationDelay: `${(i % 6) * .14}s` }} />)}</>;
}
