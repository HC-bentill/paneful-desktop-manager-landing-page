import { useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal, DOWNLOAD_URL, RELEASES_URL } from './shared.jsx'

export default function Cta() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email.includes('@')) return
    // TODO: wire to a real mailing list (e.g. Buttondown / GitHub releases RSS).
    setSent(true)
  }

  return (
    <section id="download" className="section">
      <div className="panel cta">
        <Reveal as="h2">Get Paneful</Reveal>
        <Reveal as="p" delay={0.08} className="sub">
          Free for macOS 27.2 and later. Download the latest version, or get an email when new releases ship.
        </Reveal>
        <Reveal delay={0.16} className="cta-row">
          <a href={DOWNLOAD_URL} className="btn btn--primary">Download for Mac (.dmg)</a>
        </Reveal>
        <Reveal delay={0.19} as="p" className="muted-sm install-note">
          Open the DMG and drag Paneful to Applications. On first launch, if macOS can't verify the developer, go to
          System Settings → Privacy &amp; Security and click <strong>Open Anyway</strong>, then allow Accessibility.{' '}
          <a href={RELEASES_URL} target="_blank" rel="noreferrer">All releases</a>
        </Reveal>
        <Reveal delay={0.22}>
          {sent ? (
            <p className="cta-thanks">Thanks! We'll let you know when the next release ships.</p>
          ) : (
            <form className="cta-form" onSubmit={submit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
              />
              <button className="btn btn--small btn--light" type="submit">Notify me</button>
            </form>
          )}
        </Reveal>
        <Reveal delay={0.28} as="p" className="muted-sm">
          Join the community building <span className="grad-text">a calmer desktop</span>.
        </Reveal>
        <motion.div
          className="cta-glow"
          aria-hidden="true"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </section>
  )
}
