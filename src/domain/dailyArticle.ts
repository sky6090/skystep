import type { WritingArticle } from '@/data/articles.sample'
import { sampleArticles } from '@/data/articles.sample'
import type { WordEntry } from '@/data/words.sample'

function pickSentence(word: WordEntry, offset: number) {
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
  return {
    en: `The word ${word.word} means ${word.meaning}. I met it again today, and it made me pause.`,
    zh: `“${word.word}”的意思是${word.meaning}。今天我又遇到了它，它让我停了一下。`,
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
): WritingArticle | null {
  const unique = words.filter(
    (word, index, all) =>
      all.findIndex((candidate) => candidate.id === word.id) === index,
  )
  if (unique.length < 1) return null

  const sentences = unique.map((word, index) => {
    const sentence = pickSentence(word, index + dateKey.length)
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
