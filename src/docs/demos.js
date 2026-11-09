// Scripted scenes for the docs demos. Each step is a full snapshot of the desktop.
// Frames are percentages of the desktop area: { x, y, w, h, z, o (opacity), s (scale) }.

const L = { x: 1, y: 2, w: 48.5, h: 94 }
const R = { x: 50.5, y: 2, w: 48.5, h: 94 }
const FULL = { x: 1, y: 2, w: 98, h: 94 }
const at = (f, extra) => ({ ...f, ...extra })
const hidden = (f) => ({ ...f, o: 0 })

/* 1 — Drag to snap ------------------------------------------------------- */
const dA = { x: 28, y: 20, w: 40, h: 50, z: 2 }
const dB = { x: 56, y: 40, w: 38, h: 46, z: 1 }
export const dragSnap = [
  { d: 1300, win: { A: dA, B: dB }, active: 'A', cursor: { x: 48, y: 23 }, caption: 'Grab a window by its title bar' },
  { d: 500, win: { A: dA, B: dB }, active: 'A', cursor: { x: 48, y: 23, down: true }, caption: 'Grab a window by its title bar' },
  { d: 900, win: { A: at(dA, { x: 8, y: 26 }), B: dB }, active: 'A', cursor: { x: 28, y: 29, down: true }, caption: 'Drag it to the left edge of the screen' },
  { d: 1500, win: { A: at(dA, { x: -10, y: 30 }), B: dB }, active: 'A', cursor: { x: 0.6, y: 33, down: true }, preview: L, caption: 'A blurred preview shows where it will land' },
  { d: 1500, win: { A: at(L, { z: 2 }), B: dB }, active: 'A', cursor: { x: 3, y: 33 }, caption: 'Let go, and it snaps to the left half' },
  { d: 1000, win: { A: at(L, { z: 1 }), B: at(dB, { z: 2 }) }, active: 'B', cursor: { x: 72, y: 43 }, caption: 'Now grab the other window…' },
  { d: 500, win: { A: at(L, { z: 1 }), B: at(dB, { z: 2 }) }, active: 'B', cursor: { x: 72, y: 43, down: true }, caption: 'Now grab the other window…' },
  { d: 1500, win: { A: at(L, { z: 1 }), B: at(dB, { x: 76, y: 28, z: 2 }) }, active: 'B', cursor: { x: 99.2, y: 31, down: true }, preview: R, caption: '…and drag it to the right edge' },
  { d: 2400, win: { A: at(L, { z: 1 }), B: at(R, { z: 2 }) }, active: 'B', cursor: { x: 96, y: 33 }, caption: 'Side by side, split exactly in half' },
]

/* 2 — Keyboard snapping -------------------------------------------------- */
const kb = (key, frame, caption) => ({ d: 1500, keys: ['⌃', '⌥', key], win: { A: at(frame, { z: 2 }) }, active: 'A', caption })
export const keyboardSnap = [
  { d: 1200, win: { A: { x: 26, y: 16, w: 48, h: 60, z: 2 } }, active: 'A', caption: 'Focus any window, then press a shortcut' },
  kb('←', L, 'Left half'),
  kb('→', R, 'Right half'),
  kb('↑', { x: 1, y: 2, w: 98, h: 46 }, 'Top half'),
  kb('↓', { x: 1, y: 50, w: 98, h: 46 }, 'Bottom half'),
  kb('U', { x: 1, y: 2, w: 48.5, h: 46 }, 'Top-left quarter'),
  kb('I', { x: 50.5, y: 2, w: 48.5, h: 46 }, 'Top-right quarter'),
  kb('K', { x: 50.5, y: 50, w: 48.5, h: 46 }, 'Bottom-right quarter'),
  kb('J', { x: 1, y: 50, w: 48.5, h: 46 }, 'Bottom-left quarter'),
  kb('↩', FULL, 'Maximize'),
  kb('C', { x: 17, y: 12, w: 66, h: 72 }, 'Center'),
]

/* 3 — Side by side with previous ---------------------------------------- */
const sA = { x: 14, y: 12, w: 46, h: 58 }
const sB = { x: 38, y: 30, w: 46, h: 58 }
export const sideBySide = [
  { d: 1600, win: { A: at(sA, { z: 1 }), B: at(sB, { z: 2 }) }, active: 'B', cursor: { x: 70, y: 70 }, caption: "You're working in Team chat…" },
  { d: 700, win: { A: at(sA, { z: 1 }), B: at(sB, { z: 2 }) }, active: 'B', cursor: { x: 25, y: 14.5 }, caption: '…then switch to the Browser' },
  { d: 1200, win: { A: at(sA, { z: 3 }), B: at(sB, { z: 2 }) }, active: 'A', cursor: { x: 25, y: 14.5, down: true }, caption: '…then switch to the Browser' },
  { d: 1300, win: { A: at(sA, { z: 3 }), B: at(sB, { z: 2 }) }, active: 'A', cursor: { x: 25, y: 14.5 }, keys: ['⌃', '⌥', 'S'], caption: 'Press ⌃⌥S' },
  { d: 2600, win: { A: at(L, { z: 3 }), B: at(R, { z: 2 }) }, active: 'A', cursor: { x: 25, y: 14.5, hide: true }, keys: ['⌃', '⌥', 'S'], caption: 'The focused window goes left and the previous one goes right' },
]

