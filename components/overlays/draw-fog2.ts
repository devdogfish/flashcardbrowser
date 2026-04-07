import { createAirPocketSystem } from './air-pockets'

// Toggle air pockets on/off — one line
const AIR_POCKETS_ENABLED = false

// --- Master strength (1.0 = current look, 0 = invisible, 2.0 = double intensity) ---
const STRENGTH = 1.0

// --- Tuning Constants ---
const OCTAVES      = 5
const WARP_OCTAVES = 3
const PERSISTENCE  = 0.5
const LACUNARITY   = 2.0
const NOISE_SCALE  = 0.0032

const DRIFT_SPEED   = 0.42   // CSS px/frame — main horizontal drift
const WARP_SPEED    = 0.22
const WARP_STRENGTH = 3.5

const DENSITY_THRESHOLD = 0.36
const DENSITY_CONTRAST  = 2.6
const MAX_ALPHA         = 0.21 * STRENGTH

const WHITE_THRESHOLD = 0.82   // d values above this blend toward white
const WHITE_MAX_ALPHA = 0.76   // alpha at peak white patches

const BAND_CENTER    = 0.50
const BAND_HALFWIDTH = 0.55
const BAND_FALLOFF   = 0.00

const VOID_FREQ     = 0.25
const VOID_TIME     = 0.12
const VOID_STRENGTH = 0.24

const SCALE = 4

const FOG_R = 92, FOG_G = 97, FOG_B = 116

// --- Wind disturbance system ---
type Disturbance = { x: number; y: number; t: number }
const disturbances: Disturbance[] = []

const DIST_EXPAND_MS  = 310
const DIST_TOTAL_MS   = 3800
const DIST_MAX_R_FRAC = 0.47
const DIST_STRENGTH   = 1.0

export function addWindDisturbance(screenX: number, screenY: number): void {
  disturbances.push({ x: screenX, y: screenY, t: performance.now() })
}

// --- Permutation table (randomised on module load) ---
const PERM = new Uint8Array(512)
;(function initPerm() {
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0
    const t = p[i]; p[i] = p[j]; p[j] = t
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255]
})()

