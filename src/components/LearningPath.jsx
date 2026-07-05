const items = [
  ['📖', 'Baca Ceria', 'Latihan huruf, perkataan dan bacaan asas.'],
  ['🔢', 'Nombor Bijak', 'Kira, tambah dan tolak secara visual.'],
  ['🧠', 'Quiz Harian', 'Cabaran pendek dengan markah dan ganjaran.'],
]

export default function LearningPath() {
  return (
    <section className="section" id="belajar">
      <div className="section-head">
        <p className="eyebrow">Dunia Pembelajaran</p>
        <h2>Modul ringkas, cantik dan mudah diikuti.</h2>
      </div>
      <div className="cards">
        {items.map(([icon, title, text]) => (
          <article className="card" key={title}>
            <span className="card-icon">{icon}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
