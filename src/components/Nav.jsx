import { useEffect, useState } from 'react'
import { Logo, GITHUB_URL, BASE, DOCS_URL } from './shared.jsx'

/** Shared top bar for the landing page and the docs page. */
export default function Nav({ page = 'home' }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a href={BASE} className="brand">
        <Logo size={28} />
        <span>Paneful</span>
        {page === 'docs' && <span className="brand-tag">Docs</span>}
      </a>
      <nav className="nav-links">
        <a href={`${BASE}#features`}>Features</a>
        <a href={`${BASE}#how`}>How it works</a>
        <a href={DOCS_URL} className={page === 'docs' ? 'is-current' : ''}>Docs</a>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a>
      </nav>
      <a href={`${BASE}#download`} className="btn btn--small btn--primary">Download</a>
    </header>
  )
}
