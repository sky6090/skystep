export type QuizStage = 1 | 2 | 3

export const QUIZ_REVIEW_DAYS: Record<QuizStage, number> = {
  1: 1,
  2: 3,
  3: 7,
}

export function nextQuizStage(stage: QuizStage): QuizStage | null {
  if (stage === 1) return 2
  if (stage === 2) return 3
  return null
}

export function quizDueAt(stage: QuizStage, now: number): number {
  return now + QUIZ_REVIEW_DAYS[stage] * 86_400_000
}
