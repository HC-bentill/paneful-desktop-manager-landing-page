import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { BASE, glyphs } from '../components/shared.jsx'

/**
 * A tiny animated Mac desktop. Each demo is a list of "steps": full snapshots of the scene
 * (window frames, cursor, preview, tab bar, keys, caption) plus how long to hold them.
 * The stage loops through the steps while it is on screen, and framer-motion tweens between them.
 *
 * Coordinates are percentages of the desktop area (below the menu bar).
 */

export const APPS = {
  A: { title: 'Browser', icon: glyphs.browser, tint: '#4ea1ff' },
  B: { title: 'Team chat', icon: glyphs.chat, tint: '#9b6bff' },
  C: { title: 'Code editor', icon: glyphs.code, tint: '#ff6a5c' },
  D: { title: 'Mail', icon: glyphs.mail, tint: '#34d399' },
  E: { title: 'Finder', icon: glyphs.folder, tint: '#f5b544' },
  // A second Finder window (windows are keyed by id, so two windows of one app need two ids).
  E2: { title: 'Downloads', app: 'Finder', icon: glyphs.folder, tint: '#f5b544' },
}

/** A generic document icon, for the file that gets dragged around. */
const fileGlyph = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M6 3h8l5 5v13H6V3Z" fill="#fff" /><path d="M14 3v5h5" /><path d="M9 13h7M9 16.5h5" strokeLinecap="round" />
  </svg>
)

const ease = [0.22, 1, 0.36, 1]
const TAB_H = 8 // tab bar height, % of desktop

/** Plays steps in a loop while visible. Returns [index, step, paused toggler]. */
function useTimeline(steps, inView) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (!inView || paused) return
    const id = setTimeout(() => setI((n) => (n + 1) % steps.length), steps[i].d ?? 1400)
    return () => clearTimeout(id)
  }, [i, inView, paused, steps])
  return { i, step: steps[i], paused, togglePause: () => setPaused((p) => !p), restart: () => setI(0) }
}

/**
 * f.ph: shows the window as a dark placeholder tile (app icon + name), like auto-tiling does while an app
 * launches. Turning it off cross-fades to the real window.
 * f.hl: the window highlights itself as a drop target (something is being dragged over it).
 */
