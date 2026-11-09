import { motion } from 'framer-motion'
import { SectionHead, Arrow } from './shared.jsx'

const features = [
  { title: 'Side-by-side snapping', body: 'Drag a window to the screen edge and a blurred preview shows where it lands. Halves, quarters and full screen.' },
  { title: 'Tabs across any apps', body: 'Put your browser, chat and editor in one frame with a floating tab bar. Click a tab to switch, or hold a file over it to drop it in.' },
  { title: 'Remembered groups', body: 'Reopen an app and its window jumps straight back into its tab group. No drag and drop.' },
  { title: 'Auto-tiling (optional)', body: 'Switch it on and new windows split the screen for you. Closing one hands its space back. Off by default.' },
  { title: 'Keyboard first', body: 'Control-Option shortcuts for every layout, tab switch and ungroup.' },
  { title: 'Open source, MIT', body: 'Native Swift with no telemetry and no account. Read the code, fork it, help improve it.' },
]

export default function Features() {
  return (
    <section id="features" className="section features">
      <SectionHead eyebrow="Features" title="General features" sub="Everything macOS should have shipped with." />
      <div className="spotlight" aria-hidden="true" />
      <div className="features-grid">
        {features.map((f, i) => (
          <motion.article
            key={f.title}
            className="feature-card"
            initial={{ opacity: 0, rotateX: 35, y: 60 }}
            whileInView={{ opacity: 1, rotateX: 12, y: 0 }}
            whileHover={{ rotateX: 0, y: -8 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="feature-top">
              <span className="feature-num">{String(i + 1).padStart(2, '0')}.</span>
              <span className="feature-arrow"><Arrow /></span>
            </div>
            <p>{f.body}</p>
            <h3>{f.title}</h3>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
