// FSRS-4.5 implementation
// Reference: https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm

export type Grade = 1 | 2 | 3 | 4 // 1=Forgot, 2=Hard, 3=Good, 4=Easy

// Default FSRS-4.5 weights
const W = [
  0.4072,  // w0:  initial S for Forgot
  1.1829,  // w1:  initial S for Hard
  3.1262,  // w2:  initial S for Good
  15.4722, // w3:  initial S for Easy
  7.2102,  // w4:  D_0 base
  0.5316,  // w5:  D_0 decay
  1.0651,  // w6:  difficulty delta scale
  0.0589,  // w7:  mean reversion weight
  1.533,   // w8:  S'_r exp term
  0.1544,  // w9:  S'_r S exponent
  1.0038,  // w10: S'_r R term
  1.9395,  // w11: S'_f scale
  0.11,    // w12: S'_f D exponent
  0.29,    // w13: S'_f S exponent
  2.27,    // w14: S'_f R term
  0.25,    // w15: hard penalty
  2.9898,  // w16: easy bonus
]

const DECAY = -0.5
const FACTOR = 19 / 81

function clamp(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, x))
}

// Retention after t days given stability S
function retrievability(t: number, S: number): number {
  return Math.pow(1 + FACTOR * (t / S), DECAY)
}

// Days interval to reach desiredRetention given stability S
// With desiredRetention=0.9 this equals S (by definition of stability)
export function nextInterval(S: number, desiredRetention = 0.9): number {
  const t = (S / FACTOR) * (Math.pow(desiredRetention, 1 / DECAY) - 1)
  return Math.max(1, Math.round(t))
}

function initialStability(grade: Grade): number {
  return W[grade - 1]
}

function initialDifficulty(grade: Grade): number {
  return clamp(W[4] - Math.exp(W[5] * (grade - 1)) + 1, 1, 10)
}

// D_0(4): difficulty baseline for mean reversion
const D0_4 = W[4] - Math.exp(W[5] * 3) + 1

function nextDifficulty(D: number, grade: Grade): number {
  const D_prime = D - W[6] * (grade - 3)
  return clamp(W[7] * D0_4 + (1 - W[7]) * D_prime, 1, 10)
}

function nextStabilityRecall(D: number, S: number, R: number, grade: Grade): number {
  const hardPenalty = grade === 2 ? W[15] : 1
  const easyBonus = grade === 4 ? W[16] : 1
  return (
    S *
    (Math.exp(W[8]) *
      (11 - D) *
      Math.pow(S, -W[9]) *
      (Math.exp(W[10] * (1 - R)) - 1) *
      hardPenalty *
      easyBonus +
      1)
  )
}

function nextStabilityForget(D: number, S: number, R: number): number {
  return (
    W[11] *
    Math.pow(D, -W[12]) *
    (Math.pow(S + 1, W[13]) - 1) *
    Math.exp(W[14] * (1 - R))
  )
}

export interface ScheduleResult {
  stability: number
  difficulty: number
  interval: number
}

export function schedule(
  grade: Grade,
  stability: number | null,
  difficulty: number | null,
  daysSinceReview: number,
  desiredRetention = 0.9,
): ScheduleResult {
  if (stability === null || difficulty === null) {
    const S = initialStability(grade)
    const D = initialDifficulty(grade)
    const ivl = grade === 1 ? 1 : nextInterval(S, desiredRetention)
    return { stability: S, difficulty: D, interval: ivl }
  }

  const t = Math.max(0, daysSinceReview)
  const R = retrievability(t, stability)
  const newD = nextDifficulty(difficulty, grade)

  if (grade === 1) {
    const newS = nextStabilityForget(difficulty, stability, R)
    return { stability: newS, difficulty: newD, interval: 1 }
  }

  const newS = nextStabilityRecall(difficulty, stability, R, grade)
  return { stability: newS, difficulty: newD, interval: nextInterval(newS, desiredRetention) }
}

// Returns [forgot, hard, good, easy] projected intervals for the 4 grades
export function previewIntervals(
  stability: number | null,
  difficulty: number | null,
  daysSinceReview: number,
  desiredRetention = 0.9,
): [number, number, number, number] {
  return [1, 2, 3, 4].map((g) =>
    schedule(g as Grade, stability, difficulty, daysSinceReview, desiredRetention).interval,
  ) as [number, number, number, number]
}