/* 4 — Make a tab group --------------------------------------------------- */
const tA = { x: 8, y: 22, w: 52, h: 68 }
const tB = { x: 58, y: 6, w: 38, h: 42 }
const tC = { x: 60, y: 56, w: 36, h: 38 }
const G4 = { x: 8, y: 30, w: 52, h: 60 }
export const tabGroup = [
  { d: 1300, win: { A: at(tA, { z: 1 }), B: at(tB, { z: 2 }), C: at(tC, { z: 1 }) }, active: 'B', cursor: { x: 74, y: 9 }, caption: 'Grab a window by its title bar' },
  { d: 500, win: { A: at(tA, { z: 1 }), B: at(tB, { z: 2 }), C: at(tC, { z: 1 }) }, active: 'B', cursor: { x: 74, y: 9, down: true }, caption: 'Grab a window by its title bar' },
  { d: 1900, win: { A: at(tA, { z: 1 }), B: at(tB, { x: 20, y: 21, z: 5 }), C: at(tC, { z: 1 }) }, active: 'B', cursor: { x: 36, y: 24, down: true }, preview: { ...tA, label: 'Release to add as a tab' }, caption: 'Hold it over the top of another window' },
  { d: 1800, win: { A: at(G4, { z: 1 }), B: at(G4, { z: 2 }), C: at(tC, { z: 1 }) }, tabs: { ...G4, items: ['A', 'B'], active: 'B' }, active: 'B', cursor: { x: 36, y: 34 }, caption: "Let go. They're now tabs in one frame" },
  { d: 700, win: { A: at(G4, { z: 1 }), B: at(G4, { z: 2 }), C: at(tC, { z: 1 }) }, tabs: { ...G4, items: ['A', 'B'], active: 'B' }, active: 'B', cursor: { x: 18, y: 26 }, caption: 'Click a tab to switch apps' },
  { d: 1500, win: { A: at(G4, { z: 3 }), B: at(G4, { z: 2 }), C: at(tC, { z: 1 }) }, tabs: { ...G4, items: ['A', 'B'], active: 'A' }, active: 'A', cursor: { x: 18, y: 26, down: true, fast: true }, caption: 'Click a tab to switch apps' },
  { d: 700, win: { A: at(G4, { z: 3 }), B: at(G4, { z: 2 }), C: at(tC, { z: 4 }) }, tabs: { ...G4, items: ['A', 'B'], active: 'A' }, active: 'C', cursor: { x: 76, y: 59 }, caption: 'Drop more windows onto the tab bar' },
  { d: 500, win: { A: at(G4, { z: 3 }), B: at(G4, { z: 2 }), C: at(tC, { z: 4 }) }, tabs: { ...G4, items: ['A', 'B'], active: 'A' }, active: 'C', cursor: { x: 76, y: 59, down: true }, caption: 'Drop more windows onto the tab bar' },
  { d: 1700, win: { A: at(G4, { z: 3 }), B: at(G4, { z: 2 }), C: at(tC, { x: 30, y: 24, z: 6 }) }, tabs: { ...G4, items: ['A', 'B'], active: 'A' }, active: 'C', cursor: { x: 46, y: 27, down: true }, preview: { x: 8, y: 22, w: 52, h: 68, label: 'Release to add as a tab' }, caption: 'Drop more windows onto the tab bar' },
  { d: 2600, win: { A: at(G4, { z: 3 }), B: at(G4, { z: 2 }), C: at(G4, { z: 4 }) }, tabs: { ...G4, items: ['A', 'B', 'C'], active: 'C' }, active: 'C', cursor: { x: 46, y: 40 }, caption: 'Three apps, one window. Move or resize it as one' },
]

