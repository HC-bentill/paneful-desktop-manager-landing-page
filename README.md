# Paneful landing page

Marketing site for [Paneful Desktop Manager](https://github.com/HC-bentill/paneful), built with React + Vite + Framer Motion.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/
```

## Pages
- `/`: landing page (`index.html` → `src/main.jsx` → `src/App.jsx`)
- `/docs/`: documentation with an animated demo of every feature (`docs/index.html` → `src/docs-main.jsx` → `src/docs/DocsApp.jsx`)

### How the docs animations work
`src/docs/Stage.jsx` renders a tiny Mac desktop (menu bar, windows, tab bar, snap preview, cursor, Dock, keys).
Each demo in `src/docs/demos.js` is a list of steps, and each step is a full snapshot of the scene
(window frames in %, cursor, preview, tabs, keys, caption) plus how long to hold it. Optional extras: `ph: true` on a
frame draws it as an auto-tiling placeholder (dark tile with the app's icon and name), `hl: true` highlights it as a
drop target, `tabs.hover` outlines a tab, `file: { x, y, name, lifted }` draws a dragged file, and
`toast: { title, detail }` shows Paneful's confirmation pop-up (as for saved layouts), `tabs.away: [ids]` dims tabs
whose windows are elsewhere, and `mc: true` plus `spaces: { items: [{ label, x, y, w, h, on, hl, mini }] }` draws
Mission Control (dimmed wallpaper and the row of desktops, each with tiny windows for what's on it). The stage loops
through the steps while it's on screen, and framer-motion tweens between them. To document a new
feature, add a step list to `demos.js` and a `<DocSection demoProps={{ steps }} />` in `DocsApp.jsx`.

Links use `import.meta.env.BASE_URL`, so the site also works under a sub-path such as GitHub Pages
(`vite build --base=/<repo>/`).

## Landing page sections and animations
| Section | Animation |
|---|---|
| Hero | Floating 3D logo with mouse parallax and an orbit of app chips around it |
| Every window finds its place | Canvas particles fall through a funnel and stack into a grid |
| Level up your desktop | Scroll-linked giant marquee text while a Mac desktop mock rises in (tabs switch live) |
| General features | 3D-tilted cards under a pulsing spotlight beam |
| How it works | Isometric cards plus auto-advancing 01–04 steps with progress bars |
| Calm with Paneful | Bento cards with a cursor-following glow |
| Tab memory | Pulsing logo badge with floating app glyphs |
| Get Paneful | Email capture with a rising gradient glow |

The `Notify me` form is UI-only. Wire `src/components/Cta.jsx` to a mailing list before launch.
Deploys to any static host (GitHub Pages, Vercel, Netlify).

## Analytics
Both pages render `<Analytics />` from `@vercel/analytics` (in `src/main.jsx` and `src/docs-main.jsx`), which records
page views once **Analytics is enabled for the project in the Vercel dashboard**. During `npm run dev` it only logs
to the browser console. The script is served from `/_vercel/insights/`, so it only reports on Vercel deployments;
on other hosts it does nothing.
