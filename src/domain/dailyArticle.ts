import type { WritingArticle } from '@/data/articles.sample'
import { sampleArticles } from '@/data/articles.sample'
import type { WordEntry } from '@/data/words.sample'

function cleanDefinition(definition: string) {
  return definition
    .replace(/\b(?:n|v|a|adj|adv|vt|vi|prep|pron|conj)\.\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function pickSentence(
  word: WordEntry,
  offset: number,
  definitions?: Map<string, string>,
) {
  const candidates = sampleArticles.flatMap((article) =>
    article.sentences.filter((sentence) => sentence.targets.includes(word.id)),
  )
  if (candidates.length) {
    return candidates[offset % candidates.length]
  }
  if (word.example) {
    return {
      en: word.example,
      zh: word.exampleZh,
      targets: [word.id],
    }
  }
  const definition = definitions?.get(word.id)
  if (definition) {
    const cleaned = cleanDefinition(definition)
    if (cleaned) {
      return {
        en: `The word "${word.word}" can mean: ${cleaned}.`,
        zh: `“${word.word}”可以表示${word.meaning}。`,
        targets: [word.id],
      }
    }
  }
  return {
    en: `The word "${word.word}" came up in today's reading, and the surrounding sentence gives it meaning.`,
    zh: `今天的阅读里出现了“${word.word}”这个词，它的意思要结合上下文来看。`,
    targets: [word.id],
  }
}

function withWordHint(text: string, word: string, chinese: boolean) {
  const trimmed = text.trim()
  return chinese ? `${trimmed}（${word}）` : `${trimmed} (${word})`
}

export function buildDailyArticle(
  words: WordEntry[],
  dateKey: string,
  definitions?: Map<string, string>,
): WritingArticle | null {
  const unique = words.filter(
    (word, index, all) =>
      all.findIndex((candidate) => candidate.id === word.id) === index,
  )
  if (unique.length < 1) return null

  const sentences = unique.map((word, index) => {
    const sentence = pickSentence(word, index + dateKey.length, definitions)
    return {
      en: withWordHint(sentence.en || word.example, word.word, false),
      zh: withWordHint(sentence.zh || word.exampleZh, word.word, true),
      targets: [word.id],
    }
  })

  return {
    id: `daily-${dateKey}-${unique.map((word) => word.id).join('-')}`,
    title: '今日错词 / 收藏练习',
    theme: '错词与收藏',
    targetWords: unique.map((word) => word.id),
    targetMeanings: Object.fromEntries(
      unique.map((word) => [word.id, word.meaning]),
    ),
    generated: true,
    sentences,
  }
}
