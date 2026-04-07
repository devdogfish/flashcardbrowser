interface Puff {
  x: number
  y: number
  rx: number
  ry: number
  alpha: number
  rot: number
  rotSpeed: number
  driftVX: number
  driftVY: number
  breatheFreq: number
  breathePhase: number
  tOffset: number
  tx: { amp: number; freq: number; phase: number }[]
  ty: { amp: number; freq: number; phase: number }[]
}

const FOG_COLOR = '110,116,134'

export function drawFog(ctx: CanvasRenderingContext2D, w: number, h: number): () => void {
  const r = () => Math.random()
  const rr = (a: number, b: number) => a + r() * (b - a)
  const sign = () => (r() < 0.5 ? 1 : -1)

  function makePuff(layer: 0 | 1 | 2): Puff {
    // layer 0: large diffuse background mass
    // layer 1: medium rolling clouds
    // layer 2: fine wisps and tendrils
    const cfg = [
      { rMin: w * 0.2,  rMax: w * 0.42, sqMin: 0.3, sqMax: 0.7, aMin: 0.012, aMax: 0.038, speed: 0.035, ta: 16 },
      { rMin: w * 0.07, rMax: w * 0.18, sqMin: 0.2, sqMax: 0.6, aMin: 0.022, aMax: 0.058, speed: 0.07,  ta: 10 },
      { rMin: w * 0.02, rMax: w * 0.07, sqMin: 0.1, sqMax: 0.45,aMin: 0.03,  aMax: 0.085, speed: 0.14,  ta: 6  },
    ][layer]

    const rx = rr(cfg.rMin, cfg.rMax)
    const ry = rx * rr(cfg.sqMin, cfg.sqMax)

    // Concentrate fog in horizontal band, sparser toward edges
    const yBias = layer === 0
      ? rr(h * 0.15, h * 0.85)
      : rr(h * 0.05, h * 0.95)

    return {
      x: rr(-rx * 2, w + rx * 2),
      y: yBias,
      rx,
      ry,
      alpha: rr(cfg.aMin, cfg.aMax),
      rot: rr(0, Math.PI * 2),
      rotSpeed: rr(0.00008, 0.00018) * sign(),
      driftVX: rr(cfg.speed * 0.4, cfg.speed) * sign(),
      driftVY: rr(0, cfg.speed * 0.12) * sign(),
      breatheFreq: rr(0.0003, 0.0009),
      breathePhase: rr(0, Math.PI * 2),
      tOffset: rr(0, 50000),
      tx: [
        { amp: rr(cfg.ta * 0.5, cfg.ta),       freq: rr(0.0001, 0.0005), phase: rr(0, Math.PI * 2) },
        { amp: rr(cfg.ta * 0.2, cfg.ta * 0.5), freq: rr(0.0006, 0.0018), phase: rr(0, Math.PI * 2) },
        { amp: rr(cfg.ta * 0.1, cfg.ta * 0.3), freq: rr(0.002,  0.005 ), phase: rr(0, Math.PI * 2) },
      ],
      ty: [
        { amp: rr(cfg.ta * 0.25, cfg.ta * 0.6), freq: rr(0.00008, 0.0003), phase: rr(0, Math.PI * 2) },
        { amp: rr(cfg.ta * 0.1,  cfg.ta * 0.3), freq: rr(0.0005,  0.0012), phase: rr(0, Math.PI * 2) },
      ],
    }
  }

  const puffs: Puff[] = [
    ...Array.from({ length: 7  }, () => makePuff(0)),
    ...Array.from({ length: 16 }, () => makePuff(1)),
    ...Array.from({ length: 26 }, () => makePuff(2)),
  ]

  let t = 0
  let rafId: number

  function frame() {
    t++
    ctx.clearRect(0, 0, w, h)

    for (const p of puffs) {
      const lt = t + p.tOffset

      // Turbulence: sum of harmonics displaces visual position
      let turbX = 0, turbY = 0
      for (const tx of p.tx) turbX += Math.sin(lt * tx.freq + tx.phase) * tx.amp
      for (const ty of p.ty) turbY += Math.cos(lt * ty.freq + ty.phase) * ty.amp

      // Drift actual position
      p.x += p.driftVX
      p.y += p.driftVY
      p.rot += p.rotSpeed

      // Wrap off-screen (invisible since puff is fully outside margin)
      const margin = Math.max(p.rx, p.ry) * 2
      if (p.x >  w + margin) p.x = -margin
      if (p.x < -margin)     p.x =  w + margin
      if (p.y >  h + margin) p.y = -margin
      if (p.y < -margin)     p.y =  h + margin

      // Breathe: slow alpha pulse makes it feel alive
      const breathe = 1 + Math.sin(lt * p.breatheFreq + p.breathePhase) * 0.22
      const a = p.alpha * Math.max(0, breathe)

      const drawX = p.x + turbX
      const drawY = p.y + turbY

      ctx.save()
      ctx.translate(drawX, drawY)
      ctx.rotate(p.rot)

      // Scale to ellipse shape before drawing circle
      const maxR = Math.max(p.rx, p.ry)
      ctx.scale(p.rx / maxR, p.ry / maxR)

      // Multi-stop radial gradient for soft, volumetric look
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR)
      g.addColorStop(0,    `rgba(${FOG_COLOR},${a})`)
      g.addColorStop(0.25, `rgba(${FOG_COLOR},${a * 0.82})`)
      g.addColorStop(0.5,  `rgba(${FOG_COLOR},${a * 0.5})`)
      g.addColorStop(0.72, `rgba(${FOG_COLOR},${a * 0.2})`)
      g.addColorStop(0.88, `rgba(${FOG_COLOR},${a * 0.06})`)
      g.addColorStop(1,    `rgba(${FOG_COLOR},0)`)

      ctx.beginPath()
      ctx.arc(0, 0, maxR, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
      ctx.restore()
    }

    rafId = requestAnimationFrame(frame)
  }

  rafId = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(rafId)
}
