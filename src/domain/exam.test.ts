import { describe, expect, it } from 'vitest'
import { readingQuestions, readingSection } from '@/data/questions.sample'
import { buildPracticeSet, formatTime, scoreQuestions } from './exam'

describe('exam scoring', () => {
  it('scores a perfect reading section', () => {
    const answers = Object.fromEntries(
      readingQuestions.map((question) => [question.id, question.answer]),
    )
    const result = scoreQuestions(readingQuestions, answers)
    expect(result.correct).toBe(30)
    expect(result.score).toBe(100)
    expect(result.readingScore).toBe(248.5)
    expect(result.wrong).toHaveLength(0)
    expect(result.byType['banked-cloze'].correct).toBe(10)
    expect(result.byType.matching.correct).toBe(10)
    expect(result.byType['careful-reading'].correct).toBe(10)
  })

  it('collects wrong questions and reduces the score', () => {
    const answers = Object.fromEntries(
      readingQuestions.map((question) => [question.id, question.answer]),
    )
    const first = readingQuestions[0]
    answers[first.id] = 'wrong'
    const result = scoreQuestions(readingQuestions, answers)
    expect(result.correct).toBe(29)
    expect(result.wrong).toHaveLength(1)
    expect(result.wrong[0].id).toBe(first.id)
  })

  it('builds a mixed 10-question practice set', () => {
    const set = buildPracticeSet(readingQuestions, 10)
    expect(set).toHaveLength(10)
    expect(set.some((question) => question.type === 'banked-cloze')).toBe(true)
    expect(set.some((question) => question.type === 'matching')).toBe(true)
    expect(set.some((question) => question.type === 'careful-reading')).toBe(true)
  })

  it('formats a countdown', () => {
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(65)).toBe('01:05')
    expect(formatTime(2400)).toBe('40:00')
  })

  it('has a 40-minute reading section', () => {
    expect(readingSection.durationMin).toBe(40)
    expect(readingSection.questions).toHaveLength(30)
  })
})
