import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import { Reveal, DOWNLOAD_URL, RELEASES_URL, GITHUB_URL } from '../components/shared.jsx'
import { Stage } from './Stage.jsx'
import * as demo from './demos.js'

const sections = [
  { id: 'getting-started', title: 'Getting started', group: 'Basics' },
  { id: 'drag-to-snap', title: 'Snap by dragging', group: 'Snapping' },
  { id: 'keyboard-snap', title: 'Snap with the keyboard', group: 'Snapping' },
  { id: 'side-by-side', title: 'Side by side', group: 'Snapping' },
  { id: 'tab-groups', title: 'Make a tab group', group: 'Tab groups' },
  { id: 'manage-tabs', title: 'Manage tabs', group: 'Tab groups' },
  { id: 'remembered', title: 'Remembered groups', group: 'Tab groups' },
  { id: 'auto-tiling', title: 'Auto-tiling', group: 'Coming soon', soon: true },
  { id: 'menu-bar', title: 'Menu bar & settings', group: 'Reference' },
  { id: 'shortcuts', title: 'Keyboard shortcuts', group: 'Reference' },
  { id: 'troubleshooting', title: 'Troubleshooting & FAQ', group: 'Reference' },
]

const shortcuts = [
  ['Snapping', [
    ['⌃⌥←', 'Left half'], ['⌃⌥→', 'Right half'], ['⌃⌥↑', 'Top half'], ['⌃⌥↓', 'Bottom half'],
    ['⌃⌥U', 'Top-left quarter'], ['⌃⌥I', 'Top-right quarter'], ['⌃⌥J', 'Bottom-left quarter'], ['⌃⌥K', 'Bottom-right quarter'],
    ['⌃⌥↩', 'Maximize'], ['⌃⌥C', 'Center'], ['⌃⌥S', 'Side by side with the previous window'],
  ]],
  ['Tab groups', [
    ['⌃⌥T', 'Tab the focused window with the previous one'], ['⌃⌥]', 'Next tab'], ['⌃⌥[', 'Previous tab'],
    ['⌃⌥W', 'Move the active tab out of its group'], ['⌃⌥M', 'Minimize the whole group'],
  ]],
]

const faqs = [
  ['Paneful does nothing when I drag or press shortcuts', 'Paneful needs Accessibility access. Open System Settings → Privacy & Security → Accessibility and make sure Paneful is switched on. If it is on but still not working (often after an update), remove it with the – button, add it again, and relaunch Paneful.'],
  ['macOS says it can’t verify the developer', 'Open System Settings → Privacy & Security, scroll down, and click Open Anyway next to the Paneful message. You only need to do this once per version.'],
  ['Windows snap, then jump somewhere else', 'macOS has its own edge tiling, and Stage Manager can fight Paneful too. Paneful’s menu warns you when either is on and links to the setting that turns it off.'],
  ['A shortcut doesn’t work', 'Another app (for example another window manager) probably uses the same ⌃⌥ shortcut. Quit that app, or change its shortcut, and relaunch Paneful.'],
  ['A window doesn’t fill its tile exactly', 'Some apps enforce a minimum size or animate their own resizing. Paneful gets as close as the app allows.'],
  ['Can I tab or tile full-screen windows?', 'No. Windows in macOS full-screen mode (the green button) live in their own Space and can’t be moved by any window manager. Exit full screen first.'],
  ['Where are my remembered groups stored?', 'In ~/Library/Application Support/Paneful/groups.json. Use Remembered Groups in the menu bar to forget one or all of them.'],
  ['Why isn’t Paneful on the Mac App Store?', 'Window managers need to control other apps’ windows, which the App Store sandbox doesn’t allow. Paneful is distributed through GitHub instead, and it’s free and open source.'],
]

const sectionIds = sections.map((s) => s.id)

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerHeight * 0.3
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      // At the very bottom, highlight the last section.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = ids[ids.length - 1]
      setActive(current)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [ids])
  return active
}

