import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal, Chevron, DOCS_URL } from './shared.jsx'

const steps = [
  { title: 'Install & allow access', body: 'Open Paneful and grant Accessibility access once. It lives quietly in your menu bar.', cards: ['Accessibility ✓', 'Menu bar ready', 'Shortcuts on'] },
  { title: 'Snap side by side', body: 'Drag any window to the left or right edge, or press ⌃⌥← and ⌃⌥→.', cards: ['Left half', 'Right half', 'Quarters'] },
  { title: 'Drop onto a title bar', body: 'Drag a window onto another window\'s title bar and they become tabs in one frame.', cards: ['Browser', 'Chat', 'Editor'] },
  { title: 'Let Paneful remember', body: 'Reopen any app and its window slips back into its tab group automatically.', cards: ['Group saved', 'Window reopened', 'Auto-tabbed'] },
]
const DURATION = 4500

export default function HowItWorks() {
  const [active, setActive] = useState(0)
  const [key, setKey] = useState(0) // restarts the progress bar animation

  useEffect(() => {
    const id = setTimeout(() => {
      setActive((a) => (a + 1) % steps.length)
      setKey((k) => k + 1)
    }, DURATION)
    return () => clearTimeout(id)
  }, [active, key])

  const select = (i) => { setActive(i); setKey((k) => k + 1) }

  return (
    <section id="how" className="section">
      <div className="panel how">
        <div className="how-top">
          <Reveal className="how-copy">
            <h2 className="h2-left">Learn how Paneful works.</h2>
            <p className="muted-sm">From install to perfectly organised in under a minute</p>
            <p>Paneful runs natively and needs no plugins or per-app setup. Here's the whole flow.</p>
            <span className="how-links">
              <a href="#download" className="btn btn--tiny">Start now <Chevron /></a>
              <a href={DOCS_URL} className="btn btn--tiny">Read the docs <Chevron /></a>
            </span>
          </Reveal>

          <div className="iso-wrap">
            <div className="iso-plane">
              <AnimatePresence mode="popLayout">
                {steps[active].cards.map((c, i) => (
                  <motion.div
                    key={`${active}-${c}`}
                    className="iso-card"
                    style={{ '--i': i }}
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60 }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <i /> {c}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                className="iso-caption"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {steps[active].title}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="steps">
          {steps.map((s, i) => (
            <button key={s.title} className={`step ${i === active ? 'is-active' : ''}`} onClick={() => select(i)}>
              <div className="step-bar">
                {i === active && (
                  <motion.div
                    key={key}
                    className="step-fill"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: DURATION / 1000, ease: 'linear' }}
                  />
                )}
              </div>
              <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="step-title">{s.title}</span>
              <span className="step-body">{s.body}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
