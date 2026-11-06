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

/* 7 — Auto-tiling (optional, coming soon) -------------------------------- */
const TOPR = { x: 50.5, y: 2, w: 48.5, h: 46 }
const BOTR = { x: 50.5, y: 50, w: 48.5, h: 46 }
export const autoTiling = [
  { d: 1600, win: { A: at(FULL, { z: 1 }), E: hidden(at(R, { s: 0.9 })), B: hidden(at(BOTR, { s: 0.9 })) }, active: 'A', caption: 'One window fills the screen' },
  { d: 1300, win: { A: at(L, { z: 1 }), E: hidden(at(R, { s: 0.9 })), B: hidden(at(BOTR, { s: 0.9 })) }, active: 'A', preview: { ...R, label: 'Opening Finder…' }, caption: 'Open a new window. Space is made for it' },
  { d: 1800, win: { A: at(L, { z: 1 }), E: at(R, { z: 2 }), B: hidden(at(BOTR, { s: 0.9 })) }, active: 'E', caption: 'It takes the right half' },
  { d: 2000, win: { A: at(L, { z: 1 }), E: at(TOPR, { z: 2 }), B: at(BOTR, { z: 3 }) }, active: 'B', caption: 'The next one splits the right column' },
  { d: 1800, win: { A: at(L, { z: 1 }), E: at(R, { z: 2 }), B: hidden(at(BOTR, { s: 0.85 })) }, active: 'E', caption: 'Close a window and its space is handed back' },
  { d: 2200, win: { A: at(FULL, { z: 1 }), E: hidden(at(R, { s: 0.85 })), B: hidden(at(BOTR, { s: 0.85 })) }, active: 'A', caption: 'Close the last one and the screen is full again' },
]

/* 8 — Menu bar ----------------------------------------------------------- */
const menuItems = (launch) => [
  { label: 'Paneful Desktop Manager', header: true },
  '-',
  { label: 'Snap Window', key: '▸' },
  { label: 'Side by Side with Previous', key: '⌃⌥S' },
  '-',
  { label: 'Tab with Previous Window', key: '⌃⌥T' },
  { label: 'Minimize Group', key: '⌃⌥M' },
  { label: 'Remembered Groups', key: '▸' },
  '-',
  { label: 'Drag to Screen Edge to Snap', on: true },
  { label: 'Drag onto Title Bar to Tab', on: true },
  { label: 'Auto-tab Remembered Windows', on: true },
  { label: 'Launch at Login', on: launch },
  '-',
  { label: 'Quit Paneful' },
]
const mWin = { A: { x: 6, y: 18, w: 46, h: 62, z: 1 } }
export const menuBar = [
  { d: 1200, win: mWin, cursor: { x: 70, y: 40 }, caption: 'Paneful lives in your menu bar' },
  { d: 700, win: mWin, cursor: { x: 95.2, y: -3 }, caption: 'Paneful lives in your menu bar' },
  { d: 1600, win: mWin, cursor: { x: 95.2, y: -3, down: true, fast: true }, menu: { items: menuItems(false) }, caption: 'Every action and setting in one place' },
  { d: 1500, win: mWin, cursor: { x: 80, y: 62 }, menu: { items: menuItems(false), hover: 12 }, caption: 'Turn features on or off' },
  { d: 1500, win: mWin, cursor: { x: 80, y: 62, down: true, fast: true }, menu: { items: menuItems(true), hover: 12 }, caption: 'Turn on Launch at Login' },
  { d: 1800, win: mWin, cursor: { x: 80, y: 33 }, menu: { items: menuItems(true), hover: 7 }, caption: 'Review or forget remembered groups' },
  { d: 1200, win: mWin, cursor: { x: 70, y: 40 }, caption: 'Paneful lives in your menu bar' },
]