/* 5 — Managing tabs ------------------------------------------------------ */
const G5 = { x: 18, y: 14, w: 64, h: 66 }
const g5 = (active, extra = {}) => ({
  win: { A: at(G5, { z: active === 'A' ? 3 : 1 }), B: at(G5, { z: active === 'B' ? 3 : 1 }), C: at(G5, { z: active === 'C' ? 3 : 1 }), ...extra },
  tabs: { ...G5, items: ['A', 'B', 'C'], active },
  active,
})
const docked = (f) => ({ ...f, x: 46, y: 96, w: 8, h: 4, o: 0 })
export const manageTabs = [
  { d: 1500, ...g5('A'), dock: { running: ['A', 'B', 'C'] }, caption: 'A group with three apps' },
  { d: 1300, ...g5('B'), dock: { running: ['A', 'B', 'C'] }, keys: ['⌃', '⌥', ']'], caption: 'Next tab' },
  { d: 1300, ...g5('C'), dock: { running: ['A', 'B', 'C'] }, keys: ['⌃', '⌥', ']'], caption: 'Next tab' },
  { d: 1300, ...g5('B'), dock: { running: ['A', 'B', 'C'] }, keys: ['⌃', '⌥', '['], caption: 'Previous tab' },
  {
    d: 2000, win: { A: at(G5, { z: 1 }), B: { x: 30, y: 26, w: 52, h: 58, z: 5 }, C: at(G5, { z: 3 }) },
    tabs: { ...G5, items: ['A', 'C'], active: 'C' }, active: 'B', dock: { running: ['A', 'B', 'C'] },
    keys: ['⌃', '⌥', 'W'], caption: '⌃⌥W moves the active tab out of the group',
  },
  {
    d: 1600, win: { A: docked(G5), B: { x: 30, y: 26, w: 52, h: 58, z: 5 }, C: docked(G5) },
    active: 'B', dock: { running: ['A', 'B', 'C'] }, keys: ['⌃', '⌥', 'M'], caption: '⌃⌥M minimizes the whole group',
  },
  {
    d: 800, win: { A: docked(G5), B: { x: 30, y: 26, w: 52, h: 58, z: 5 }, C: docked(G5) },
    active: 'B', dock: { running: ['A', 'B', 'C'] }, cursor: { x: 37.5, y: 93 }, caption: 'Click any of its windows in the Dock…',
  },
  {
    d: 2400, win: { A: at(G5, { z: 6 }), B: { x: 30, y: 26, w: 52, h: 58, z: 2 }, C: at(G5, { z: 4 }) },
    tabs: { ...G5, items: ['A', 'C'], active: 'A' }, active: 'A', dock: { running: ['A', 'B', 'C'], bounce: 'A' },
    cursor: { x: 37.5, y: 93, down: true, fast: true }, caption: '…and the whole group comes back',
  },
]

/* 5b — Reorder tabs ------------------------------------------------------ */
// Four tabs across the bar: slot centres at about x = 19, 37, 55, 73. The bar's middle is at y ≈ 13.5.
const G7 = { x: 10, y: 18, w: 72, h: 66 }
const stacked7 = { A: at(G7, { z: 4 }), B: at(G7, { z: 3 }), C: at(G7, { z: 2 }), D: at(G7, { z: 1 }) }
const g7 = (items, drag) => ({ win: stacked7, tabs: { ...G7, items, active: 'A', drag }, active: 'A' })
const BAR_Y = 13.5
const UNDER_BAR = 19.5
export const reorderTabs = [
  { d: 1500, ...g7(['A', 'B', 'C', 'D']), cursor: { x: 60, y: 52 }, caption: 'Tabs start in the order you added them' },
  { d: 800, ...g7(['A', 'B', 'C', 'D']), cursor: { x: 73, y: BAR_Y }, caption: 'Grab a tab…' },
  {
    d: 1400, ...g7(['A', 'B', 'C', 'D'], { id: 'D', dx: '-45%' }), cursor: { x: 65, y: BAR_Y, down: true },
    badge: { x: 65, y: UNDER_BAR, text: 'Drag sideways to reorder, or down to pull out', tone: 'hint' }, caption: '…and drag it sideways',
  },
  {
    d: 1800, ...g7(['D', 'A', 'B', 'C'], { id: 'D' }), cursor: { x: 19, y: BAR_Y, down: true },
    badge: { x: 21, y: UNDER_BAR, text: 'Release to move the tab here' }, caption: 'Take it all the way to the first spot',
  },
  { d: 2200, ...g7(['D', 'A', 'B', 'C']), cursor: { x: 19, y: BAR_Y }, caption: 'Let go, and it stays there. The group remembers the order' },
  { d: 800, ...g7(['D', 'A', 'B', 'C']), cursor: { x: 55, y: BAR_Y }, caption: 'To take a tab out, drag it down instead' },
  {
    d: 1500, ...g7(['D', 'A', 'B', 'C'], { id: 'B', out: true }), cursor: { x: 56, y: 27, down: true },
    badge: { x: 56, y: 32, text: 'Release to pull out of the group' }, caption: 'Pull it well below the bar…',
  },
  {
    d: 2400, win: { ...stacked7, B: { x: 40, y: 25, w: 46, h: 52, z: 6 } }, tabs: { ...G7, items: ['D', 'A', 'C'], active: 'A' },
    active: 'B', cursor: { x: 56, y: 27.5 }, caption: '…and let go. It becomes a separate window again',
  },
]

