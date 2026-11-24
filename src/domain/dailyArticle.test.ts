import { describe, expect, it } from 'vitest'
import { sampleWords } from '@/data/words.sample'
import { evaluateWriting } from '@/domain/writing'
import { buildDailyArticle } from './dailyArticle'

describe('daily wrong-word article', () => {
  it('builds a passage from selected words', () => {
    const article = buildDailyArticle(sampleWords.slice(0, 6), '2026-11-24')
    expect(article).not.toBeNull()
    expect(article?.targetWords).toHaveLength(6)
    expect(article?.sentences).toHaveLength(8)
    expect(article?.generated).toBe(true)
    expect(article?.targetMeanings?.advocate).toContain('提倡')
  })

  it('scores the reference Chinese translation', () => {
    const article = buildDailyArticle(sampleWords.slice(0, 5), '2026-11-24')
    expect(article).not.toBeNull()
    if (!article) return
    const result = evaluateWriting({
      article,
      mode: 'en-to-zh',
      inputs: article.sentences.map((sentence) => sentence.zh),
    })
    expect(result.targetCoverage.every((item) => item.used)).toBe(true)
    expect(result.dimensions.target).toBe(40)
  })

  it('returns null when there are no words', () => {
    expect(buildDailyArticle([], '2026-11-24')).toBeNull()
  })
})
