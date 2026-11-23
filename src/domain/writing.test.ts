import { describe, expect, it } from 'vitest'
import { sampleArticles } from '@/data/articles.sample'
import { evaluateWriting } from './writing'

const article = sampleArticles[0]

describe('rule-based writing evaluation', () => {
  it('ships seventy bilingual articles', () => {
    expect(sampleArticles).toHaveLength(70)
  })

  it('keeps every sample article usable in both directions', () => {
    for (const sample of sampleArticles) {
      const enToZh = evaluateWriting({
        article: sample,
        mode: 'en-to-zh',
        inputs: sample.sentences.map((sentence) => sentence.zh),
      })
      const missingChinese = enToZh.targetCoverage.filter((item) => !item.used)
      expect(missingChinese, `${sample.id} en-to-zh missing`).toEqual([])

      const zhToEn = evaluateWriting({
        article: sample,
        mode: 'zh-to-en',
        inputs: sample.sentences.map((sentence) => sentence.en),
      })
      const missingEnglish = zhToEn.targetCoverage.filter((item) => !item.used)
      expect(missingEnglish, `${sample.id} zh-to-en missing`).toEqual([])
    }
  })

  it('scores the reference Chinese translation highly', () => {
    const result = evaluateWriting({
      article,
      mode: 'en-to-zh',
      inputs: article.sentences.map((sentence) => sentence.zh),
    })
    expect(result.score).toBeGreaterThanOrEqual(85)
    expect(result.targetCoverage.every((item) => item.used)).toBe(true)
    expect(result.sentences.every((sentence) => sentence.issues.length === 0)).toBe(true)
  })

  it('scores the reference English translation highly', () => {
    const result = evaluateWriting({
      article,
      mode: 'zh-to-en',
      inputs: article.sentences.map((sentence) => sentence.en),
    })
    expect(result.score).toBeGreaterThanOrEqual(85)
    expect(result.targetCoverage.every((item) => item.used)).toBe(true)
  })

  it('gives zero for empty input', () => {
    const result = evaluateWriting({
      article,
      mode: 'en-to-zh',
      inputs: article.sentences.map(() => ''),
    })
    expect(result.score).toBe(0)
    expect(result.targetCoverage.some((item) => item.used)).toBe(false)
  })

  it('penalizes missing target words', () => {
    const result = evaluateWriting({
      article,
      mode: 'en-to-zh',
      inputs: article.sentences.map(() => '这是一句没有目标词的翻译。'),
    })
    expect(result.dimensions.target).toBeLessThan(40)
    expect(result.score).toBeLessThan(100)
  })
})