function Window({ id, f, active }) {
  const app = APPS[id]
  const hidden = !f || f.o === 0
  return (
    <motion.div
      className={`dwin ${active ? 'is-active' : ''} ${f?.hl ? 'is-drop' : ''}`}
      initial={false}
      animate={{
        left: `${f?.x ?? 40}%`, top: `${f?.y ?? 30}%`, width: `${f?.w ?? 30}%`, height: `${f?.h ?? 40}%`,
        opacity: hidden ? 0 : 1, scale: f?.s ?? 1,
      }}
      style={{ zIndex: f?.z ?? 1, '--tint': app.tint }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="dwin-bar">
        <span className="dwin-lights"><b /><b /><b /></span>
        <span className="dwin-title"><i>{app.icon}</i>{app.title}</span>
      </div>
      <div className="dwin-body">
        <div className="dwin-hero" />
        <div className="dwin-line w80" /><div className="dwin-line w60" /><div className="dwin-line w70" />
      </div>
      <motion.div
        className="dwin-ph"
        initial={false}
        animate={{ opacity: f?.ph ? 1 : 0 }}
        transition={{ duration: 0.45 }}
        aria-hidden="true"
      >
        <i>{app.icon}</i>
        <span>{app.app ?? app.title}</span>
      </motion.div>
    </motion.div>
  )
}

/** A file being dragged: { x, y, name, lifted, s, o, key }. A new key fades the old one out and the new one in. */
function DragFile({ f }) {
  return (
    <AnimatePresence>
      {f && (
        <motion.div
          key={f.key ?? 'file'}
          className={`dfile ${f.lifted ? 'is-lifted' : ''}`}
          initial={{ opacity: 0, scale: 0.6, x: '-50%', y: '-50%', left: `${f.x}%`, top: `${f.y}%` }}
          animate={{ opacity: f.o ?? 1, scale: f.s ?? 1, x: '-50%', y: '-50%', left: `${f.x}%`, top: `${f.y}%` }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.7, ease }}
        >
          <i>{fileGlyph}</i>
          <span>{f.name}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TabBar({ t }) {
  return (
    <AnimatePresence>
      {t && (
        <motion.div
          className="dtabbar"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0, left: `${t.x}%`, top: `${t.y - TAB_H}%`, width: `${t.w}%` }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.6, ease }}
          style={{ height: `${TAB_H - 1}%` }}
        >
          <AnimatePresence initial={false}>
            {t.items.map((id) => {
              // t.drag = { id, dx, out }: the tab being dragged is lifted, shifted sideways by dx (% of its
              // width), and dips and fades while it is pulled out of the bar. t.hover = id outlines a tab that
              // something is held over. t.away = [ids]: dimmed tabs whose windows are elsewhere (another
              // desktop, or macOS full screen).
              const drag = t.drag?.id === id ? t.drag : null
              const away = t.away?.includes(id)
              return (
                <motion.div
                  key={id}
                  layout
                  className={`dtab ${t.active === id ? 'is-active' : ''} ${drag ? 'is-lifted' : ''} ${t.hover === id ? 'is-hover' : ''} ${away ? 'is-away' : ''}`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: drag?.out ? 0.45 : 1, scale: 1, x: drag?.dx ?? '0%', y: drag?.out ? '45%' : '0%' }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <i style={{ color: APPS[id].tint }}>{APPS[id].icon}</i>
                  <span>{APPS[id].title}</span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Mission Control's row of desktops: { items: [{ label, x, y, w, h, on, hl, mini }] }. Each desktop is a small
 * picture at the given rect (% of the desktop area) with its name below. `on` marks the desktop you're on, `hl`
 * highlights it as a drop target, and `mini` lists what's on it (app ids, or 'bar' for a tab bar), drawn as
 * tiny windows that pop in as they arrive.
 */
function SpacesRow({ s }) {
  return (
    <AnimatePresence>
      {s && (
        <motion.div
          className="dspaces"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease }}
        >
          {s.items.map((sp) => (
            <div
              key={sp.label}
              className={`dspace ${sp.on ? 'is-on' : ''} ${sp.hl ? 'is-drop' : ''}`}
              style={{ left: `${sp.x}%`, top: `${sp.y}%`, width: `${sp.w}%`, height: `${sp.h}%` }}
            >
              <div className="dspace-pic">
                <AnimatePresence>
                  {(sp.mini ?? []).map((id, n) => (
                    <motion.i
                      key={id}
                      className={id === 'bar' ? 'is-bar' : ''}
                      style={id === 'bar' ? undefined : { background: APPS[id].tint, left: `${16 + n * 7}%`, top: `${26 + n * 6}%` }}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <span>{sp.label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Preview({ p }) {
  return (
    <AnimatePresence>
      {p && (
        <motion.div
          className="dpreview"
          initial={{ opacity: 0, left: `${p.x + 4}%`, top: `${p.y + 4}%`, width: `${p.w - 8}%`, height: `${p.h - 8}%` }}
          animate={{ opacity: 1, left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%` }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          {p.label && <span className="dpreview-label">{p.label}</span>}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Cursor({ c }) {
  if (!c) return null
  return (
    <motion.div
      className="dcursor"
      initial={false}
      animate={{ left: `${c.x}%`, top: `${c.y}%`, scale: c.down ? 0.85 : 1, opacity: c.hide ? 0 : 1 }}
      transition={{ duration: c.fast ? 0.35 : 0.7, ease }}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%">
        <path d="M5 3l14 8-6 1.6L10 19z" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      {c.down && <span className="dcursor-ring" />}
    </motion.div>
  )
}

function Keys({ k }) {
  return (
    <div className="dkeys" aria-hidden="true">
      <AnimatePresence mode="popLayout">
        {k && k.map((key, idx) => (
          <motion.kbd
            key={`${key}-${idx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: idx * 0.06 }}
          >
            {key}
          </motion.kbd>
        ))}
      </AnimatePresence>
    </div>
  )
}

/** Paneful's on-screen confirmation: { title, detail }, a small dark pop-up in the lower part of the screen. */
function Toast({ t }) {
  return (
    <AnimatePresence mode="wait">
      {t && (
        <motion.div
          key={`${t.title}|${t.detail}`}
          className="dtoast"
          // x: -50% centres it (framer-motion's transform replaces the CSS one).
          initial={{ opacity: 0, x: '-50%', y: 10, scale: 0.94 }}
          animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
          exit={{ opacity: 0, x: '-50%', scale: 0.97 }}
          transition={{ duration: 0.3, ease }}
        >
          <b>{t.title}</b>
          {t.detail && <span>{t.detail}</span>}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Dock({ d }) {
  const icons = ['A', 'B', 'C', 'D', 'E']
  return (
    <div className="ddock">
      {icons.map((id) => (
        <motion.span
          key={id}
          className="ddock-icon"
          style={{ color: APPS[id].tint }}
          animate={d?.bounce === id ? { y: [0, -10, 0, -6, 0] } : { y: 0 }}
          transition={{ duration: 0.9 }}
        >
          {APPS[id].icon}
          {d?.running?.includes(id) && <i className="ddock-dot" />}
        </motion.span>
      ))}
    </div>
  )
}

function MenuDropdown({ m }) {
  return (
    <AnimatePresence>
      {m && (
        <motion.div
          className="dmenu"
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {m.items.map((it, idx) =>
            it === '-' ? <hr key={idx} /> : (
              <div key={idx} className={`dmenu-item ${m.hover === idx ? 'is-hover' : ''} ${it.header ? 'is-header' : ''}`}>
                <span className="dmenu-check">{it.on ? '✓' : ''}</span>
                <span className="dmenu-label">{it.label}</span>
                {it.key && <span className="dmenu-key">{it.key}</span>}
              </div>
            )
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Stage({ steps, windows = ['A', 'B'], dock = false, label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  const { i, step, paused, togglePause, restart } = useTimeline(steps, inView)
  const activeId = step.active ?? null

  return (
    <figure className="stage" ref={ref}>
      {label && <span className="stage-label">{label}</span>}
      <div className="stage-screen">
        <div className="stage-menubar">
          <span className="stage-apple" />
          <span className="stage-menu-w" /><span className="stage-menu-w short" /><span className="stage-menu-w" />
          <span className={`stage-status ${step.menu ? 'is-open' : ''}`}>
            <img src={`${BASE}logo.svg`} alt="" />
          </span>
        </div>
        <div className="stage-desk">
          <AnimatePresence>
            {step.mc && (
              <motion.div
                key="mc"
                className="dmc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>
          <SpacesRow s={step.spaces} />
          {windows.map((id) => (
            <Window key={id} id={id} f={step.win?.[id]} active={activeId === id} />
          ))}
          <TabBar t={step.tabs} />
          <Preview p={step.preview} />
          <DragFile f={step.file} />
          <AnimatePresence>
            {step.badge && (
              <motion.span
                key={step.badge.text}
                className={`dbadge ${step.badge.tone === 'hint' ? 'is-hint' : ''}`}
                style={{ left: `${step.badge.x}%`, top: `${step.badge.y}%` }}
                // x: -50% centres the pill on badge.x (framer-motion's transform replaces the CSS one).
                initial={{ opacity: 0, x: '-50%', y: 8, scale: 0.9 }}
                animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {step.badge.text}
              </motion.span>
            )}
          </AnimatePresence>
          {dock && <Dock d={step.dock} />}
          <Toast t={step.toast} />
          <Cursor c={step.cursor} />
        </div>
        <MenuDropdown m={step.menu} />
        <Keys k={step.keys} />
      </div>
      <figcaption className="stage-caption">
        <AnimatePresence mode="wait">
          <motion.span
            key={step.caption}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {step.caption}
          </motion.span>
        </AnimatePresence>
        <span className="stage-controls">
          <span className="stage-progress" aria-label={`Step ${i + 1} of ${steps.length}`}>
            {steps.map((_, n) => <i key={n} className={n === i ? 'on' : n < i ? 'done' : ''} />)}
          </span>
          <button onClick={togglePause} aria-label={paused ? 'Play animation' : 'Pause animation'}>
            {paused ? '▶' : '❚❚'}
          </button>
          <button onClick={restart} aria-label="Restart animation">↺</button>
        </span>
      </figcaption>
    </figure>
  )
}