/* 5c — Close button minimizes tabs -------------------------------------- */
// The red traffic light sits about (1.9, 3.6) from a window's top-left corner.
const RED = (f) => ({ x: f.x + 1.9, y: f.y + 3.6 })
// Dock icon centres (A … E) and a frame that shrinks a window into its icon.
const DOCK_X = { A: 38, B: 44, C: 50, D: 56, E: 62 }
const intoDock = (f, id) => ({ ...f, x: DOCK_X[id] - 2, y: 92, w: 4, h: 3, o: 0 })
const G8 = { x: 18, y: 14, w: 64, h: 66 }
const g8 = (items, active, extra = {}) => ({
  win: { A: at(G8, { z: active === 'A' ? 3 : 1 }), B: at(G8, { z: active === 'B' ? 3 : 1 }), C: at(G8, { z: active === 'C' ? 3 : 1 }), ...extra },
  tabs: { ...G8, items, active },
  active,
  dock: { running: ['A', 'B', 'C'] },
})
export const closeButton = [
  { d: 1500, ...g8(['A', 'B', 'C'], 'A'), cursor: { x: 62, y: 56 }, caption: 'A tab group with three apps' },
  { d: 900, ...g8(['A', 'B', 'C'], 'A'), cursor: RED(G8), caption: "Click the red button on the active tab's window…" },
  {
    d: 2000, ...g8(['B', 'C'], 'B', { A: intoDock(G8, 'A') }), cursor: { ...RED(G8), down: true, fast: true },
    caption: '…and it goes to the Dock. The next tab takes its place',
  },
  { d: 900, ...g8(['B', 'C'], 'B', { A: intoDock(G8, 'A') }), cursor: { x: DOCK_X.A - 0.5, y: 93 }, caption: 'Click it in the Dock…' },
  {
    d: 2100, ...g8(['A', 'B', 'C'], 'A'), dock: { running: ['A', 'B', 'C'], bounce: 'A' },
    cursor: { x: DOCK_X.A - 0.5, y: 93, down: true, fast: true }, caption: '…and it comes back as the active tab',
  },
  { d: 1100, ...g8(['A', 'B', 'C'], 'A'), cursor: RED(G8), keys: ['⌥'], caption: 'To really close it, hold ⌥…' },
  {
    d: 2400, ...g8(['B', 'C'], 'B', { A: at(G8, { z: 3, o: 0, s: 0.94 }) }), cursor: { ...RED(G8), down: true, fast: true },
    keys: ['⌥'], caption: '…and click the red button. The window closes',
  },
]

/* 5d — Drop files onto tabs --------------------------------------------- */
// Two tabs across the bar: Browser centred at x ≈ 17, Mail at x ≈ 45. The bar's middle is at y ≈ 9.5.
const G9 = { x: 3, y: 14, w: 56, h: 76 }
const F9 = { x: 63, y: 26, w: 34, h: 50, z: 2 }
const MAIL_TAB = { x: 45, y: 9.5 }
const IN_MAIL = { x: 31, y: 56 }
const g9 = (active, extra = {}) => ({
  win: { A: at(G9, { z: active === 'A' ? 3 : 1 }), D: at(G9, { z: active === 'D' ? 3 : 1 }), E: F9, ...extra },
  tabs: { ...G9, items: ['A', 'D'], active },
})
const file9 = (pos, extra) => ({ ...pos, name: 'Report.pdf', key: 'src', ...extra })
export const dropOnTabs = [
  { d: 1500, ...g9('A'), active: 'E', file: file9({ x: 80, y: 63 }), cursor: { x: 90, y: 84 }, caption: 'A file in Finder, and a tab group with Browser and Mail' },
  { d: 800, ...g9('A'), active: 'E', file: file9({ x: 80, y: 63 }), cursor: { x: 80.5, y: 61.5 }, caption: 'Grab the file…' },
  { d: 500, ...g9('A'), active: 'E', file: file9({ x: 80, y: 63 }, { lifted: true, s: 1.08 }), cursor: { x: 80.5, y: 61.5, down: true }, caption: 'Grab the file…' },
  {
    d: 1700, ...g9('A'), active: 'E', file: file9({ x: MAIL_TAB.x - 0.5, y: MAIL_TAB.y + 1.5 }, { lifted: true, o: 0.9 }),
    tabs: { ...G9, items: ['A', 'D'], active: 'A', hover: 'D' }, cursor: { ...MAIL_TAB, down: true },
    badge: { x: MAIL_TAB.x, y: 17.5, text: 'Hold to open this tab', tone: 'hint' }, caption: '…and hold it over the Mail tab',
  },
  {
    d: 1800, ...g9('D'), active: 'D', file: file9({ x: MAIL_TAB.x - 0.5, y: MAIL_TAB.y + 1.5 }, { lifted: true, o: 0.9 }),
    tabs: { ...G9, items: ['A', 'D'], active: 'D', hover: 'D' }, cursor: { ...MAIL_TAB, down: true },
    badge: { x: MAIL_TAB.x, y: 17.5, text: 'Now drop it onto the window' }, caption: 'After about half a second, the tab opens',
  },
  {
    d: 1500, ...g9('D', { D: at(G9, { z: 3, hl: true }) }), active: 'D', file: file9({ x: IN_MAIL.x - 0.5, y: IN_MAIL.y + 1.5 }, { lifted: true, o: 0.9 }),
    cursor: { ...IN_MAIL, down: true }, caption: 'Move down into the window…',
  },
  {
    d: 2600, ...g9('D'), active: 'D', file: file9({ x: IN_MAIL.x - 0.5, y: IN_MAIL.y + 1.5 }, { key: 'dropped', s: 0.95 }),
    cursor: { x: IN_MAIL.x + 6, y: IN_MAIL.y + 8 }, caption: '…and drop it. Mail gets the file as if you dropped it there directly',
  },
]

