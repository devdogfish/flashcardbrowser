export interface ModerationResult {
  approved: boolean;
  reason?: string;
}

/**
 * Placeholder AI moderation check.
 * Always approves — replace with real AI integration later.
 */
export async function checkSuggestion(
  _question: string | null | undefined,
  _answer: string | null | undefined,
): Promise<ModerationResult> {
  return { approved: true };
}
