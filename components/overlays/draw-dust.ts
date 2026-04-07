export function drawDust(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const rnd = () => Math.random()
  const rndRange = (a: number, b: number) => a + rnd() * (b - a)

  // --- Atmospheric haze patches (large, very soft) ---
  // Simulates uneven density of airborne particles in different zones
  for (let i = 0; i < 5; i++) {
    const x = rnd() * w
    const y = rnd() * h
    const r = rndRange(w * 0.1, w * 0.35)
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(0,0,0,${rndRange(0.012, 0.028)})`)
    g.addColorStop(0.5, `rgba(0,0,0,${rndRange(0.004, 0.012)})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath()
    ctx.ellipse(x, y, r, r * rndRange(0.5, 1.0), rnd() * Math.PI, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()
  }

  // --- Large dust motes (the ones you see in a sunbeam) ---
  // Soft-edged, slightly irregular, with a bright center and feathered edge
  for (let i = 0; i < 12; i++) {
    const x = rnd() * w
    const y = rnd() * h
    const r = rndRange(2.5, 9)
    const squish = rndRange(0.5, 1.0)
    const rot = rnd() * Math.PI

    // Outer soft glow
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5)
    glow.addColorStop(0, `rgba(0,0,0,${rndRange(0.04, 0.1)})`)
    glow.addColorStop(0.4, `rgba(0,0,0,${rndRange(0.01, 0.04)})`)
    glow.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath()
    ctx.ellipse(x, y, r * 2.5, r * 2.5 * squish, rot, 0, Math.PI * 2)
    ctx.fillStyle = glow
    ctx.fill()

    // Solid core
    ctx.beginPath()
    ctx.ellipse(x, y, r * rndRange(0.3, 0.6), r * rndRange(0.2, 0.5) * squish, rot, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(0,0,0,${rndRange(0.06, 0.15)})`
    ctx.fill()
  }

  // --- Mid-size floating particles ---
  for (let i = 0; i < 180; i++) {
    const x = rnd() * w
    const y = rnd() * h
    const r = rndRange(0.6, 3.5)
    const squish = rndRange(0.4, 1.0)
    const rot = rnd() * Math.PI

    // Some have a soft halo, others are just solid
    if (rnd() < 0.35) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2)
      g.addColorStop(0, `rgba(0,0,0,${rndRange(0.05, 0.12)})`)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.ellipse(x, y, r * 2, r * 2 * squish, rot, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    } else {
      ctx.beginPath()
      ctx.ellipse(x, y, r, r * squish, rot, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0,0,0,${rndRange(0.03, 0.1)})`
      ctx.fill()
    }
  }

  // --- Motion-blur specks (particles mid-float) ---
  // Short blurred streaks simulating particles drifting slowly
  for (let i = 0; i < 80; i++) {
    const x = rnd() * w
    const y = rnd() * h
    const len = rndRange(1.5, 10)
    // Mostly drifting horizontally or at slight angles
    const angle = rndRange(-0.4, 0.4) + (rnd() < 0.5 ? 0 : Math.PI)
    const endX = x + Math.cos(angle) * len
    const endY = y + Math.sin(angle) * len

    const g = ctx.createLinearGradient(x, y, endX, endY)
    const alpha = rndRange(0.03, 0.1)
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(0.4, `rgba(0,0,0,${alpha})`)
    g.addColorStop(0.6, `rgba(0,0,0,${alpha})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(endX, endY)
    ctx.strokeStyle = g
    ctx.lineWidth = rndRange(0.4, 1.8)
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  // --- Dense dust clouds (tight particle clusters) ---
  for (let c = 0; c < 10; c++) {
    const cx = rnd() * w
    const cy = rnd() * h
    const spread = rndRange(20, 90)
    const count = Math.floor(rndRange(8, 25))
    for (let i = 0; i < count; i++) {
      // Gaussian-ish distribution within cluster
      const dx = (rndRange(-1, 1) + rndRange(-1, 1)) * spread * 0.5
      const dy = (rndRange(-1, 1) + rndRange(-1, 1)) * spread * 0.3
      const r = rndRange(0.3, 2.5)
      ctx.beginPath()
      ctx.arc(cx + dx, cy + dy, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0,0,0,${rndRange(0.03, 0.11)})`
      ctx.fill()
    }
  }

  // --- Fine atmospheric grain (the base layer) ---
  for (let i = 0; i < 1800; i++) {
    const x = rnd() * w
    const y = rnd() * h
    ctx.beginPath()
    ctx.arc(x, y, rndRange(0.1, 0.55), 0, Math.PI * 2)
    ctx.fillStyle = `rgba(0,0,0,${rndRange(0.006, 0.03)})`
    ctx.fill()
  }

  // --- Rare large settled dust blobs (like on a lens) ---
  for (let i = 0; i < 4; i++) {
    const x = rnd() * w
    const y = rnd() * h
    const rx = rndRange(6, 22)
    const ry = rx * rndRange(0.4, 0.8)
    const g = ctx.createRadialGradient(x, y, 0, x, y, rx)
    g.addColorStop(0, `rgba(0,0,0,${rndRange(0.03, 0.07)})`)
    g.addColorStop(0.6, `rgba(0,0,0,${rndRange(0.01, 0.03)})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, rnd() * Math.PI, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()
  }
}
