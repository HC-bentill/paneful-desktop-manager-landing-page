import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Reveal, glyphs, GITHUB_URL, DOWNLOAD_URL, BASE } from './shared.jsx'

const orbitApps = [
  { label: 'Browsers', icon: glyphs.browser },
  { label: 'Chat', icon: glyphs.chat },
  { label: 'Code editors', icon: glyphs.code },
  { label: 'Terminal', icon: glyphs.terminal },
  { label: 'Mail', icon: glyphs.mail },
  { label: 'Design tools', icon: glyphs.design },
]

export default function Hero() {
  // Mouse parallax for the floating 3D logo.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [18, -18]), { stiffness: 120, damping: 14 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), { stiffness: 120, damping: 14 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section id="top" className="hero" onMouseMove={onMove}>
      <div className="hero-copy">
        <Reveal className="pill">
          <span className="pill-dot" /> Free &amp; open source · macOS
        </Reveal>
        <Reveal as="h1" delay={0.08}>
          Your windows,<br /><span className="grad-text">finally in order.</span>
        </Reveal>
        <Reveal as="p" delay={0.16} className="sub">
          Paneful snaps windows side by side, groups apps from <em>any</em> developer into tabs, and can
          tile new windows for you. One tidy desktop, zero dragging around.
        </Reveal>
        <Reveal delay={0.24} className="hero-ctas">
          <a href={DOWNLOAD_URL} className="btn btn--primary">Download for Mac</a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn btn--ghost">View on GitHub</a>
        </Reveal>
      </div>

      <div className="orbit-stage" aria-hidden="true">
        <div className="orbit-glow" />
        <div className="orbit-ring orbit-ring--outer" />
        <div className="orbit-ring orbit-ring--inner" />

        <div className="orbit-spin">
          {orbitApps.map((app, i) => {
            const angle = (360 / orbitApps.length) * i
            return (
              <div key={app.label} className="orbit-item" style={{ '--a': `${angle}deg` }}>
                <div className="orbit-chip">
                  <span className="orbit-icon">{app.icon}</span>
                  {app.label}
                </div>
              </div>
            )
          })}
        </div>

        <motion.div
          className="logo3d"
          style={{ rotateX: rx, rotateY: ry }}
          initial={{ opacity: 0, scale: 0.6, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="logo3d-float">
            <div className="logo3d-slab" />
            <img src={`${BASE}logo.svg`} alt="" className="logo3d-face" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
