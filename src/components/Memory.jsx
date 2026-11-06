import { motion } from 'framer-motion'
import { Reveal, glyphs, Chevron } from './shared.jsx'

const floaters = [
  { icon: glyphs.browser, x: '18%', y: '28%', d: 0 },
  { icon: glyphs.chat, x: '74%', y: '22%', d: 0.6 },
  { icon: glyphs.code, x: '22%', y: '72%', d: 1.2 },
  { icon: glyphs.music, x: '78%', y: '70%', d: 0.3 },
  { icon: glyphs.folder, x: '50%', y: '86%', d: 0.9 },
]

export default function Memory() {
  return (
    <section id="memory" className="section">
      <div className="panel memory">
        <Reveal className="memory-art">
          <div className="memory-card">
            <motion.div
              className="memory-badge"
              animate={{ boxShadow: ['0 0 0 0 rgba(255,106,92,.55)', '0 0 0 22px rgba(255,106,92,0)'] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              <img src="/logo.svg" alt="" />
            </motion.div>
            {floaters.map((f, i) => (
              <motion.span
                key={i}
                className="memory-float"
                style={{ left: f.x, top: f.y }}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={{ y: [0, -12, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.3 + f.d * 0.4 },
                  scale: { duration: 0.6, delay: 0.3 + f.d * 0.4 },
                  y: { duration: 4, delay: f.d, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                {f.icon}
              </motion.span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="memory-copy">
          <h2 className="h2-left">Paneful remembers your tab groups</h2>
          <p className="muted-sm">So you never rebuild your workspace again</p>
          <p>
            Group your browser and team chat once. Next time either app opens, its window joins the group
            as a tab on its own, even after a restart.
          </p>
          <ul className="checks">
            <li>Remembers groups across restarts</li>
            <li>New windows float until you choose to tab them</li>
            <li>Forget a group anytime from the menu bar</li>
          </ul>
          <a href="#download" className="btn btn--tiny">Start now <Chevron /></a>
        </Reveal>
      </div>
    </section>
  )
}
