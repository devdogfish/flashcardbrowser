export function drawScratch(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const rnd = () => Math.random()
  const rndRange = (a: number, b: number) => a + rnd() * (b - a)

  // Long spanning scratches
  for (let i = 0; i < 8; i++) {
    const fromEdge = rnd() < 0.5
    const x = fromEdge ? rndRange(-50, w * 0.3) : rndRange(0, w)
    const y = fromEdge ? rndRange(0, h) : rndRange(-50, h * 0.3)
    const len = rndRange(w * 0.4, w * 1.1)
    const angle = rndRange(-0.3, 0.3) + (rnd() < 0.5 ? Math.PI * 0.25 : Math.PI * 0.5)
    const endX = x + Math.cos(angle) * len
    const endY = y + Math.sin(angle) * len

    ctx.beginPath()
    ctx.moveTo(x, y)
    const segments = Math.floor(rndRange(3, 7))
    for (let s = 1; s <= segments; s++) {
      const t = s / segments
      ctx.lineTo(x + (endX - x) * t + rndRange(-8, 8), y + (endY - y) * t + rndRange(-8, 8))
    }
    ctx.strokeStyle = `rgba(0,0,0,${rndRange(0.04, 0.14)})`
    ctx.lineWidth = rndRange(0.1, 0.6)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  // Medium curved scratches
  for (let i = 0; i < 25; i++) {
    const x = rnd() * w
    const y = rnd() * h
    const len = rndRange(40, Math.min(w, h) * 0.35)
    const angle = rndRange(0, Math.PI * 2)
    const endX = x + Math.cos(angle) * len
    const endY = y + Math.sin(angle) * len
    const cp1X = rndRange(Math.min(x, endX) - 40, Math.max(x, endX) + 40)
    const cp1Y = rndRange(Math.min(y, endY) - 40, Math.max(y, endY) + 40)
    const cp2X = rndRange(Math.min(x, endX) - 20, Math.max(x, endX) + 20)
    const cp2Y = rndRange(Math.min(y, endY) - 20, Math.max(y, endY) + 20)

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY)
    ctx.strokeStyle = `rgba(0,0,0,${rndRange(0.02, 0.09)})`
    ctx.lineWidth = rndRange(0.15, 0.5)
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  // Short hairline scratches
  for (let i = 0; i < 60; i++) {
    const x = rnd() * w
    const y = rnd() * h
    const len = rndRange(3, 35)
    const angle = rnd() * Math.PI * 2

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len)
    ctx.strokeStyle = `rgba(0,0,0,${rndRange(0.015, 0.07)})`
    ctx.lineWidth = rndRange(0.1, 0.35)
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  // Dust clusters
  for (let c = 0; c < 8; c++) {
    const cx = rnd() * w
    const cy = rnd() * h
    const clusterSize = rndRange(30, 120)
    for (let i = 0; i < Math.floor(rndRange(5, 20)); i++) {
      const x = cx + rndRange(-clusterSize, clusterSize)
      const y = cy + rndRange(-clusterSize * 0.6, clusterSize * 0.6)
      const rx = rndRange(0.5, 4)
      const ry = rx * rndRange(0.2, 0.9)
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, rnd() * Math.PI, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0,0,0,${rndRange(0.04, 0.14)})`
      ctx.fill()
    }
  }

  // Scattered particles
  for (let i = 0; i < 250; i++) {
    const x = rnd() * w
    const y = rnd() * h
    if (rnd() < 0.4) {
      const len = rndRange(1, 6)
      const angle = rnd() * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len)
      ctx.strokeStyle = `rgba(0,0,0,${rndRange(0.03, 0.12)})`
      ctx.lineWidth = rndRange(0.3, 1.2)
      ctx.lineCap = 'round'
      ctx.stroke()
    } else {
      const rx = rndRange(0.3, 3)
      const ry = rx * rndRange(0.3, 1)
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, rnd() * Math.PI, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(0,0,0,${rndRange(0.025, 0.1)})`
      ctx.fill()
    }
  }

  // Micro grain
  for (let i = 0; i < 1200; i++) {
    const x = rnd() * w
    const y = rnd() * h
    ctx.beginPath()
    ctx.arc(x, y, rndRange(0.1, 0.6), 0, Math.PI * 2)
    ctx.fillStyle = `rgba(0,0,0,${rndRange(0.008, 0.035)})`
    ctx.fill()
  }

  // Faint smudge blobs
  for (let i = 0; i < 6; i++) {
    const x = rnd() * w
    const y = rnd() * h
    const rx = rndRange(4, 18)
    const ry = rx * rndRange(0.3, 0.7)
    const g = ctx.createRadialGradient(x, y, 0, x, y, rx)
    g.addColorStop(0, `rgba(0,0,0,${rndRange(0.02, 0.06)})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath()
    ctx.ellipse(x, y, rx, ry, rnd() * Math.PI, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()
  }
}
