import { describe, expect, it } from 'vitest'
import type { WordEntry } from './words.sample'
import {
  createPlacementQuestions,
  createPlacementQuestionsFromPool,
  evaluatePlacement,
  placementQuestions,
} from './placement'

describe('vocabulary placement', () => {
  it('creates fifteen fresh questions with four options each', () => {
    const questions = createPlacementQuestions(15)
    expect(questions).toHaveLength(15)
    expect(new Set(questions.map((question) => question.word)).size).toBe(15)
    for (const question of questions) {
      expect(question.options).toHaveLength(4)
      expect(question.options[question.answer]).toBeTruthy()
    }
  })

  it('picks five easy, five medium, and five hard words in order', () => {
    const pool: WordEntry[] = Array.from({ length: 30 }, (_, index) => ({
      id: `w${index + 1}`,
      word: `w${index + 1}`,
      phonetic: '',
      pos: 'n.',
      meaning: `义${index + 1}`,
      example: '',
      exampleZh: '',
      tags: ['CET-6'],
      rank: index + 1,
    }))
    const questions = createPlacementQuestionsFromPool(pool, 15)
    const ranks = questions.map((question) => Number(question.word.slice(1)))
    expect(ranks.slice(0, 5).every((rank) => rank <= 10)).toBe(true)
    expect(ranks.slice(5, 10).every((rank) => rank > 10 && rank <= 20)).toBe(true)
    expect(ranks.slice(10).every((rank) => rank > 20)).toBe(true)
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
    expect(result.score).toBe(15)
    expect(result.level).toBe('advanced')
    expect(result.estimated).toBe(6450)
  })

  it('treats an unknown answer as incorrect', () => {
    const result = evaluatePlacement(placementQuestions.map(() => -1))
    expect(result.score).toBe(0)
    expect(result.level).toBe('basic')
  })
})
