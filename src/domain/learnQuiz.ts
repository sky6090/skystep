import type { WordEntry } from '@/data/words.sample'

export type QuizPhase = 0 | 1

export interface QuizOptions {
  options: string[]
  answer: string
}

function hash(seed: string): number {
  let value = 2166136261
  for (const char of seed) {
    value ^= char.charCodeAt(0)
    value = Math.imul(value, 16777619)
  }
  return value >>> 0
}

function shuffled<T>(items: T[], seed: string): T[] {
  const list = [...items]
  let state = hash(seed) || 1
  for (let index = list.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const target = state % (index + 1)
    ;[list[index], list[target]] = [list[target], list[index]]
  }
  return list
}

export function buildQuizOptions(
  current: WordEntry,
  phase: QuizPhase,
  pool: WordEntry[],
): QuizOptions {
  const answer = phase === 0 ? current.meaning : current.word
  const field = phase === 0 ? 'meaning' : 'word'
  const seen = new Set([answer.toLowerCase()])
  const distractors: string[] = []

  for (const word of shuffled(pool, `${current.id}-${phase}`)) {
    if (word.id === current.id) continue
    const value = word[field]
    if (seen.has(value.toLowerCase())) continue
    seen.add(value.toLowerCase())
    distractors.push(value)
    if (distractors.length === 3) break
  }

  return {
    answer,
    options: shuffled([answer, ...distractors], `${current.id}-${phase}-options`),
  }
}
