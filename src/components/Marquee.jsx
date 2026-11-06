import { BASE } from './shared.jsx'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/** A tiny Mac desktop showing a Paneful tab group snapped next to another window. */
function DesktopMock() {
  const tabs = ['Inbox — Mail', 'Team chat', 'Sprint board']
  const [active, setActive] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % tabs.length), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="mock">
      <div className="mock-screen">
        <div className="mock-menubar">
          <span /> <span /> <span />
          <div className="mock-menubar-right"><img src={`${BASE}logo.svg`} alt="" /></div>
        </div>
        <div className="mock-desk">
          <div className="mock-left">
            <div className="mock-tabbar">
              {tabs.map((t, i) => (
                <div key={t} className={`mock-tab ${i === active ? 'is-active' : ''}`}>
                  <i className={`mock-tab-dot dot-${i}`} />{t}
                </div>
              ))}
            </div>
            <div className="mock-win">
              <div className="mock-traffic"><b /><b /><b /></div>
              <motion.div
                key={active}
                className="mock-content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="mock-line w60" /><div className="mock-line w90" />
                <div className="mock-line w75" /><div className="mock-line w40" />
                <div className={`mock-block block-${active}`} />
                <div className="mock-line w80" /><div className="mock-line w55" />
              </motion.div>
            </div>
          </div>
          <div className="mock-right">
            <div className="mock-win">
              <div className="mock-traffic"><b /><b /><b /></div>
              <div className="mock-content">
                <div className="mock-code">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="mock-code-line" style={{ width: `${35 + ((i * 37) % 55)}%`, marginLeft: `${(i % 3) * 10}px` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Giant text slides sideways while the desktop mock rises into view, like the reference's phone reveal. */
export default function Marquee() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['8%', '-62%'])
  const mockY = useTransform(scrollYProgress, [0, 0.45], ['55%', '0%'])
  const mockScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.78, 1, 1.04])
  const mockRot = useTransform(scrollYProgress, [0, 0.45], [14, 0])

  return (
    <section ref={ref} className="marquee">
      <div className="marquee-sticky">
        <motion.div className="marquee-text" style={{ x }}>
          Level up your desktop&nbsp;·&nbsp;Snap&nbsp;·&nbsp;Tab&nbsp;·&nbsp;Focus
        </motion.div>
        <motion.div className="marquee-mock" style={{ y: mockY, scale: mockScale, rotateX: mockRot }}>
          <DesktopMock />
        </motion.div>
      </div>
    </section>
  )
}
