// --- Master strength (1.0 = current look, 0 = invisible, 2.0 = double intensity) ---
const STRENGTH = 1.0

// --- Tuning Constants ---
const OCTAVES     = 5
const WARP_OCTAVES = 3       // warp field needs less detail
const PERSISTENCE = 0.5
const LACUNARITY  = 2.0
const NOISE_SCALE = 0.0032

const DRIFT_SPEED  = 0.6    // CSS px/frame — main horizontal drift
const WARP_SPEED   = 0.25   // how fast the warp field itself evolves
const WARP_STRENGTH = 3.5   // how strongly the warp displaces sample coords (noise units)

const DENSITY_THRESHOLD = 0.36
const DENSITY_CONTRAST  = 3.0
const MAX_ALPHA         = 0.18 * STRENGTH

const BAND_CENTER    = 0.52
const BAND_HALFWIDTH = 0.22
const BAND_FALLOFF   = 0.16

const VOID_FREQ     = 0.25
const VOID_TIME     = 0.12
const VOID_STRENGTH = 0.24

const SCALE = 4

const FOG_R = 92, FOG_G = 97, FOG_B = 116

// --- Permutation table (randomised on module load) ---
const PERM = new Uint8Array(512)
;(function initPerm() {
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0
    const t = p[i]; p[i] = p[j]; p[j] = t
  }
  // Double to avoid & 255 in hot loop
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255]
})()

// Quintic smoothstep (C2 continuous)
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

// --- Domain-warped fBm ---
// Warp the sample coordinates using a secondary noise field before sampling.
// This creates organic swirling/billowing motion rather than simple translation.
// Two independent warp channels (offset by magic constants) give a 2D warp vector.
function warpedSample(x: number, y: number, driftT: number, warpT: number): number {
  // Warp vector — coarse noise field that evolves at warpT
  const wx = fbmN(x + warpT * 0.4,        y + 0.3,           WARP_OCTAVES) - 0.5
  const wy = fbmN(x + 4.1 + warpT * 0.35, y + 2.8 + warpT * 0.2, WARP_OCTAVES) - 0.5

  // Warp + drift: displace coords then slide horizontally
  const sx = x + WARP_STRENGTH * wx + driftT
  const sy = y + WARP_STRENGTH * wy

  return fbmN(sx, sy, OCTAVES)
}

// --- Vertical mask — precomputed each init ---
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

  const offCtx  = (offscreen as OffscreenCanvas).getContext('2d') as CanvasRenderingContext2D
  const imgData = offCtx.createImageData(bw, bh)
  const px      = imgData.data

  const vMask = buildVerticalMask(bh)

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  let driftTime = 0  // drives horizontal translation
  let warpTime  = 0  // drives warp field evolution (different rate = never loops)
  let rafId: number

  function frame() {
    // Drift and warp advance at different rates so the pattern never repeats
    driftTime += DRIFT_SPEED  * NOISE_SCALE
    warpTime  += WARP_SPEED   * NOISE_SCALE * 0.6

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

        // Void carving: slow large-scale modulation of threshold
        const voidN = noise2d(
          nx * VOID_FREQ + warpTime * VOID_TIME,
          ny * VOID_FREQ + warpTime * VOID_TIME * 0.4
        )
        const thresh = DENSITY_THRESHOLD + (voidN - 0.5) * 2 * VOID_STRENGTH

        const shifted = raw - thresh
        if (shifted <= 0) {
          px[idx] = px[idx+1] = px[idx+2] = px[idx+3] = 0
          continue
        }

        let d = shifted / (1 - thresh)
        d = d * d * (3 - 2 * d)
        d = Math.pow(d, 1 / DENSITY_CONTRAST)

        const a = (d * vm * MAX_ALPHA * 255 + 0.5) | 0
        px[idx]   = FOG_R
        px[idx+1] = FOG_G
        px[idx+2] = FOG_B
        px[idx+3] = a
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
