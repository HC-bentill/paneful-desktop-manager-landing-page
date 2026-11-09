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
  { id: 'reorder-tabs', title: 'Reorder tabs', group: 'Tab groups' },
  { id: 'close-button', title: 'Close button', group: 'Tab groups', isNew: true },
  { id: 'drop-on-tabs', title: 'Drop files onto tabs', group: 'Tab groups', isNew: true },
  { id: 'remembered', title: 'Remembered groups', group: 'Tab groups' },
  { id: 'auto-tab-new', title: 'Auto-tab new windows', group: 'Tab groups', isNew: true },
  { id: 'auto-tiling', title: 'Auto-tiling', group: 'Auto-tiling', isNew: true },
  { id: 'arrange-tiles', title: 'Arrange tiles', group: 'Auto-tiling', isNew: true },
  { id: 'saved-layouts', title: 'Saved layouts', group: 'Layouts', isNew: true },
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
  ['Auto-tiling', [
    ['⌃⌥F', 'Float the focused window, or tile it again'],
  ]],
  ['Saved layouts', [
    ['⌃⌥⇧1…9', 'Save the current layout'], ['⌃⌥1…9', 'Restore a saved layout'],
  ]],
]

const faqs = [
  ['Paneful does nothing when I drag or press shortcuts', <>Paneful needs Accessibility access. Open <b>System Settings → Privacy &amp; Security → Accessibility</b> and make sure Paneful is switched on. If it still doesn’t work, choose <b>Grant Accessibility Access…</b> in the Paneful menu.</>],
  ['Paneful stopped working after an update', <>After an update, macOS can keep the old version’s Accessibility entry. That used to mean removing Paneful with the – button and relaunching it. Now Paneful notices the stale entry, removes it, and macOS asks again. Just switch Paneful on in <b>System Settings → Privacy &amp; Security → Accessibility</b>. No removing, no relaunching. If it still doesn’t start, choose <b>Grant Accessibility Access…</b> in the menu-bar menu. It does the same repair and opens the right settings page.</>],
  ['macOS says it can’t verify the developer', <>Open <b>System Settings → Privacy &amp; Security</b>, scroll down, and click <b>Open Anyway</b> next to the Paneful message. You only need to do this once per version.</>],
  ['Windows snap, then jump somewhere else', 'macOS has its own edge tiling, and Stage Manager can fight Paneful too. Paneful’s menu warns you when either is on and links to the setting that turns it off.'],
  ['A shortcut doesn’t work', 'Another app (for example another window manager) probably uses the same ⌃⌥ shortcut. Quit that app, or change its shortcut, and relaunch Paneful.'],
  ['A window doesn’t fill its tile exactly', 'Some apps enforce a minimum size or animate their own resizing. Paneful gets as close as the app allows.'],
  ['The red button doesn’t close my tab’s window', <>In a tab group, the red button sends the window to the Dock instead. To really close it, <b>⌥-click</b> the red button, or right-click its tab → <b>Close Window</b>. ⌘W still closes it as usual. To get the normal red button back, switch off <b>Close Button Minimizes Tabs</b> in the menu bar.</>],
  ['Auto-tiling or auto-tab caught a window I want to keep floating', <>Press <b>⌃⌥F</b> (<b>Float Focused Window</b>) to take a tiled window out of the layout, or <b>⌃⌥W</b> to move a tab out of its group. To keep an app's new windows out of both auto-tiling and auto-tab, bring that app to the front and choose <b>Auto-tiling → Always Float <i>App name</i></b> in the menu bar.</>],
  ['A window didn’t come back with my layout', <>Paneful only moves windows that are open on the current desktop. It doesn’t launch apps, so open the app and press the shortcut again. When an app has several windows, Paneful tells them apart by title, so a window whose title has changed may swap places with a sibling. Put them where you want them and save the layout again under the same number.</>],
  ['Can I tab or tile full-screen windows?', 'No. Windows in macOS full-screen mode (the green button) live in their own Space and can’t be moved by any window manager. Exit full screen first.'],
  ['Where are my remembered groups stored?', <>In ~/Library/Application Support/Paneful/groups.json. Use <b>Remembered Groups</b> in the menu bar to forget one or all of them.</>],
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
                {s.isNew && <span className="soon is-new">New</span>}
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

// One keycap per character, except a number range such as 1…9, which gets a single keycap.
function Kbd({ children }) {
  return <span className="kbd-group">{children.match(/\d…\d|./gu).map((c, i) => <kbd key={i}>{c}</kbd>)}</span>
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
            <p className="doc-note">
              Updating from an older version? If macOS asks for Accessibility again, just switch Paneful back on. You don't need
              to remove it first (<a href="#troubleshooting">more</a>).
            </p>
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
                <tr><td>Reorder tabs</td><td>Drag a tab sideways. It stays where you drop it (<a href="#reorder-tabs">see how</a>)</td></tr>
                <tr><td>Remove a tab</td><td>Drag the tab down out of the bar, right-click → Move Out of Group, or <Kbd>⌃⌥W</Kbd></td></tr>
                <tr><td>Minimize a tab</td><td>Hover the tab and click its ✕, or click the red button on its window. It goes to the Dock, and the next tab takes its place. Click it in the Dock to bring it back as the active tab (<a href="#close-button">see how</a>)</td></tr>
                <tr><td>Close a tab's window</td><td>⌥-click the red button, or right-click → Close Window. The group still remembers it</td></tr>
                <tr><td>Minimize the group</td><td><Kbd>⌃⌥M</Kbd>, or right-click a tab → Minimize Group. Restore any of its windows to bring the whole group back</td></tr>
                <tr><td>Ungroup everything</td><td>Right-click a tab → Ungroup All</td></tr>
              </tbody>
            </table>
          </DocSection>

          <DocSection
            id="reorder-tabs"
            kicker="Tab groups"
            title="Reorder tabs"
            intro="Put your tabs in the order you want, just like browser tabs. Drag a tab sideways, and it stays where you drop it."
            demoProps={{ steps: demo.reorderTabs, windows: ['A', 'B', 'C', 'D'] }}
            steps={[
              <>Drag a tab sideways along the tab bar. A hint under the bar says <b>Drag sideways to reorder, or down to pull out</b>.</>,
              <>The other tabs slide aside to open a gap. When the hint says <b>Release to move the tab here</b>, let go.</>,
              <>The tab stays in its new place, and the group remembers the order, even after a restart.</>,
            ]}
          >
            <p className="doc-note">
              To take a tab out of the group instead, drag it well below the bar until the hint says <b>Release to pull out of
              the group</b>. Moving back toward the bar cancels, so a sideways drag that wobbles a little never pulls a tab out by accident.
            </p>
          </DocSection>

          <DocSection
            id="close-button"
            kicker="Tab groups"
            title="Close button minimizes tabs"
            intro="In a tab group, clicking a window's red close button sends that window to the Dock instead of closing it. This is on by default."
            demoProps={{ steps: demo.closeButton, windows: ['A', 'B', 'C'], dock: true }}
          >
            <ul className="doc-list">
              <li><b>Click the red button</b> on a tab's window. The window goes to the Dock, and the next tab takes its place.</li>
              <li><b>Click it in the Dock</b> to bring it back as the active tab.</li>
              <li><b>The ✕ on a tab</b> (shown when you hover it) does the same: the window goes to the Dock and keeps its place in the group. To take a window out of the group instead, drag its tab down out of the bar, or right-click → <b>Move Out of Group</b>.</li>
              <li><b>To really close it</b>, <b>⌥-click</b> the red button, or right-click its tab → <b>Close Window</b>.</li>
              <li>⌘W isn't changed. It still closes the window.</li>
              <li><b>Apps that hide their window instead of quitting</b> (Postman, Microsoft Teams, Slack…) are handled the same way. If such a window disappears from a group, for example with ⌘W, its tab steps aside like a minimized tab and the next tab takes over. It comes back as the active tab when the app shows the window again.</li>
              <li>Want the normal red button back? Switch off <b>Close Button Minimizes Tabs</b> in the menu bar.</li>
            </ul>
          </DocSection>

          <DocSection
            id="drop-on-tabs"
            kicker="Tab groups"
            title="Drop files onto tabs"
            intro="Want to drop something into a window that's hidden behind another tab? Hold it over that tab, and the tab opens for you."
            demoProps={{ steps: demo.dropOnTabs, windows: ['A', 'D', 'E'] }}
            steps={[
              <>Drag a file, folder, text or image from anywhere, and hold it over a tab in a tab bar. A pill says <b>Hold to open this tab</b>.</>,
              <>After about half a second, that tab opens and its window comes to the front. The pill now says <b>Now drop it onto the window</b>.</>,
              <>Move down into the window and drop it there. For example, into a Finder folder, an upload area, or an app's drop zone.</>,
            ]}
          >
            <p className="doc-note">Holding it over the tab that's already open shows <b>Now drop it onto the window</b> straight away.</p>
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
              <li><b>New windows float.</b> A window that's never been in a group only joins one when you drag it in or press <Kbd>⌃⌥T</Kbd>, or when <a href="#auto-tab-new">Auto-tab New Windows</a> is on.</li>
              <li><b>Removing a tab or ungrouping forgets it.</b> Closing a window, quitting the app, or quitting Paneful does not.</li>
              <li>Windows are matched by app, plus their title when an app has several windows open.</li>
              <li>Review or forget groups under <b>Remembered Groups</b> in the menu bar, or switch off <b>Auto-tab Remembered Windows</b>.</li>
            </ul>
          </DocSection>

          <DocSection
            id="auto-tab-new"
            kicker="Tab groups"
            title="Auto-tab new windows"
            intro="An optional mode that tabs new windows for you. A new window joins the tab group of the window you were using, or starts a new group with it. It's off by default."
            demoProps={{ steps: demo.autoTabNew, windows: ['A', 'E'], dock: true }}
            steps={[
              <>Click the Paneful icon in the menu bar and switch on <b>Auto-tab New Windows</b>.</>,
              <>Open a new window. It joins the tab group of the window you were using, or starts a new group with that window.</>,
              <>The new window becomes the active tab, in that group's frame.</>,
            ]}
          >
            <ul className="doc-list">
              <li><b>It works across apps.</b> In Browser, open a new Finder window from the Dock, and Finder becomes a tab next to Browser.</li>
              <li><b>Windows that are already open aren't touched</b> when you turn it on.</li>
              <li><b>Some windows open normally:</b> dialogs, sheets, full-screen windows, windows that can't be resized, and apps set to <b>Always Float <i>App name</i></b> in the <b>Auto-tiling</b> submenu.</li>
              <li><b>With auto-tiling on too</b>, a new window joins a tab first. A tab group is one tile, so the window lands in that group's tile.</li>
              <li><b>It's not the same as Auto-tab Remembered Windows.</b> That one puts windows that were in a group before back into it. This one tabs windows that are new.</li>
            </ul>
          </DocSection>

          <DocSection
            id="auto-tiling"
            kicker="Auto-tiling"
            title="Auto-tiling"
            intro="An optional mode that arranges new windows for you. New windows make room for themselves, and closing one hands its space back. It's off by default, so windows float unless you turn it on."
            demoProps={{ steps: demo.autoTiling, windows: ['A', 'B', 'E', 'E2'], dock: true }}
            steps={[
              <>Click the Paneful icon in the menu bar and switch on <b>Auto-tile New Windows</b>.</>,
              <>Open a new window. The window you were using shrinks to the left half, and the new window takes the right half.</>,
              <>Open more windows. They stack top to bottom in the right column, and each one gets an equal share.</>,
            ]}
          >
            <ul className="doc-list">
              <li><b>A placeholder holds the slot.</b> While an app is launching, or a new window is appearing, a dark tile with the app's icon and name keeps its place until the real window arrives.</li>
              <li><b>Closing or minimizing a window gives its space to the others.</b> When only one is left, it expands back to the full screen. Un-minimize a window and it goes back to the same slot.</li>
              <li><b>A tab group counts as one tile.</b> Its tab bar spans the tile.</li>
              <li><b>Each display has its own layout</b>, and each Space shows only its own windows.</li>
              <li><b>Only new windows are tiled.</b> Windows that were already open when you turned auto-tiling on stay where they are. The exception is the window you were using when the first new window opens.</li>
            </ul>
          </DocSection>

          <DocSection
            id="arrange-tiles"
            kicker="Auto-tiling"
            title="Arrange tiles"
            intro="Swap tiles, resize them, or take a window out of the layout. The other tiles adjust around it."
            demoProps={{ steps: demo.arrangeTiles, windows: ['A', 'B', 'C'] }}
          >
            <table className="doc-table">
              <tbody>
                <tr><td>Swap two windows</td><td>Drag a tiled window onto another tile and let go</td></tr>
                <tr><td>Resize a tile</td><td>Drag its edge. The neighbouring tiles resize to match</td></tr>
                <tr><td>Move to another display</td><td>Drag the window onto the other display. It joins that display's layout</td></tr>
                <tr><td>Change your mind</td><td>Let go anywhere else, and the window slides back into its tile</td></tr>
                <tr><td>Float a window</td><td><Kbd>⌃⌥F</Kbd>, or <b>Auto-tiling → Float Focused Window</b>. Snapping a tiled window to an edge or with a shortcut also floats it</td></tr>
                <tr><td>Tile it again</td><td><Kbd>⌃⌥F</Kbd>, or <b>Auto-tiling → Tile Focused Window</b></td></tr>
                <tr><td>Always float an app</td><td><b>Auto-tiling → Always Float <i>App name</i></b>, for the app in front. Its new windows are never tiled or auto-tabbed</td></tr>
                <tr><td>Float everything</td><td><b>Auto-tiling → Float All Windows</b> stops arranging every window at once and leaves each one where it is</td></tr>
              </tbody>
            </table>
            <p className="doc-note">Dialogs, sheets, full-screen windows and windows that can't be resized always float.</p>
          </DocSection>

          <DocSection
            id="saved-layouts"
            kicker="Layouts"
            title="Saved layouts"
            intro="Store the current arrangement of your windows under a number from 1 to 9, and bring it back with a shortcut."
            demoProps={{ steps: demo.savedLayouts, windows: ['A', 'C', 'D'], dock: true }}
            steps={[
              <>Arrange your windows, then press <Kbd>⌃⌥⇧1</Kbd> (Control + Option + Shift + 1). Paneful saves every window on the current desktop, on all displays: where each one sits, which one is in front, and your tab groups with their tabs and visible tab. A pop-up says <b>Layout 1 saved</b>.</>,
              <>Work as usual. Move windows, minimize them, pull tabs out of groups.</>,
              <>Press <Kbd>⌃⌥1</Kbd>. Everything goes back where it was, and a pop-up says <b>Layout 1 restored</b>.</>,
            ]}
          >
            <ul className="doc-list">
              <li><b>Paneful finds each saved window among the open ones:</b> same app, same or similar title. If no title matches, it takes that app's window nearest to where the saved one was.</li>
              <li><b>It undoes what changed.</b> Minimized windows and hidden apps come back, tab groups are put back together (windows you grouped since are split apart), every window moves into place, and the front-to-back order is restored.</li>
              <li><b>Windows that aren't open are skipped.</b> Paneful doesn't launch apps. The pop-up says what's missing, for example <b>4 of 5 windows · not open: Mail</b>.</li>
              <li><b>Windows that aren't part of the layout</b> stay where they are.</li>
              <li><b>Saving under a number you've used replaces that layout.</b> The pop-up says <b>Layout 1 replaced</b>.</li>
              <li><b>A display is gone or changed size?</b> Its windows keep their relative place and size on the closest display.</li>
              <li><b>With auto-tiling on</b>, restoring a layout floats the current windows, because the layout replaces the tiling. New windows are still tiled.</li>
            </ul>
            <p className="doc-note">
              Layouts are kept across restarts, in ~/Library/Application Support/Paneful/layouts.json. Restore, save or forget them
              under <b>Saved Layouts</b> in the menu bar, which lists each layout with its apps, for example <b>Layout 1: Browser, Code
              editor, Mail</b>.
            </p>
          </DocSection>

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
                <tr><td>Close Button Minimizes Tabs</td><td>In a tab group, the red button sends a window to the Dock instead of closing it. On by default (<a href="#close-button">more</a>)</td></tr>
                <tr><td>Auto-tile New Windows</td><td>Arrange new windows into tiles. Off by default (<a href="#auto-tiling">more</a>)</td></tr>
                <tr><td>Auto-tab New Windows</td><td>Tab each new window with the window you were using. Off by default (<a href="#auto-tab-new">more</a>)</td></tr>
                <tr><td>Saved Layouts ▸</td><td>Restore a saved layout, save the current one under a number, or forget one (<a href="#saved-layouts">more</a>)</td></tr>
                <tr><td>Auto-tiling ▸</td><td>Float or tile the focused window (<Kbd>⌃⌥F</Kbd>), always float the app in front (its new windows are never tiled or auto-tabbed), or float all windows</td></tr>
                <tr><td>Launch at Login</td><td>Start Paneful when you log in</td></tr>
              </tbody>
            </table>
          </DocSection>

          <DocSection id="shortcuts" kicker="Reference" title="Keyboard shortcuts" intro="All shortcuts use Control (⌃) + Option (⌥). Saving a layout adds Shift (⇧).">
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
