import { Menu, Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#">
        <span className="brand-mark">P</span>
        <span>PandaiKids</span>
      </a>
      <nav className="nav-links">
        <a href="#belajar">Belajar</a>
        <a href="#quiz">Quiz</a>
        <a href="#ibu-bapa">Ibu Bapa</a>
      </nav>
      <a className="header-cta" href="#mula"><Sparkles size={18}/> Mula Percuma</a>
      <button className="menu-btn" aria-label="Buka menu"><Menu /></button>
    </header>
  )
}
