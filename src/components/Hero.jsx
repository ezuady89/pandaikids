import { Play, Star, Trophy } from 'lucide-react'

export default function Hero() {
  return (
    <section className="hero" id="mula">
      <div className="hero-bg" />
      <div className="side-menu">
        <a href="#belajar">📚 Belajar</a>
        <a href="#quiz">🎮 Quiz</a>
        <a href="#dunia">🌈 Dunia</a>
        <a href="#ibu-bapa">👨‍👩‍👧 Ibu Bapa</a>
      </div>

      <div className="hero-content">
        <p className="eyebrow">Platform belajar kanak-kanak Malaysia</p>
        <h1>Belajar sambil bermain bersama Pandi.</h1>
        <p className="hero-copy">
          Aktiviti interaktif, quiz harian dan ganjaran menyeronokkan untuk bantu anak belajar dengan lebih konsisten.
        </p>
        <div className="hero-actions">
          <a className="primary-btn" href="#quiz"><Play size={18}/> Mula Belajar</a>
          <a className="secondary-btn" href="#ibu-bapa">Untuk Ibu Bapa</a>
        </div>
        <div className="stats-row">
          <div><Star/> <strong>4.9</strong><span>Rating ibu bapa</span></div>
          <div><Trophy/> <strong>100+</strong><span>Latihan awal</span></div>
        </div>
      </div>

      <div className="mascot-stage">
        <img src="/images/pandi-mascot.svg" alt="Pandi mascot" className="pandi" />
        <div className="coin coin-one">A+</div>
        <div className="coin coin-two">123</div>
        <div className="coin coin-three">ABC</div>
      </div>
    </section>
  )
}