/* 6 — Remembered groups -------------------------------------------------- */
const G6 = { x: 12, y: 14, w: 64, h: 66 }
const dHidden = { x: 58, y: 22, w: 32, h: 40, z: 7, o: 0, s: 0.9 }
export const remember = [
  { d: 1800, win: { A: at(G6, { z: 2 }), B: at(G6, { z: 1 }), D: dHidden }, tabs: { ...G6, items: ['A', 'B'], active: 'A' }, active: 'A', dock: { running: ['A', 'B', 'D'] }, caption: 'Browser and Team chat are tabbed together' },
  { d: 2200, win: { A: at(G6, { z: 2 }), B: hidden(at(G6, { z: 1 })), D: dHidden }, tabs: { ...G6, items: ['A'], active: 'A' }, active: 'A', dock: { running: ['A', 'D'] }, badge: { x: 44, y: 82, text: 'Team chat quit. The group is still remembered' }, caption: 'Quit Team chat. Paneful keeps the group' },
  { d: 900, win: { A: at(G6, { z: 2 }), B: hidden(at(G6, { z: 1 })), D: dHidden }, tabs: { ...G6, items: ['A'], active: 'A' }, active: 'A', dock: { running: ['A', 'D'] }, cursor: { x: 43.5, y: 93 }, caption: 'Open Team chat again…' },
  { d: 1300, win: { A: at(G6, { z: 2 }), B: { x: 54, y: 34, w: 36, h: 44, z: 5 }, D: dHidden }, tabs: { ...G6, items: ['A'], active: 'A' }, active: 'B', dock: { running: ['A', 'B', 'D'], bounce: 'B' }, cursor: { x: 43.5, y: 93, down: true, fast: true }, caption: 'Its window opens where the app puts it…' },
  { d: 2300, win: { A: at(G6, { z: 2 }), B: at(G6, { z: 3 }), D: dHidden }, tabs: { ...G6, items: ['A', 'B'], active: 'B' }, active: 'B', dock: { running: ['A', 'B', 'D'] }, cursor: { x: 43.5, y: 93, hide: true }, badge: { x: 44, y: 82, text: 'Auto-tabbed ✓' }, caption: '…and slides back into its group by itself' },
  { d: 2800, win: { A: at(G6, { z: 2 }), B: at(G6, { z: 3 }), D: { x: 58, y: 22, w: 32, h: 40, z: 7 } }, tabs: { ...G6, items: ['A', 'B'], active: 'B' }, active: 'D', dock: { running: ['A', 'B', 'D'] }, badge: { x: 44, y: 82, text: 'New windows float' }, caption: "A new Mail window was never in a group, so it stays floating" },
]

/* 6b — Auto-tab new windows --------------------------------------------- */
// The Browser window gets a tab bar on top, so as a group its window starts 8% lower.
const W10 = { x: 14, y: 12, w: 62, h: 70 }
const G10 = { x: 14, y: 20, w: 62, h: 62 }
const E10 = { x: 50, y: 28, w: 38, h: 44 }
export const autoTabNew = [
  { d: 1500, win: { A: at(W10, { z: 2 }), E: at(E10, { o: 0, s: 0.9 }) }, active: 'A', dock: { running: ['A', 'E'] }, cursor: { x: 52, y: 56 }, caption: "Auto-tab New Windows is on, and you're working in Browser" },
  { d: 800, win: { A: at(W10, { z: 2 }), E: at(E10, { o: 0, s: 0.9 }) }, active: 'A', dock: { running: ['A', 'E'] }, cursor: { x: DOCK_X.E - 0.5, y: 93 }, caption: 'Open Finder from the Dock…' },
  {
    d: 1300, win: { A: at(W10, { z: 2 }), E: at(E10, { z: 3 }) }, active: 'E', dock: { running: ['A', 'E'], bounce: 'E' },
    cursor: { x: DOCK_X.E - 0.5, y: 93, down: true, fast: true }, caption: '…and its new window appears',
  },
  {
    d: 2800, win: { A: at(G10, { z: 2 }), E: at(G10, { z: 3 }) }, tabs: { ...G10, items: ['A', 'E'], active: 'E' }, active: 'E',
    dock: { running: ['A', 'E'] }, cursor: { x: DOCK_X.E - 0.5, y: 93 }, caption: 'It slides into the Browser frame as a new tab, and becomes the active one',
  },
]

