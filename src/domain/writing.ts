import { wordById } from '@/data/words.sample'
import type { WritingArticle } from '@/data/articles.sample'

export type WritingMode = 'en-to-zh' | 'zh-to-en'

export interface SentenceFeedback {
  index: number
  source: string
  user: string
  reference: string
  issues: string[]
  score: number
}

export interface TargetFeedback {
  word: string
  used: boolean
  detail: string
}

export interface WritingResult {
  score: number
  targetCoverage: TargetFeedback[]
  sentences: SentenceFeedback[]
  summary: string
  dimensions: {
    target: number
    completeness: number
    form: number
    expression: number
  }
}

export interface WritingInput {
  article: WritingArticle
  mode: WritingMode
  inputs: string[]
}

function targetMeaning(word: string, article?: WritingArticle): string[] {
  const explicit = article?.targetMeanings?.[word]
  const entry = explicit ? { meaning: explicit } : wordById.get(word)
  if (!entry) return []
  const segments = new Set<string>()
  for (const part of entry.meaning.split(/[；;，,]/)) {
    const clean = part.replace(/^[a-z]+\.\s*/i, '').trim()
    if (clean.length >= 2) {
      segments.add(clean)
      if (clean.endsWith('的')) segments.add(clean.slice(0, -1))
    }
  }
  return [...segments]
}

function hasTarget(
  word: string,
  text: string,
  mode: WritingMode,
  article?: WritingArticle,
): boolean {
  if (!text.trim()) return false
  if (mode === 'en-to-zh') {
    const segments = targetMeaning(word, article)
    if (segments.length === 0) return text.includes(word)
    return segments.some((segment) => text.includes(segment))
  }
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}(s|es|ed|d|ing)?\\b`, 'i').test(text)
}

function countChinese(text: string) {
  return (text.match(/[\u4e00-\u9fff]/g) ?? []).length
}

function countEnglishWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function evaluateWriting({ article, mode, inputs }: WritingInput): WritingResult {
  const sentences: SentenceFeedback[] = []
  const targetUsed = new Map<string, boolean>()
  article.targetWords.forEach((word) => targetUsed.set(word, false))

  article.sentences.forEach((sentence, index) => {
    const source = mode === 'en-to-zh' ? sentence.en : sentence.zh
    const reference = mode === 'en-to-zh' ? sentence.zh : sentence.en
    const user = (inputs[index] ?? '').trim()
    const issues: string[] = []

    if (!user) {
      issues.push('这一句还没写')
    } else {
      if (mode === 'en-to-zh') {
        if (countChinese(user) < 10) issues.push('译文太短，可能漏了信息')
        if (!/[。！？]$/.test(user)) issues.push('中文句末用句号、问号或感叹号')
      } else {
        if (countEnglishWords(user) < 6) issues.push('英文太短，可能没译完整')
        if (!/[.!?]$/.test(user)) issues.push('英文句末加标点')
        if (!/^[A-Z]/.test(user)) issues.push('句首字母要大写')
      }

      for (const target of sentence.targets) {
        const used = hasTarget(target, user, mode, article)
        if (used) targetUsed.set(target, true)
        else {
          issues.push(
            mode === 'en-to-zh'
              ? `目标词 ${target} 的意思没出现`
              : `目标词 ${target} 没用上`,
          )
        }
      }
    }

    let sentenceScore = 100
    if (!user) sentenceScore = 0
    else {
      if (mode === 'en-to-zh' && countChinese(user) < 10) sentenceScore -= 25
      if (mode === 'zh-to-en' && countEnglishWords(user) < 6) sentenceScore -= 25
      const targetMisses = sentence.targets.filter(
        (target) => !hasTarget(target, user, mode, article),
      ).length
      sentenceScore -= targetMisses * 25
      if (mode === 'en-to-zh' && !/[。！？]$/.test(user)) sentenceScore -= 10
      if (mode === 'zh-to-en' && !/[.!?]$/.test(user)) sentenceScore -= 10
      if (mode === 'zh-to-en' && !/^[A-Z]/.test(user)) sentenceScore -= 10
    }

    sentences.push({
      index,
      source,
      user,
      reference,
      issues,
      score: Math.max(0, Math.min(100, sentenceScore)),
    })
  })

  const coverage = [...targetUsed.values()].filter(Boolean).length
  const coverageRatio = article.targetWords.length ? coverage / article.targetWords.length : 1
  const nonEmpty = sentences.filter((sentence) => sentence.user.length > 0).length
  const completenessRatio = sentences.length ? nonEmpty / sentences.length : 1
  const formPass = sentences.filter(
    (sentence) =>
      sentence.user.length > 0 &&
      (mode === 'en-to-zh'
        ? /[。！？]$/.test(sentence.user)
        : /[.!?]$/.test(sentence.user) && /^[A-Z]/.test(sentence.user)),
  ).length
  const formRatio = sentences.length ? formPass / sentences.length : 1
  const expressionRatio =
    sentences.length
      ? sentences.reduce((sum, sentence) => sum + sentence.score, 0) /
        sentences.length /
        100
      : 0

  const dimensions =
    mode === 'en-to-zh'
      ? {
          target: Math.round(40 * coverageRatio),
          completeness: Math.round(30 * completenessRatio),
          form: Math.round(20 * formRatio),
          expression: Math.round(10 * expressionRatio),
        }
      : {
          target: Math.round(30 * coverageRatio),
          completeness: Math.round(30 * completenessRatio),
          form: Math.round(20 * formRatio),
          expression: Math.round(20 * expressionRatio),
        }

  const score = dimensions.target + dimensions.completeness + dimensions.form + dimensions.expression
  const missing = article.targetWords.filter((word) => !targetUsed.get(word))
  const issueCount = sentences.reduce((sum, sentence) => sum + sentence.issues.length, 0)

  let summary = ''
  if (score >= 85) summary = '目标词覆盖和句子完整度都很好，接下来可以把表达再收紧一点。'
  else if (score >= 60) summary = '基本完成了，主要问题是个别目标词和句子完整度。'
  else summary = '先保证每句都写完、目标词都用上，再谈表达。'

  if (missing.length) summary += ` 没用上的目标词：${missing.join('、')}。`
  if (issueCount) summary += ` 共 ${issueCount} 处可改进。`

  return {
    score,
    targetCoverage: article.targetWords.map((word) => ({
      word,
      used: Boolean(targetUsed.get(word)),
      detail: targetMeaning(word, article).join(' / ') || word,
    })),
    sentences,
    summary,
    dimensions,
  }
}
