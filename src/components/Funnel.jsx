import { useEffect, useRef } from 'react'
import { SectionHead, Reveal, Chevron } from './shared.jsx'

/**
 * "Every window finds its place": a stream of tiny window particles falls through a funnel
 * and settles into a neat grid (inspired by the hourglass/particle section in the reference).
 */
function FunnelCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf, w, h, dpr
    let particles = []
    let slots = []
    let nextSlot = 0
    let spawnTimer = 0
    let last = performance.now()

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildSlots()
    }

    const buildSlots = () => {
      slots = []
      const cw = 9, ch = 6, gap = 3
      const cols = Math.floor((w * 0.62) / (cw + gap))
      const rows = 6
      const startX = (w - cols * (cw + gap)) / 2
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          slots.push({ x: startX + c * (cw + gap), y: h - 18 - (r + 1) * (ch + gap), w: cw, h: ch })
        }
      }
      // Fill from the middle outward so it piles like sand.
      const mid = w / 2
      slots.sort((a, b) => (a.y === b.y ? Math.abs(a.x - mid) - Math.abs(b.x - mid) : b.y - a.y))
      particles = []
      nextSlot = 0
    }

    const spawn = () => {
      if (nextSlot >= slots.length) {
        // Grid full: fade everything and restart.
        particles.forEach((p) => (p.fading = true))
        nextSlot = 0
        return
      }
      const slot = slots[nextSlot++]
      particles.push({
        x: w / 2 + (Math.random() - 0.5) * w * 0.5,
        y: -10 - Math.random() * 40,
        sx: 0, sy: 0,
        slot,
        t: 0,
        dur: 1.6 + Math.random() * 0.8,
        alpha: 1,
        fading: false,
        hue: Math.random() < 0.18 ? 'accent' : 'white',
      })
      const p = particles[particles.length - 1]
      p.sx = p.x
      p.sy = p.y
    }

    const ease = (t) => 1 - Math.pow(1 - t, 3)

    const draw = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      ctx.clearRect(0, 0, w, h)

      // Dotted columns above the funnel.
      ctx.fillStyle = 'rgba(160,150,255,0.18)'
      for (let x = w * 0.3; x <= w * 0.7; x += 14) {
        for (let y = 10; y < h * 0.45; y += 14) ctx.fillRect(x, y, 1.5, 1.5)
      }

      // Funnel outline.
      const neckY = h * 0.5
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(w * 0.28, h * 0.08); ctx.lineTo(w / 2 - 6, neckY); ctx.lineTo(w / 2 - 6, neckY + 14)
      ctx.moveTo(w * 0.72, h * 0.08); ctx.lineTo(w / 2 + 6, neckY); ctx.lineTo(w / 2 + 6, neckY + 14)
      ctx.stroke()

      spawnTimer += dt
      const rate = reduce ? 0.2 : 0.035
      while (spawnTimer > rate) { spawnTimer -= rate; spawn() }

      particles = particles.filter((p) => p.alpha > 0.02)
      for (const p of particles) {
        if (p.fading) p.alpha -= dt * 1.5
        p.t = Math.min(p.t + dt / p.dur, 1)
        const t = p.t
        let x, y
        if (t < 0.55) {
          // Fall toward the neck.
          const k = ease(t / 0.55)
          x = p.sx + (w / 2 - p.sx) * k
          y = p.sy + (neckY - p.sy) * (t / 0.55) ** 1.6
        } else {
          // Out of the neck into its slot.
          const k = ease((t - 0.55) / 0.45)
          x = w / 2 + (p.slot.x - w / 2) * k
          y = neckY + (p.slot.y - neckY) * k
        }
        const settled = t >= 1
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.hue === 'accent' ? '#FF6A5C' : settled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.75)'
        const sw = settled ? p.slot.w : 3, sh = settled ? p.slot.h : 3
        ctx.beginPath()
        ctx.roundRect(x, y, sw, sh, settled ? 1.5 : 1.5)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={ref} className="funnel-canvas" aria-hidden="true" />
}

export default function Funnel() {
  return (
    <section className="section">
      <div className="panel panel--hero-top">
        <SectionHead
          title="Every window finds its place"
          sub="Open twenty windows across ten apps. Paneful catches each one and puts it exactly where it belongs."
        />
        <div className="split">
          <Reveal className="split-copy">
            <h3>Learn about the Paneful engine</h3>
            <p className="muted-sm">See how it keeps you focused</p>
            <p>
              Paneful uses macOS's built-in Accessibility API to move, resize and raise the windows of any
              app, with no plugins and no per-app setup. If it's a window, Paneful can snap it or tab it.
            </p>
            <a href="#how" className="btn btn--tiny">Learn more <Chevron /></a>
          </Reveal>
          <FunnelCanvas />
        </div>
      </div>
    </section>
  )
}
