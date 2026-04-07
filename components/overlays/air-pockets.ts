// --- Air Pocket Entity System ---
// Each pocket is a discrete drifting entity with an organic elliptical shape.
// It carries a short-range force field that repels all fog from its body.
// Target: 2–4 pockets on screen at once; new ones drift in from screen edges.

const POCKET_COUNT_MIN   = 2
const POCKET_COUNT_MAX   = 4
const POCKET_R_MIN       = 10    // block-px semi-minor axis lower bound
const POCKET_R_MAX       = 20    // block-px semi-major axis upper bound
const POCKET_SPEED_MIN   = 0.05  // block-px / frame
const POCKET_SPEED_MAX   = 0.13
const POCKET_FORCE_RANGE = 3.0   // force field reaches this many body-radii beyond surface
const POCKET_BODY_BOOST  = 0.70  // max threshold boost at pocket centre

type AirPocket = {
  cx: number; cy: number   // centre (block pixels)
  vx: number; vy: number   // velocity (block pixels / frame)
  rx: number; ry: number   // ellipse semi-axes (rx > ry — always oval)
  angle: number            // ellipse rotation (radians)
  h1f: number; h1p: number; h1a: number  // angular harmonic 1: freq, phase, amplitude
  h2f: number; h2p: number; h2a: number  // angular harmonic 2
  h3f: number; h3p: number; h3a: number  // angular harmonic 3
}

function makePocket(bw: number, bh: number, onScreen: boolean): AirPocket {
  // Semi-major axis; aspect ratio ensures it's always noticeably oval, never circular
  const rMajor = POCKET_R_MIN + Math.random() * (POCKET_R_MAX - POCKET_R_MIN)
  const aspect = 0.40 + Math.random() * 0.44  // 0.40–0.84
  const rx = rMajor
  const ry = rMajor * aspect
  const angle = Math.random() * Math.PI

  // Mostly drift rightward, occasionally leftward; fog moves at ~0.42 bpx/frame
  const speed = POCKET_SPEED_MIN + Math.random() * (POCKET_SPEED_MAX - POCKET_SPEED_MIN)
  const vx    = speed * (Math.random() < 0.15 ? -1 : 1)
  const vy    = (Math.random() - 0.5) * 0.05

  const margin = rMajor * 3
  let cx: number, cy: number
  if (onScreen) {
    cx = margin + Math.random() * (bw - margin * 2)
    cy = bh * (0.15 + Math.random() * 0.70)
  } else {
    cx = vx > 0 ? -margin : bw + margin
    cy = bh * (0.15 + Math.random() * 0.70)
  }

  return {
    cx, cy, vx, vy, rx, ry, angle,
    // Harmonics at freq 2, 3, 5 give a rounded-but-lumpy blob
    h1f: 2, h1p: Math.random() * Math.PI * 2, h1a: 0.10 + Math.random() * 0.14,
    h2f: 3, h2p: Math.random() * Math.PI * 2, h2a: 0.05 + Math.random() * 0.08,
    h3f: 5, h3p: Math.random() * Math.PI * 2, h3a: 0.02 + Math.random() * 0.04,
  }
}

// Normalised signed distance from (bx, by) to the pocket surface.
// ≈ -1 at centre, 0 on surface, > 0 outside.
function pocketDist(p: AirPocket, bx: number, by: number): number {
  const dx   = bx - p.cx
  const dy   = by - p.cy
  const cosA = Math.cos(p.angle)
  const sinA = Math.sin(p.angle)
  const lx   = dx * cosA + dy * sinA
  const ly   = -dx * sinA + dy * cosA
  const ed   = Math.sqrt((lx / p.rx) * (lx / p.rx) + (ly / p.ry) * (ly / p.ry))
  if (ed === 0) return -1
  const theta   = Math.atan2(ly, lx)
  const perturb = 1
    + p.h1a * Math.sin(p.h1f * theta + p.h1p)
    + p.h2a * Math.sin(p.h2f * theta + p.h2p)
    + p.h3a * Math.sin(p.h3f * theta + p.h3p)
  return ed / Math.max(perturb, 0.2) - 1
}

export interface AirPocketSystem {
  /** Advance all pockets by one frame (move, bounce, spawn, cull). */
  update(): void
  /**
   * Returns the fog-threshold boost this system contributes at block pixel (bx, by).
   * Add this value to your running `thresh` before computing fog density.
   */
  threshBoost(bx: number, by: number): number
}

/** Initialise the pocket pool and return the per-frame API. */
export function createAirPocketSystem(bw: number, bh: number): AirPocketSystem {
  const pockets: AirPocket[] = []
  const initCount = POCKET_COUNT_MIN + Math.floor(Math.random() * (POCKET_COUNT_MAX - POCKET_COUNT_MIN + 1))
  for (let i = 0; i < initCount; i++) pockets.push(makePocket(bw, bh, true))

  const exitMargin = POCKET_R_MAX * 4

  return {
    update() {
      for (let i = pockets.length - 1; i >= 0; i--) {
        const p = pockets[i]
        p.cx += p.vx
        p.cy += p.vy
        // Soft vertical bounce to keep pockets within the fog band
        if (p.cy < bh * 0.12 || p.cy > bh * 0.88) p.vy *= -1
        if (p.cx < -exitMargin || p.cx > bw + exitMargin) pockets.splice(i, 1)
      }
      // Maintain at least MIN; occasionally add up to MAX
      if (pockets.length < POCKET_COUNT_MIN) {
        pockets.push(makePocket(bw, bh, false))
      } else if (pockets.length < POCKET_COUNT_MAX && Math.random() < 0.003) {
        pockets.push(makePocket(bw, bh, false))
      }
    },

    threshBoost(bx: number, by: number): number {
      let boost = 0
      const span = POCKET_FORCE_RANGE + 1  // centre is at dist ≈ -1
      for (const p of pockets) {
        const dist = pocketDist(p, bx, by)
        if (dist < POCKET_FORCE_RANGE) {
          const t = Math.max(0, (POCKET_FORCE_RANGE - dist) / span)
          boost += t * t * (3 - 2 * t) * POCKET_BODY_BOOST
        }
      }
      return boost
    },
  }
}
