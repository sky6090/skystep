import { describe, expect, it } from 'vitest'
import {
  createPlacementQuestions,
  evaluatePlacement,
  placementQuestions,
} from './placement'

describe('vocabulary placement', () => {
  it('creates twelve fresh questions with four options each', () => {
    const questions = createPlacementQuestions(12)
    expect(questions).toHaveLength(12)
    expect(new Set(questions.map((question) => question.word)).size).toBe(12)
    for (const question of questions) {
      expect(question.options).toHaveLength(4)
      expect(question.options[question.answer]).toBeTruthy()
    }
  })

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

  it('treats an unknown answer as incorrect', () => {
    const result = evaluatePlacement(placementQuestions.map(() => -1))
    expect(result.score).toBe(0)
    expect(result.level).toBe('basic')
  })
})
