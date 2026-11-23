import { describe, expect, it } from 'vitest'
import { QUIZ_REVIEW_DAYS, nextQuizStage, quizDueAt } from './quizSchedule'

describe('quiz review schedule', () => {
  it('follows 1 / 3 / 7 days', () => {
    expect(QUIZ_REVIEW_DAYS[1]).toBe(1)
    expect(QUIZ_REVIEW_DAYS[2]).toBe(3)
    expect(QUIZ_REVIEW_DAYS[3]).toBe(7)
  })

  it('advances stages and graduates after stage 3', () => {
    expect(nextQuizStage(1)).toBe(2)
    expect(nextQuizStage(2)).toBe(3)
    expect(nextQuizStage(3)).toBeNull()
  })

  it('computes the next due time', () => {
    const now = 1_000_000
    expect(quizDueAt(1, now)).toBe(now + 86_400_000)
    expect(quizDueAt(3, now)).toBe(now + 7 * 86_400_000)
  })
})