/* 7 — Menu (shared by the auto-tiling and menu bar demos) -------------- */
const menuItems = ({ launch = false, tile = false, tab = false } = {}) => [
  { label: 'Paneful Desktop Manager', header: true },
  '-',
  { label: 'Snap Window', key: '▸' },
  { label: 'Side by Side with Previous', key: '⌃⌥S' },
  { label: 'Saved Layouts', key: '▸' }, // 4
  '-',
  { label: 'Tab with Previous Window', key: '⌃⌥T' },
  { label: 'Minimize Group', key: '⌃⌥M' },
  { label: 'Remembered Groups', key: '▸' }, // 8
  '-',
  { label: 'Auto-tile New Windows', on: tile }, // 10
  { label: 'Auto-tab New Windows', on: tab }, // 11
  { label: 'Auto-tiling', key: '▸' }, // 12
  '-',
  { label: 'Drag to Screen Edge to Snap', on: true },
  { label: 'Drag onto Title Bar to Tab', on: true },
  { label: 'Auto-tab Remembered Windows', on: true },
  { label: 'Close Button Minimizes Tabs', on: true }, // 17
  { label: 'Launch at Login', on: launch }, // 18
  '-',
  { label: 'Quit Paneful' },
]
// Cursor height (desktop %) of a menu row, by index in menuItems.
const MENU_Y = { 4: 20, 8: 35.5, 10: 42, 11: 46.5, 12: 51, 17: 71, 18: 75.5 }
const STATUS = { x: 95.2, y: -3 }

/* 8 — Auto-tiling -------------------------------------------------------- */
// Tiles stop above the Dock. A tab group fills its tile: its tab bar takes the top, its window the rest.
const T_FULL = { x: 1, y: 2, w: 98, h: 86 }
const T_L = { x: 1, y: 2, w: 48.5, h: 86 }
const T_R = { x: 50.5, y: 2, w: 48.5, h: 86 }
const T_TR = { x: 50.5, y: 2, w: 48.5, h: 42 }
const T_BR = { x: 50.5, y: 46, w: 48.5, h: 42 }
const TAB = 8
const inTile = (t) => ({ x: t.x, y: t.y + TAB, w: t.w, h: t.h - TAB })
const offT = (t) => ({ ...t, o: 0, s: 0.92 })
const tiled = (groupTile, rest, extra = {}) => ({
  win: {
    A: at(inTile(groupTile), { z: 2 }), B: at(inTile(groupTile), { z: 1 }),
    E: offT(T_R), E2: offT(T_BR), ...rest,
  },
  tabs: { ...inTile(groupTile), items: ['A', 'B'], active: 'A' },
  dock: { running: ['A', 'B', 'E'] },
  active: 'A',
  ...extra,
})
export const autoTiling = [
  { d: 1300, ...tiled(T_FULL), cursor: { x: 62, y: 52 }, caption: 'A tab group fills the screen' },
  { d: 700, ...tiled(T_FULL), cursor: STATUS, caption: 'Switch on Auto-tile New Windows in the menu bar' },
  { d: 1000, ...tiled(T_FULL), cursor: { ...STATUS, down: true, fast: true }, menu: { items: menuItems() }, caption: 'Switch on Auto-tile New Windows in the menu bar' },
  { d: 800, ...tiled(T_FULL), cursor: { x: 80, y: MENU_Y[10] }, menu: { items: menuItems(), hover: 10 }, caption: 'Switch on Auto-tile New Windows in the menu bar' },
  { d: 1100, ...tiled(T_FULL), cursor: { x: 80, y: MENU_Y[10], down: true, fast: true }, menu: { items: menuItems({ tile: true }), hover: 10 }, caption: 'Switch on Auto-tile New Windows in the menu bar' },
  { d: 900, ...tiled(T_FULL), cursor: { x: DOCK_X.E - 0.5, y: 93 }, caption: 'Now open Finder from the Dock…' },
  {
    d: 1700, ...tiled(T_L, { E: at(T_R, { z: 3, ph: true }) }, { active: 'E' }), dock: { running: ['A', 'B', 'E'], bounce: 'E' },
    cursor: { x: DOCK_X.E - 0.5, y: 93, down: true, fast: true }, caption: '…the group shrinks to the left half, and a placeholder holds the right',
  },
  { d: 1700, ...tiled(T_L, { E: at(T_R, { z: 3 }) }, { active: 'E' }), cursor: { x: 75, y: 60 }, caption: 'The Finder window arrives and takes its place' },
  {
    d: 1200, ...tiled(T_L, { E: at(T_TR, { z: 3 }), E2: at(T_BR, { z: 4, ph: true }) }, { active: 'E2' }), cursor: { x: 75, y: 60 },
    keys: ['⌘', 'N'], caption: 'Open a second Finder window…',
  },
  { d: 1800, ...tiled(T_L, { E: at(T_TR, { z: 3 }), E2: at(T_BR, { z: 4 }) }, { active: 'E2' }), cursor: { x: 75, y: 60 }, caption: '…and the right column splits. Each window gets an equal share' },
  { d: 800, ...tiled(T_L, { E: at(T_TR, { z: 3 }), E2: at(T_BR, { z: 4 }) }, { active: 'E2' }), cursor: RED(T_BR), caption: 'Close the bottom one…' },
  {
    d: 1800, ...tiled(T_L, { E: at(T_R, { z: 3 }), E2: offT(at(T_BR, { z: 4 })) }, { active: 'E' }), cursor: { ...RED(T_BR), down: true, fast: true },
    caption: '…and the top one takes the whole right half',
  },
  { d: 800, ...tiled(T_L, { E: at(T_R, { z: 3 }) }, { active: 'E' }), cursor: RED(T_R), caption: 'Close the last Finder window…' },
  {
    d: 2500, ...tiled(T_FULL, { E: offT(at(T_R, { z: 3 })) }), cursor: { ...RED(T_R), down: true, fast: true },
    caption: '…and the group fills the screen again',
  },
]

