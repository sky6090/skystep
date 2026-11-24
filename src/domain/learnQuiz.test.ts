import { describe, expect, it } from 'vitest'
import { sampleWords } from '@/data/words.sample'
import { buildQuizOptions, formatMeaningOption } from './learnQuiz'

describe('learn quiz options', () => {
  it('builds four unique Chinese options', () => {
    const current = sampleWords[0]
    const quiz = buildQuizOptions(current, 0, sampleWords)
    expect(quiz.options).toHaveLength(4)
    expect(new Set(quiz.options).size).toBe(4)
    expect(quiz.options).toContain(quiz.answer)
    expect(quiz.answer).toBe('v. 提倡；拥护')
  })

  it('adds part of speech and keeps high-frequency senses', () => {
    const current = {
      ...sampleWords[0],
      pos: 'vt./vi.',
      meaning: '提倡, 拥护；[计] 主张',
    }
    expect(buildQuizOptions(current, 0, sampleWords).answer).toBe('v. 提倡；拥护')
  })

  it('does not drop the leading noun or leave inline POS in the meaning', () => {
    const kidney = { ...sampleWords[0], pos: 'n.', meaning: '肾, 个性；[医] 肾' }
    const suck = {
      ...sampleWords[0],
      pos: 'vt.',
      meaning: '吸, 吮, 吸入；vi. 吸, 吸奶',
    }
    expect(formatMeaningOption(kidney)).toBe('n. 肾；个性')
    expect(formatMeaningOption(suck)).toBe('v. 吸；吮')
  })

  it('builds four unique English options', () => {
    const current = sampleWords[1]
    const quiz = buildQuizOptions(current, 1, sampleWords)
    expect(quiz.options).toHaveLength(4)
    expect(new Set(quiz.options).size).toBe(4)
    expect(quiz.options).toContain(current.word)
  })
})
