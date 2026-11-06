import { useEffect, useState } from 'react'
import { Logo, GITHUB_URL } from './shared.jsx'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a href="#top" className="brand">
        <Logo size={28} />
        <span>Paneful</span>
      </a>
      <nav className="nav-links">
        <a href="#features">Features</a>
        <a href="#how">How it works</a>
        <a href="#memory">Tab memory</a>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
      </nav>
      <a href="#download" className="btn btn--small btn--primary">Download</a>
    </header>
  )
}
