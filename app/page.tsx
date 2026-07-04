'use client';

import { useMemo, useState } from 'react';

const negeriList = ['Johor','Kedah','Kelantan','Terengganu','Sabah','Sarawak','Selangor','Perak','Pahang','Pulau Pinang','Negeri Sembilan','Melaka','Perlis','Kuala Lumpur'];
const umurList = ['5 tahun','6 tahun','7 tahun','8 tahun','9 tahun'];
const avatarList = [
  { id: 'explorer', label: 'Explorer', emoji: '🧭' },
  { id: 'pelajar', label: 'Pelajar', emoji: '🎓' },
  { id: 'super', label: 'Hero', emoji: '⭐' },
  { id: 'saintis', label: 'Saintis', emoji: '🔬' }
];

export default function HomePage() {
  const [nama, setNama] = useState('');
  const [negeri, setNegeri] = useState('');
  const [umur, setUmur] = useState('');
  const [avatar, setAvatar] = useState('explorer');
  const [mula, setMula] = useState(false);

  const ready = nama.trim().length > 1 && negeri && umur;
  const greeting = useMemo(() => {
    if (!nama.trim()) return 'Hai kawan! 👋';
    return `Hai ${nama.trim()}! 👋`;
  }, [nama]);

  return (
    <main className="pageShell">
      <div className="bgScene" />
      <div className="sceneGlow sceneGlowA" />
      <div className="sceneGlow sceneGlowB" />

      <header className="topBar">
        <div className="brandCard glass">
          <img src="/assets/pandi-logo-icon.png" alt="Logo PandaiKids" className="brandIcon" />
          <div>
            <h1>PandaiKids</h1>
            <p>Belajar Sambil Bermain</p>
          </div>
        </div>

        <nav className="mainNav glass" aria-label="Menu utama">
          <button className="navItem active"><span>🏠</span><b>Home</b></button>
          <button className="navItem"><span>❓</span><b>Quiz</b></button>
          <button className="navItem"><span>🌍</span><b>Dunia</b></button>
          <button className="navItem"><span>🎒</span><b>Koleksi</b></button>
          <button className="navItem"><span>👨‍👩‍👧</span><b>Ibu Bapa</b></button>
        </nav>

        <div className="headerRight">
          <div className="counterPill glass"><span>⭐</span><b>0</b></div>
          <div className="counterPill glass"><span>🪙</span><b>0</b></div>
          <div className="counterPill glass"><span>💎</span><b>0</b></div>
          <button className="gearButton glass" aria-label="Tetapan">⚙️</button>
        </div>
      </header>

      <div className="buildBadge">BUILD 11 • CLEAN BACKGROUND ACTIVE</div>

      <section className="contentGrid">
        <aside className="leftCard glass panelCard">
          {!mula ? (
            <>
              <div className="miniPill">Hai kawan baru! 👋</div>
              <h2 className="panelTitle">Pandi nak <span>kenal awak</span> dulu!</h2>
              <p className="panelDesc">Sebelum mula belajar, isi nama, negeri dan umur dahulu ya.</p>

              <label className="fieldWrap">
                <span>Nama awak</span>
                <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Contoh: Aisyah" />
              </label>

              <label className="fieldWrap">
                <span>Pilih negeri</span>
                <select value={negeri} onChange={(e) => setNegeri(e.target.value)}>
                  <option value="">Sila pilih negeri</option>
                  {negeriList.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <label className="fieldWrap">
                <span>Umur awak</span>
                <select value={umur} onChange={(e) => setUmur(e.target.value)}>
                  <option value="">Sila pilih umur</option>
                  {umurList.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <div className="avatarChooser">
                <span>Pilih avatar Pandi</span>
                <div className="avatarGrid">
                  {avatarList.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`avatarChip ${avatar === item.id ? 'selected' : ''}`}
                      onClick={() => setAvatar(item.id)}
                    >
                      <strong>{item.emoji}</strong>
                      <small>{item.label}</small>
                    </button>
                  ))}
                </div>
              </div>

              <button className="primaryCta" disabled={!ready} onClick={() => setMula(true)}>
                Jom Mulakan Pengembaraan! 🚀
              </button>
              <small className="helperText">Tiada nama/negeri preset. Semua pengguna baru akan ditanya dahulu.</small>
            </>
          ) : (
            <>
              <div className="miniPill">Maklumat lengkap ✅</div>
              <h2 className="panelTitle">{greeting}</h2>
              <p className="panelDesc">Pandi dah kenal awak dari <b>{negeri}</b>. Jom masuk dunia belajar dan kumpul ganjaran!</p>
              <div className="summaryBox">
                <div><span>Nama</span><b>{nama}</b></div>
                <div><span>Negeri</span><b>{negeri}</b></div>
                <div><span>Umur</span><b>{umur}</b></div>
                <div><span>Avatar</span><b>{avatarList.find((a) => a.id === avatar)?.label}</b></div>
              </div>
              <button className="primaryCta">Masuk Belajar Sekarang ▶</button>
              <button className="secondaryCta" onClick={() => setMula(false)}>Tukar Maklumat</button>
            </>
          )}
        </aside>

        <section className="heroArea">
          <div className="speechBubble glass">
            <p>{greeting}</p>
            <h3>Jom belajar sambil bermain dengan Pandi!</h3>
          </div>
          <img src="/assets/pandi-official.png" alt="Pandi maskot rasmi" className="pandiHero" />
        </section>

        <aside className="rightArea">
          <div className="rewardCard glass">
            <div>
              <span className="rewardLabel">Blind Box</span>
              <h3>Buka dan dapatkan ganjaran menarik!</h3>
            </div>
            <div className="giftBox">🎁</div>
            <button className="rewardBtn">Buka Sekarang!</button>
          </div>

          <div className="missionCard woodPanel">
            <div className="missionHead">
              <h3>🎯 Misi Harian</h3>
              <div className="missionProgress">1/3</div>
            </div>
            <div className="missionItem"><span>🔢 Jawab 10 soalan matematik</span><b>0/10</b></div>
            <div className="missionItem"><span>🪙 Kumpul 5 coin</span><b>0/5</b></div>
            <div className="missionItem"><span>🎁 Buka 1 Blind Box</span><b>0/1</b></div>
            <button className="missionBtn">Lihat Semua Misi</button>
          </div>
        </aside>
      </section>

      <section className="bottomCards">
        <article className="bottomCard green">
          <div className="bottomIcon">❓</div>
          <div><h4>Quiz</h4><p>Jawab & Belajar</p></div>
          <span>›</span>
        </article>
        <article className="bottomCard blue">
          <div className="bottomIcon">🌍</div>
          <div><h4>Dunia</h4><p>Teroka & Main</p></div>
          <span>›</span>
        </article>
        <article className="bottomCard purple">
          <div className="bottomIcon">🎒</div>
          <div><h4>Koleksi</h4><p>Item & Pencapaian</p></div>
          <span>›</span>
        </article>
        <article className="bottomCard gold">
          <div className="bottomIcon">👨‍👩‍👧</div>
          <div><h4>Ibu Bapa</h4><p>Pantau & Laporan</p></div>
          <span>›</span>
        </article>
      </section>
    </main>
  );
}
