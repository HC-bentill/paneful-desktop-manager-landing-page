import { Logo, GITHUB_URL, Reveal, BASE, DOCS_URL } from './shared.jsx'

const cols = [
  { title: 'Product', links: [['Features', `${BASE}#features`], ['How it works', `${BASE}#how`], ['Tab memory', `${BASE}#memory`], ['Download', `${BASE}#download`]] },
  { title: 'Open source', links: [['GitHub', GITHUB_URL], ['Releases', `${GITHUB_URL}/releases`], ['Issues', `${GITHUB_URL}/issues`], ['MIT License', `${GITHUB_URL}/blob/main/LICENSE`]] },
  { title: 'Docs', links: [['Getting started', `${DOCS_URL}#getting-started`], ['Tab groups', `${DOCS_URL}#tab-groups`], ['Desktops', `${DOCS_URL}#desktops`], ['Auto-tiling', `${DOCS_URL}#auto-tiling`], ['Saved layouts', `${DOCS_URL}#saved-layouts`], ['Shortcuts', `${DOCS_URL}#shortcuts`], ['FAQ', `${DOCS_URL}#troubleshooting`]] },
]

export default function Footer() {
  return (
    <footer className="footer">
      <Reveal className="footer-inner">
        <div className="footer-brand">
          <a href={BASE} className="brand"><Logo size={26} /><span>Paneful</span></a>
          <p>Snap windows side by side and group any apps into tabs. Built in the open for macOS.</p>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn btn--tiny">Star on GitHub</a>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="footer-col">
            <h4>{c.title}</h4>
            {c.links.map(([label, href]) => (
              <a key={label} href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{label}</a>
            ))}
          </div>
        ))}
      </Reveal>
      <div className="footer-bottom">© {new Date().getFullYear()} Paneful Desktop Manager · MIT License</div>
    </footer>
  )
}
