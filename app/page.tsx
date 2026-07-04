'use client';

import { useState } from 'react';

const negeri = ['Johor','Kedah','Kelantan','Terengganu','Sabah','Sarawak','Selangor','Perak','Pahang','Pulau Pinang','Negeri Sembilan','Melaka','Perlis','Kuala Lumpur'];

export default function HomePage() {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [started, setStarted] = useState(false);

  return (
    <main className="stage">
      <div className="bg" />
      <div className="shade" />
      <div className="badge">BUILD 09 • PREMIUM MOCKUP ACTIVE</div>

      {!started ? (
        <section className="realForm" aria-label="Pandi kenal pengguna">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Aisyah" />
          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">Sila pilih negeri</option>
            {negeri.map((n) => <option key={n}>{n}</option>)}
          </select>
          <select defaultValue="">
            <option value="">Sila pilih umur</option>
            <option>5 tahun</option><option>6 tahun</option><option>7 tahun</option><option>8 tahun</option><option>9 tahun</option>
          </select>
          <button onClick={() => setStarted(Boolean(name && state))}>Jom Mulakan Pengembaraan! 🚀</button>
        </section>
      ) : (
        <section className="welcomeCard">
          <span>Hai {name}! 👋</span>
          <strong>Pandi dah kenal awak dari {state}.</strong>
          <button onClick={() => setStarted(false)}>Tukar Nama / Negeri</button>
        </section>
      )}
    </main>
  );
}
