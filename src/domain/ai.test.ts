import { describe, expect, it } from 'vitest'
import { sampleArticles } from '@/data/articles.sample'
import { evaluateWriting } from '@/domain/writing'
import { AIError, buildAIPrompt, normalizeAIResult } from './ai'

const article = sampleArticles[0]
const fallback = evaluateWriting({
  article,
  mode: 'en-to-zh',
  inputs: article.sentences.map((sentence) => sentence.zh),
})

describe('AI result normalization', () => {
  it('builds a prompt that names the target words and mode', () => {
    const prompt = buildAIPrompt({
      article,
      mode: 'en-to-zh',
      inputs: article.sentences.map((sentence) => sentence.zh),
      fallback,
    })
    expect(prompt.system).toContain('JSON')
    expect(prompt.user).toContain('advocate')
    expect(prompt.user).toContain('英译中')
  })

  it('clamps scores and keeps sentence references', () => {
    const result = normalizeAIResult(
      {
        score: 180,
        dimensions: { target: 99, completeness: -4, form: 20, expression: 7 },
        targetCoverage: [{ word: 'advocate', used: true, detail: '提倡' }],
        sentences: [{ index: 0, issues: ['时态可以更准确'], score: 130 }],
        summary: '表达基本清楚。',
      },
      {
        article,
        mode: 'en-to-zh',
        inputs: article.sentences.map((sentence) => sentence.zh),
        fallback,
      },
    )
    expect(result.score).toBe(100)
    expect(result.dimensions.target).toBe(40)
    expect(result.dimensions.completeness).toBe(0)
    expect(result.sentences[0].reference).toBe(article.sentences[0].zh)
    expect(result.sentences[0].score).toBe(100)
  })

  it('rejects a non-object response', () => {
    expect(() =>
      normalizeAIResult('not json', {
        article,
        mode: 'en-to-zh',
        inputs: article.sentences.map((sentence) => sentence.zh),
        fallback,
      }),
    ).toThrow(AIError)
  })
})