function Sidebar({ active }) {
  const groups = [...new Set(sections.map((s) => s.group))]
  const ref = useRef(null)
  // On narrow screens the sidebar is a horizontal chip bar: keep the active chip in view.
  useEffect(() => {
    const bar = ref.current
    const link = bar?.querySelector('a.is-active')
    if (!bar || !link || bar.scrollWidth <= bar.clientWidth) return
    bar.scrollTo({ left: link.offsetLeft - bar.clientWidth / 2 + link.clientWidth / 2, behavior: 'smooth' })
  }, [active])
  return (
    <aside className="docs-side" ref={ref}>
      <nav>
        {groups.map((g) => (
          <div key={g} className="docs-side-group">
            <h4>{g}</h4>
            {sections.filter((s) => s.group === g).map((s) => (
              <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'is-active' : ''}>
                {active === s.id && <motion.span layoutId="side-indicator" className="docs-side-ind" />}
                {s.title}
                {s.soon && <span className="soon">Soon</span>}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}

function DocSection({ id, kicker, title, intro, children, steps, demoProps, soon }) {
  return (
    <section id={id} className="doc-section">
      <Reveal>
        <span className="doc-kicker">{kicker}{soon && <span className="soon">Coming soon</span>}</span>
        <h2>{title}</h2>
        {intro && <p className="doc-intro">{intro}</p>}
      </Reveal>
      {demoProps && <Reveal delay={0.08}><Stage {...demoProps} /></Reveal>}
      {steps && (
        <Reveal delay={0.12}>
          <ol className="doc-steps">
            {steps.map((s, i) => <li key={i}><span>{i + 1}</span><div>{s}</div></li>)}
          </ol>
        </Reveal>
      )}
      {children && <Reveal delay={0.14}>{children}</Reveal>}
    </section>
  )
}

function Kbd({ children }) {
  return <span className="kbd-group">{[...children].map((c, i) => <kbd key={i}>{c}</kbd>)}</span>
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="faq">
      {faqs.map(([q, a], i) => (
        <div key={q} className={`faq-item ${open === i ? 'is-open' : ''}`}>
          <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            {q}<span className="faq-plus">{open === i ? '–' : '+'}</span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="faq-a"
              >
                <p>{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export default function DocsApp() {
  const active = useScrollSpy(sectionIds)

  return (
    <>
      <div className="page-glow" aria-hidden="true" />
      <Nav page="docs" />
      <header className="docs-hero">
        <Reveal className="eyebrow">Documentation</Reveal>
        <Reveal as="h1" delay={0.05}>Learn Paneful <span className="grad-text">in motion</span></Reveal>
        <Reveal as="p" delay={0.12} className="sub">
          Every feature, shown as a short animation. Watch it, then try it on your own desktop.
        </Reveal>
      </header>

      <div className="docs-layout">
        <Sidebar active={active} />
        <main className="docs-main">
          <DocSection
            id="getting-started"
            kicker="Basics"
            title="Getting started"
            intro="Paneful is a free menu-bar app for macOS 27.2 and later. Setup takes about a minute."
            steps={[
              <><a href={DOWNLOAD_URL}>Download Paneful.dmg</a>, open it and drag Paneful into Applications.</>,
              <>Open Paneful. If macOS says it can't verify the developer, go to <b>System Settings → Privacy &amp; Security</b> and click <b>Open Anyway</b>.</>,
              <>When asked, allow Paneful under <b>Accessibility</b>. This is what lets it move and resize other apps' windows. Paneful starts working straight away, with no relaunch.</>,
              <>Look for the Paneful icon in your menu bar. Every feature and setting is there.</>,
            ]}
          >
            <div className="callout">
              <b>Tip:</b> If you use another window manager, quit it first. Two apps moving the same windows will fight each other.
            </div>
          </DocSection>

          <DocSection
            id="drag-to-snap"
            kicker="Snapping"
            title="Snap by dragging"
            intro="Drag a window by its title bar to the edge of the screen. A blurred preview shows where it will land, and the window snaps there when you let go."
            demoProps={{ steps: demo.dragSnap, windows: ['A', 'B'] }}
          >
            <table className="doc-table">
              <tbody>
                <tr><td>Left or right edge</td><td>Left or right half</td></tr>
                <tr><td>A corner</td><td>That quarter of the screen</td></tr>
                <tr><td>Top edge</td><td>Maximize</td></tr>
              </tbody>
            </table>
            <p className="doc-note">Don't want it? Switch off <b>Drag to Screen Edge to Snap</b> in the menu bar.</p>
          </DocSection>

          <DocSection
            id="keyboard-snap"
            kicker="Snapping"
            title="Snap with the keyboard"
            intro="Every layout has a Control + Option shortcut, and they act on whichever window is focused."
            demoProps={{ steps: demo.keyboardSnap, windows: ['A'] }}
          >
            <div className="kbd-grid">
              {shortcuts[0][1].slice(0, 10).map(([k, v]) => (
                <div key={k} className="kbd-row"><Kbd>{k}</Kbd><span>{v}</span></div>
              ))}
            </div>
          </DocSection>

          <DocSection
            id="side-by-side"
            kicker="Snapping"
            title="Side by side with the previous window"
            intro="Comparing two things? Press ⌃⌥S. The window you're in goes to the left half, and the window you used just before it goes to the right."
            demoProps={{ steps: demo.sideBySide, windows: ['A', 'B'] }}
          />

          <DocSection
            id="tab-groups"
            kicker="Tab groups"
            title="Make a tab group"
            intro="Put windows from different apps into one frame with a tab bar on top, like browser tabs for your whole desktop."
            demoProps={{ steps: demo.tabGroup, windows: ['A', 'B', 'C'] }}
            steps={[
              <>Drag a window onto the <b>top</b> of another window, over its title bar or toolbar.</>,
              <>Hold it there until the preview says <b>Release to add as a tab</b>, then let go.</>,
              <>To add more, drop windows onto the tab bar. Or press <Kbd>⌃⌥T</Kbd> to tab the focused window with the one you used before it.</>,
            ]}
          >
            <p className="doc-note">The group moves and resizes as one window, and you can snap a whole group to the edges like any other window.</p>
          </DocSection>

          <DocSection
            id="manage-tabs"
            kicker="Tab groups"
            title="Manage tabs"
            intro="Switch tabs, move a window out of a group, or minimize the whole group in one go."
            demoProps={{ steps: demo.manageTabs, windows: ['A', 'B', 'C'], dock: true }}
          >
            <table className="doc-table">
              <tbody>
                <tr><td>Switch tab</td><td>Click it, or <Kbd>⌃⌥]</Kbd> / <Kbd>⌃⌥[</Kbd></td></tr>
                <tr><td>Remove a tab</td><td>Hover and click ✕, drag the tab down out of the bar, right-click → Move Out of Group, or <Kbd>⌃⌥W</Kbd></td></tr>
                <tr><td>Close a tab's window</td><td>Right-click → Close Window. The group still remembers it</td></tr>
                <tr><td>Minimize the group</td><td><Kbd>⌃⌥M</Kbd>, or right-click a tab → Minimize Group. Restore any of its windows to bring the whole group back</td></tr>
                <tr><td>Ungroup everything</td><td>Right-click a tab → Ungroup All</td></tr>
              </tbody>
            </table>
          </DocSection>

          <DocSection
            id="remembered"
            kicker="Tab groups"
            title="Remembered groups"
            intro="Paneful remembers your groups. Quit an app, restart your Mac, or relaunch Paneful, and its window tabs itself back in when it opens again."
            demoProps={{ steps: demo.remember, windows: ['A', 'B', 'D'], dock: true }}
          >
            <ul className="doc-list">
              <li><b>Remembered windows rejoin on their own</b>, a few seconds after they appear.</li>
              <li><b>New windows float.</b> A window that's never been in a group only joins one when you drag it in or press <Kbd>⌃⌥T</Kbd>.</li>
              <li><b>Removing a tab or ungrouping forgets it.</b> Closing a window, quitting the app, or quitting Paneful does not.</li>
              <li>Windows are matched by app, plus their title when an app has several windows open.</li>
              <li>Review or forget groups under <b>Remembered Groups</b> in the menu bar, or switch off <b>Auto-tab Remembered Windows</b>.</li>
            </ul>
          </DocSection>

          <DocSection
            id="auto-tiling"
            kicker="Optional mode"
            soon
            title="Auto-tiling"
            intro="An optional mode for people who want a fully tiled desktop. New windows make room for themselves, and closing one hands its space back. It will be off by default, so new windows float unless you turn it on."
            demoProps={{ steps: demo.autoTiling, windows: ['A', 'E', 'B'], label: 'Preview of an upcoming feature' }}
          />

          <DocSection
            id="menu-bar"
            kicker="Reference"
            title="Menu bar & settings"
            intro="Click the Paneful icon in the menu bar for every action, plus these settings:"
            demoProps={{ steps: demo.menuBar, windows: ['A'] }}
          >
            <table className="doc-table">
              <tbody>
                <tr><td>Drag to Screen Edge to Snap</td><td>Snap windows by dragging them to an edge or corner</td></tr>
                <tr><td>Drag onto Title Bar to Tab</td><td>Make tab groups by dropping one window onto another</td></tr>
                <tr><td>Auto-tab Remembered Windows</td><td>Let remembered windows rejoin their groups by themselves</td></tr>
                <tr><td>Launch at Login</td><td>Start Paneful when you log in</td></tr>
              </tbody>
            </table>
          </DocSection>

          <DocSection id="shortcuts" kicker="Reference" title="Keyboard shortcuts" intro="All shortcuts use Control (⌃) + Option (⌥).">
            <div className="shortcut-cols">
              {shortcuts.map(([group, rows]) => (
                <div key={group} className="shortcut-card">
                  <h3>{group}</h3>
                  {rows.map(([k, v]) => <div key={k} className="kbd-row"><Kbd>{k}</Kbd><span>{v}</span></div>)}
                </div>
              ))}
            </div>
          </DocSection>

          <DocSection id="troubleshooting" kicker="Reference" title="Troubleshooting & FAQ">
            <Faq />
            <div className="callout">
              Still stuck? <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noreferrer">Open an issue on GitHub</a> and
              say which apps are involved. Every version is on the <a href={RELEASES_URL} target="_blank" rel="noreferrer">releases page</a>.
            </div>
          </DocSection>
        </main>
      </div>
      <Footer />
    </>
  )
}
