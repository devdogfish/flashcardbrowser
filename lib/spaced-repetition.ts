export function computeStreak(usages: { reviewedAt: Date }[]): number {
  if (usages.length === 0) return 0

  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const daySet = new Set(
    usages.map((u) => {
      const d = new Date(u.reviewedAt)
      d.setUTCHours(0, 0, 0, 0)
      return d.getTime()
    }),
  )

  let streak = 0
  let check = today.getTime()

  // If no review today, start streak check from yesterday
  if (!daySet.has(check)) check -= 86_400_000

  while (daySet.has(check)) {
    streak++
    check -= 86_400_000
  }

  return streak
}