/* 9 — Arrange tiles ------------------------------------------------------ */
const A_L = { x: 1, y: 2, w: 48.5, h: 94 }
const A_TR = { x: 50.5, y: 2, w: 48.5, h: 46 }
const A_BR = { x: 50.5, y: 50, w: 48.5, h: 46 }
// After dragging the column edge from x ≈ 50 to x ≈ 63.
const W_L = { x: 1, y: 2, w: 61.5, h: 94 }
const W_TR = { x: 63.5, y: 2, w: 35.5, h: 46 }
const W_BR = { x: 63.5, y: 50, w: 35.5, h: 46 }
const swapped = { A: at(A_L, { z: 2 }), C: at(A_TR, { z: 3 }), B: at(A_BR, { z: 1 }) }
const resized = { A: at(W_L, { z: 2 }), C: at(W_TR, { z: 3 }), B: at(W_BR, { z: 1 }) }
export const arrangeTiles = [
  { d: 1500, win: { C: at(A_L, { z: 2 }), A: at(A_TR, { z: 1 }), B: at(A_BR, { z: 1 }) }, active: 'C', cursor: { x: 30, y: 60 }, caption: 'Three windows in the layout' },
  { d: 800, win: { C: at(A_L, { z: 2 }), A: at(A_TR, { z: 1 }), B: at(A_BR, { z: 1 }) }, active: 'C', cursor: { x: 24, y: 4.5 }, caption: 'Drag a tiled window by its title bar…' },
  { d: 450, win: { C: at(A_L, { z: 2 }), A: at(A_TR, { z: 1 }), B: at(A_BR, { z: 1 }) }, active: 'C', cursor: { x: 24, y: 4.5, down: true }, caption: 'Drag a tiled window by its title bar…' },
  {
    d: 1500, win: { C: at(A_L, { x: 50, y: 15, z: 5 }), A: at(A_TR, { z: 1 }), B: at(A_BR, { z: 1 }) }, active: 'C',
    cursor: { x: 73, y: 17.5, down: true }, caption: '…onto another tile',
  },
  { d: 1800, win: swapped, active: 'C', cursor: { x: 73, y: 17.5 }, caption: 'Let go, and the two swap places' },
  { d: 800, win: swapped, active: 'C', cursor: { x: 49.8, y: 60 }, caption: 'Drag the edge between tiles…' },
  { d: 450, win: swapped, active: 'C', cursor: { x: 49.8, y: 60, down: true }, caption: 'Drag the edge between tiles…' },
  { d: 1500, win: resized, active: 'C', cursor: { x: 62.8, y: 60, down: true }, caption: '…and the tiles next to it resize to match' },
  { d: 1000, win: resized, active: 'C', cursor: { x: 62.8, y: 60 }, caption: '…and the tiles next to it resize to match' },
  { d: 800, win: resized, active: 'C', cursor: { x: 78, y: 52.5 }, caption: 'Drag a tile somewhere that isn’t another tile…' },
  { d: 450, win: { ...resized, B: at(W_BR, { z: 3 }) }, active: 'B', cursor: { x: 78, y: 52.5, down: true }, caption: 'Drag a tile somewhere that isn’t another tile…' },
  { d: 1300, win: { ...resized, B: at(W_BR, { x: 69, y: 63, z: 4 }) }, active: 'B', cursor: { x: 83.5, y: 65.5, down: true }, caption: 'Drag a tile somewhere that isn’t another tile…' },
  { d: 2200, win: { ...resized, B: at(W_BR, { z: 3 }) }, active: 'B', cursor: { x: 83.5, y: 65.5 }, caption: '…and let go. It slides back into its tile' },
]