function quintic(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function noise2d(x: number, y: number): number {
  const ix = (x >= 0 ? x | 0 : (x | 0) - 1)
  const iy = (y >= 0 ? y | 0 : (y | 0) - 1)
  const fx = x - ix
  const fy = y - iy
  const sx = quintic(fx)
  const sy = quintic(fy)

  const aa = PERM[(PERM[ix & 255] + iy) & 255] / 255
  const ba = PERM[(PERM[(ix+1) & 255] + iy) & 255] / 255
  const ab = PERM[(PERM[ix & 255] + iy + 1) & 255] / 255
  const bb = PERM[(PERM[(ix+1) & 255] + iy + 1) & 255] / 255

  return aa + sx * (ba - aa) + sy * ((ab + sx * (bb - ab)) - (aa + sx * (ba - aa)))
}

function fbmN(x: number, y: number, octaves: number): number {
  let v = 0, amp = 1, freq = 1, maxAmp = 0
  for (let o = 0; o < octaves; o++) {
    v += amp * noise2d(x * freq, y * freq)
    maxAmp += amp
    amp  *= PERSISTENCE
    freq *= LACUNARITY
  }
  return v / maxAmp
}

function warpedSample(x: number, y: number, driftT: number, warpT: number): number {
  const wx = fbmN(x + warpT * 0.4,        y + 0.3,               WARP_OCTAVES) - 0.5
  const wy = fbmN(x + 4.1 + warpT * 0.35, y + 2.8 + warpT * 0.2, WARP_OCTAVES) - 0.5

  const sx = x + WARP_STRENGTH * wx + driftT
  const sy = y + WARP_STRENGTH * wy

  return fbmN(sx, sy, OCTAVES)
}

function buildVerticalMask(bh: number): Float32Array {
  const mask = new Float32Array(bh)
  for (let py = 0; py < bh; py++) {
    const d = Math.abs(py / bh - BAND_CENTER)
    if (d < BAND_HALFWIDTH) {
      mask[py] = 1.0
    } else if (d < BAND_HALFWIDTH + BAND_FALLOFF) {
      const t = (d - BAND_HALFWIDTH) / BAND_FALLOFF
      mask[py] = 1 - quintic(t)
    }
  }
  return mask
}

export function drawFog2(ctx: CanvasRenderingContext2D, w: number, h: number): () => void {
  const bw = Math.ceil(w / SCALE)
  const bh = Math.ceil(h / SCALE)

  const offscreen: HTMLCanvasElement | OffscreenCanvas =
    typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(bw, bh)
      : (() => { const c = document.createElement('canvas'); c.width = bw; c.height = bh; return c })()

  const offCtx  = (offscreen as OffscreenCanvas).getContext('2d') as unknown as CanvasRenderingContext2D
  const imgData = offCtx.createImageData(bw, bh)
  const px      = imgData.data

  const vMask = buildVerticalMask(bh)

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  let driftTime = 0
  let warpTime  = 0
  let rafId: number

  const pocketSystem = AIR_POCKETS_ENABLED ? createAirPocketSystem(bw, bh) : null

  function frame() {
    driftTime += DRIFT_SPEED * NOISE_SCALE
    warpTime  += WARP_SPEED  * NOISE_SCALE * 0.6

    pocketSystem?.update()

    // --- Pre-compute wind disturbances ---
    const now  = performance.now()
    const maxR = bw * DIST_MAX_R_FRAC
    for (let i = disturbances.length - 1; i >= 0; i--) {
      if (now - disturbances[i].t >= DIST_TOTAL_MS) disturbances.splice(i, 1)
    }
    const activeDisturbs = disturbances.map(d => {
      const elapsed = now - d.t
      const expandT = Math.min(elapsed / DIST_EXPAND_MS, 1.0)
      const r       = maxR * (1 - Math.pow(1 - expandT, 3))
      const s       = DIST_STRENGTH * Math.pow(1 - elapsed / DIST_TOTAL_MS, 1.8)
      return { bx: d.x / SCALE, by: d.y / SCALE, r, s }
    })

    for (let py = 0; py < bh; py++) {
      const vm      = vMask[py]
      const rowBase = py * bw * 4

      if (vm === 0) {
        px.fill(0, rowBase, rowBase + bw * 4)
        continue
      }

      const ny = py * NOISE_SCALE

      for (let qx = 0; qx < bw; qx++) {
        const nx  = qx * NOISE_SCALE
        const idx = rowBase + qx * 4

        const raw = warpedSample(nx, ny, driftTime, warpTime)

        // Slow large-scale void carving
        const voidN = noise2d(
          nx * VOID_FREQ + warpTime * VOID_TIME,
          ny * VOID_FREQ + warpTime * VOID_TIME * 0.4
        )
        let thresh = DENSITY_THRESHOLD + (voidN - 0.5) * 2 * VOID_STRENGTH

        // Air pocket force fields
        if (pocketSystem) thresh += pocketSystem.threshBoost(qx, py)

        // Wind disturbance: card whoosh temporarily repels the fog
        for (const ad of activeDisturbs) {
          const dx     = qx - ad.bx
          const dy     = py - ad.by
          const distSq = dx * dx + dy * dy
          if (distSq < ad.r * ad.r) {
            const ft = 1 - Math.sqrt(distSq) / ad.r
            thresh  += ft * ft * (3 - 2 * ft) * ad.s
          }
        }

        const shifted = raw - thresh
        if (shifted <= 0) {
          px[idx] = px[idx+1] = px[idx+2] = px[idx+3] = 0
          continue
        }

        const denom = Math.max(1 - thresh, 0.01)
        let d = shifted / denom
        d = d * d * (3 - 2 * d)
        d = Math.pow(d, 1 / DENSITY_CONTRAST)

        let r = FOG_R, g = FOG_G, b = FOG_B
        let alpha = d * vm * MAX_ALPHA

        if (d > WHITE_THRESHOLD) {
          const wt     = (d - WHITE_THRESHOLD) / (1 - WHITE_THRESHOLD)
          const wBlend = wt * wt  // ease in
          r     = (FOG_R + (255 - FOG_R) * wBlend + 0.5) | 0
          g     = (FOG_G + (255 - FOG_G) * wBlend + 0.5) | 0
          b     = (FOG_B + (255 - FOG_B) * wBlend + 0.5) | 0
          alpha = d * vm * (MAX_ALPHA + (WHITE_MAX_ALPHA - MAX_ALPHA) * wBlend)
        }

        px[idx]   = r
        px[idx+1] = g
        px[idx+2] = b
        px[idx+3] = (alpha * 255 + 0.5) | 0
      }
    }

    offCtx.putImageData(imgData, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(offscreen as CanvasImageSource, 0, 0, w, h)

    rafId = requestAnimationFrame(frame)
  }

  rafId = requestAnimationFrame(frame)
  return () => cancelAnimationFrame(rafId)
}
