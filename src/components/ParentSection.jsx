export default function ParentSection() {
  return (
    <section className="parent-section" id="ibu-bapa">
      <div>
        <p className="eyebrow">Untuk Ibu Bapa</p>
        <h2>Pantau kemajuan anak dengan lebih mudah.</h2>
        <p>Lihat streak, bintang, topik selesai dan cadangan aktiviti seterusnya dalam paparan yang kemas.</p>
      </div>
      <div className="dashboard-card">
        <div className="dash-top"><span>Progress Minggu Ini</span><strong>78%</strong></div>
        <div className="progress"><span /></div>
        <div className="dash-grid">
          <div><strong>5</strong><span>Hari streak</span></div>
          <div><strong>24</strong><span>Quiz siap</span></div>
          <div><strong>12</strong><span>Badge</span></div>
        </div>
      </div>
    </section>
  )
}
