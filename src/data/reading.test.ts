import { describe, expect, it } from 'vitest'
import { allReadingQuestions, passageById, readingSections } from './reading'

describe('reading content', () => {
  it('ships three complete 30-question sets', () => {
    expect(readingSections).toHaveLength(3)
    expect(readingSections[0].questions).toHaveLength(30)
    expect(readingSections[1].questions).toHaveLength(30)
    expect(readingSections[2].questions).toHaveLength(30)
  })

  it('has unique question ids and valid passages', () => {
    const ids = new Set(allReadingQuestions.map((question) => question.id))
    expect(ids.size).toBe(allReadingQuestions.length)
    for (const question of allReadingQuestions) {
      expect(passageById.has(question.passageId), question.id).toBe(true)
    }
  })

  it('has an answer for every question', () => {
    for (const question of allReadingQuestions) {
      if (question.type === 'careful-reading') {
        const index = question.answer.charCodeAt(0) - 65
        expect(question.options[index], question.id).toBeTruthy()
      } else {
        expect(question.options, question.id).toContain(question.answer)
      }
    }
  })
})
