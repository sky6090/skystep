import { describe, expect, it } from 'vitest'
import { sampleWords } from '@/data/words.sample'
import { evaluateWriting } from '@/domain/writing'
import { buildDailyArticle } from './dailyArticle'

describe('daily wrong-word article', () => {
  it('builds one sentence per word with a word hint', () => {
    const article = buildDailyArticle(sampleWords.slice(0, 6), '2026-11-24')
    expect(article).not.toBeNull()
    expect(article?.targetWords).toHaveLength(6)
    expect(article?.sentences).toHaveLength(6)
    expect(article?.generated).toBe(true)
    expect(article?.targetMeanings?.advocate).toContain('提倡')
    expect(article?.sentences[0].en).toContain('(advocate)')
    expect(article?.sentences[0].zh).toContain('（advocate）')
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

  it('supports a dictionary word without an example sentence', () => {
    const article = buildDailyArticle(
      [
        {
          id: 'abandon',
          word: 'abandon',
          phonetic: '/əˈbændən/',
          pos: 'v.',
          meaning: '放弃',
          example: '',
          exampleZh: '',
          tags: ['CET-6'],
        },
      ],
      '2026-11-24',
      new Map([['abandon', 'v. give up completely']]),
    )
    expect(article?.targetWords).toEqual(['abandon'])
    if (!article) return
    expect(article.sentences[0].en).toContain('can mean: give up completely')
    expect(article.sentences[0].en).not.toContain('放弃')
    const result = evaluateWriting({
      article,
      mode: 'en-to-zh',
      inputs: article.sentences.map((sentence) => sentence.zh),
    })
    expect(result.targetCoverage[0].used).toBe(true)
  })

  it('returns null when there are no words', () => {
    expect(buildDailyArticle([], '2026-11-24')).toBeNull()
  })
})
