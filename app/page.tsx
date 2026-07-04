'use client';

import { useState } from 'react';

const negeri = ['Johor','Kedah','Kelantan','Terengganu','Sabah','Sarawak','Selangor','Perak','Pahang','Pulau Pinang','Negeri Sembilan','Melaka','Perlis','Kuala Lumpur'];
const umur = ['5 tahun','6 tahun','7 tahun','8 tahun','9 tahun'];

export default function HomePage() {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [age, setAge] = useState('');
  const [started, setStarted] = useState(false);

  const ready = name.trim() && state && age;

  return (
    <main className="stage">
      <div className="art" />
      <div className="buildBadge">BUILD 10 • HOMEPAGE FIX</div>

      {!started ? (
        <section className="formLayer" aria-label="Borang mula PandaiKids">
          <label>
            <span>Nama awak</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Aisyah" />
          </label>
          <label>
            <span>Pilih negeri</span>
            <select value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Sila pilih negeri</option>
              {negeri.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <label>
            <span>Umur awak</span>
            <select value={age} onChange={(e) => setAge(e.target.value)}>
              <option value="">Sila pilih umur</option>
              {umur.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </label>
          <button disabled={!ready} onClick={() => setStarted(true)}>Jom Mulakan Pengembaraan! 🚀</button>
          <small>Tiada preset Adam/Kelantan. Pandi tanya dahulu.</small>
        </section>
      ) : (
        <section className="welcomeLayer">
          <p>Hai {name}! 👋</p>
          <h1>Pandi dah kenal awak dari {state}.</h1>
          <span>Umur: {age}</span>
          <button onClick={() => setStarted(false)}>Tukar Maklumat</button>
        </section>
      )}
    </main>
  );
}
