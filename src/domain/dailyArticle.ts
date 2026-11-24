import type { WritingArticle } from '@/data/articles.sample'
import { sampleArticles } from '@/data/articles.sample'
import type { WordEntry } from '@/data/words.sample'

const INTRO = {
  en: 'Today I went back to a few words that had slipped away.',
  zh: '今天，我重新看了一些已经淡忘的词。',
  targets: [] as string[],
}

const OUTRO = {
  en: 'None of them is hard alone; the work is to keep them close.',
  zh: '它们单独看都不难；难的是让它们一直留在身边。',
  targets: [] as string[],
}

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

export function buildDailyArticle(
  words: WordEntry[],
  dateKey: string,
): WritingArticle | null {
  const unique = words.filter(
    (word, index, all) =>
      all.findIndex((candidate) => candidate.id === word.id) === index,
  )
  if (unique.length < 1) return null

  const selected = unique.slice(0, 8)
  const sentences = selected.map((word, index) => {
    const sentence = pickSentence(word, index + dateKey.length)
    return {
      en: sentence.en,
      zh: sentence.zh,
      targets: [word.id],
    }
  })

  return {
    id: `daily-${dateKey}-${selected.map((word) => word.id).join('-')}`,
    title: '今日错词短文',
    theme: '错词重组',
    targetWords: selected.map((word) => word.id),
    targetMeanings: Object.fromEntries(
      selected.map((word) => [word.id, word.meaning]),
    ),
    generated: true,
    sentences: [INTRO, ...sentences, OUTRO],
  }
}
