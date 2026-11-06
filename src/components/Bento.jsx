import { SectionHead, Reveal } from './shared.jsx'

const cards = [
  { title: 'Built for deep focus', body: 'One frame per task. Your research, chat and docs stay together instead of hiding behind each other.', wide: false },
  { title: 'Light as air', body: 'Native Swift and AppKit. Paneful idles at near-zero CPU and never touches your files.', wide: false },
  { title: 'Floats until you say so', body: 'New windows open where their apps put them. Nothing gets tabbed until you drop it onto a group, and after that Paneful remembers.', wide: true },
]

function GlowCard({ title, body, wide, delay }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <Reveal delay={delay} className={`glow-card ${wide ? 'glow-card--wide' : ''}`}>
      <div onMouseMove={onMove} className="glow-card-inner">
        <span className="orb orb--tl" />
        <span className="orb orb--r" />
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </Reveal>
  )
}

export default function Bento() {
  return (
    <section className="section">
      <div className="panel">
        <SectionHead title="Calm with Paneful" sub="A desktop that stays out of your way." />
        <div className="bento">
          {cards.map((c, i) => <GlowCard key={c.title} {...c} delay={i * 0.1} />)}
        </div>
      </div>
    </section>
  )
}
