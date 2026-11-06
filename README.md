# Paneful landing page

Marketing site for [Paneful Desktop Manager](https://github.com/HC-bentill/paneful), built with React + Vite + Framer Motion.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # static site in dist/
```

## Sections and animations
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
