import { describe, expect, it } from 'vitest'
import { evaluatePlacement, placementQuestions } from './placement'

describe('vocabulary placement', () => {
  it('estimates a basic level for few correct answers', () => {
    const result = evaluatePlacement(
      placementQuestions.map((question) => (question.answer + 1) % 4),
    )
    expect(result.score).toBe(0)
    expect(result.level).toBe('basic')
    expect(result.estimated).toBe(1200)
  })

  it('estimates an advanced level for a high score', () => {
    const answers = placementQuestions.map((question) => question.answer)
    const result = evaluatePlacement(answers)
    expect(result.score).toBe(12)
    expect(result.level).toBe('advanced')
    expect(result.estimated).toBe(6000)
  })
})
