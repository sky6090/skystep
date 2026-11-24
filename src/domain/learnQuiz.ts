import type { WordEntry } from '@/data/words.sample'

export type QuizPhase = 0 | 1

export interface QuizOptions {
  options: string[]
  answer: string
}

const POS_LABELS: Record<string, string> = {
  a: 'adj.',
  adj: 'adj.',
  adv: 'adv.',
  n: 'n.',
  v: 'v.',
  vt: 'v.',
  vi: 'v.',
  vbl: 'v.',
  int: 'interj.',
  interj: 'interj.',
  pl: 'n.',
  prep: 'prep.',
  pron: 'pron.',
  conj: 'conj.',
  num: 'num.',
  art: 'art.',
  aux: 'aux.',
  abbr: 'abbr.',
}

function normalizePos(pos: string): string {
  return pos
    .split(/[/,;，；]/)
    .map((part) => part.trim().replace(/\.$/, '').toLowerCase())
    .filter(Boolean)
    .map((part) => POS_LABELS[part] ?? `${part}.`)
    .filter((part, index, all) => all.indexOf(part) === index)
    .join('/')
}

function highFrequencyMeaning(meaning: string): string {
  const parts = meaning
    .split(/[；;，,]/)
    .map((part) => part.replace(/\[[^\]]*]/g, '').trim())
    .filter(Boolean)
  return [...new Set(parts)].slice(0, 2).join('；')
}

export function formatMeaningOption(word: WordEntry): string {
  const pos = normalizePos(word.pos)
  const meaning = highFrequencyMeaning(word.meaning) || word.meaning
  return pos ? `${pos} ${meaning}` : meaning
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
  const valueOf = (word: WordEntry) =>
    phase === 0 ? formatMeaningOption(word) : word.word
  const answer = valueOf(current)
  const seen = new Set([answer.toLowerCase()])
  const distractors: string[] = []

  for (const word of shuffled(pool, `${current.id}-${phase}`)) {
    if (word.id === current.id) continue
    const value = valueOf(word)
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