/* 9b — Saved layouts ----------------------------------------------------- */
// Code editor on the left, a Browser + Mail tab group on the right (frames stop above the Dock, like the tiles).
const SG = inTile(T_R)
const arranged = {
  win: { C: at(T_L, { z: 2 }), A: at(SG, { z: 3 }), D: at(SG, { z: 1 }) },
  tabs: { ...SG, items: ['A', 'D'], active: 'A' },
  active: 'A',
  dock: { running: ['A', 'C', 'D'] },
}
// Later: the editor moved, Mail pulled out of the group (so the group's bar goes), then Browser minimized.
const moved = { C: { x: 24, y: 12, w: 46, h: 56, z: 4 }, A: at(SG, { z: 2 }), D: { x: 5, y: 38, w: 38, h: 46, z: 5 } }
const minimized = { ...moved, A: intoDock(SG, 'A') }
const messy = (win, extra) => ({ win, active: 'D', dock: { running: ['A', 'C', 'D'] }, ...extra })
export const savedLayouts = [
  { d: 1600, ...arranged, caption: 'Arrange your windows the way you like them' },
  {
    d: 2600, ...arranged, keys: ['⌃', '⌥', '⇧', '1'], toast: { title: 'Layout 1 saved', detail: '3 windows · ⌃⌥1 brings them back' },
    caption: 'Press ⌃⌥⇧1 to save them as layout 1',
  },
  { d: 1800, ...messy(moved), caption: 'Later, windows get moved around and pulled out of groups…' },
  { d: 1400, ...messy(minimized), caption: '…or minimized' },
  { d: 1000, ...messy(minimized, { keys: ['⌃', '⌥', '1'] }), caption: 'Press ⌃⌥1…' },
  {
    d: 2800, ...arranged, keys: ['⌃', '⌥', '1'], toast: { title: 'Layout 1 restored', detail: '3 windows' },
    caption: '…and everything glides back into place, tab group included',
  },
  {
    d: 2800, ...arranged, keys: ['⌃', '⌥', '3'], toast: { title: 'No layout saved as 3', detail: 'Arrange your windows, then press ⌃⌥⇧3 to save them' },
    caption: 'A number with nothing saved tells you how to save one',
  },
]

/* 10 — Menu bar ---------------------------------------------------------- */
const mWin = { A: { x: 6, y: 18, w: 46, h: 62, z: 1 } }
export const menuBar = [
  { d: 1200, win: mWin, cursor: { x: 70, y: 40 }, caption: 'Paneful lives in your menu bar' },
  { d: 700, win: mWin, cursor: STATUS, caption: 'Paneful lives in your menu bar' },
  { d: 1600, win: mWin, cursor: { ...STATUS, down: true, fast: true }, menu: { items: menuItems() }, caption: 'Every action and setting in one place' },
  { d: 1500, win: mWin, cursor: { x: 80, y: MENU_Y[18] }, menu: { items: menuItems(), hover: 18 }, caption: 'Turn features on or off' },
  { d: 1500, win: mWin, cursor: { x: 80, y: MENU_Y[18], down: true, fast: true }, menu: { items: menuItems({ launch: true }), hover: 18 }, caption: 'Turn on Launch at Login' },
  { d: 1600, win: mWin, cursor: { x: 80, y: MENU_Y[12] }, menu: { items: menuItems({ launch: true }), hover: 12 }, caption: 'Auto-tiling options have their own submenu' },
  { d: 1800, win: mWin, cursor: { x: 80, y: MENU_Y[8] }, menu: { items: menuItems({ launch: true }), hover: 8 }, caption: 'Review or forget remembered groups' },
  { d: 1800, win: mWin, cursor: { x: 80, y: MENU_Y[4] }, menu: { items: menuItems({ launch: true }), hover: 4 }, caption: 'Restore, save or forget saved layouts' },
  { d: 1200, win: mWin, cursor: { x: 70, y: 40 }, caption: 'Paneful lives in your menu bar' },
]
