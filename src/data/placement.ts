import { sampleWords, type WordEntry } from './words.sample'

export interface PlacementQuestion {
  word: string
  options: string[]
  answer: number
}

export type VocabLevel = 'basic' | 'intermediate' | 'advanced'

export interface PlacementResult {
  score: number
  estimated: number
  level: VocabLevel
  label: string
}

function shuffled<T>(items: T[]): T[] {
  const list = [...items]
  for (let index = list.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[list[index], list[target]] = [list[target], list[index]]
  }
  return list
}

function questionFromWord(word: WordEntry, pool: WordEntry[]): PlacementQuestion {
  const answer = word.meaning
  const distractors = [
    ...new Set(
      shuffled(pool)
        .filter((candidate) => candidate.id !== word.id && candidate.meaning !== answer)
        .map((candidate) => candidate.meaning),
    ),
  ].slice(0, 3)
  const options = shuffled([answer, ...distractors])
  return {
    word: word.word,
    options,
    answer: options.indexOf(answer),
  }
}

export function createPlacementQuestionsFromPool(
  pool: WordEntry[],
  count = 15,
): PlacementQuestion[] {
  const picked = shuffled(pool).slice(0, count)
  return picked.map((word) => questionFromWord(word, pool))
}

export function createPlacementQuestions(count = 15): PlacementQuestion[] {
  return createPlacementQuestionsFromPool(sampleWords, count)
}

// A stable default for tests and any code that does not need a fresh set.
export const placementQuestions = createPlacementQuestions()

export function evaluatePlacement(
  answers: number[],
  questions: PlacementQuestion[] = placementQuestions,
): PlacementResult {
  const score = questions.reduce(
    (sum, question, index) => sum + (answers[index] === question.answer ? 1 : 0),
    0,
  )
  const estimated = Math.min(6500, 1200 + score * 350)
  const level: VocabLevel = score <= 5 ? 'basic' : score <= 10 ? 'intermediate' : 'advanced'
  const label =
    level === 'basic' ? '基础 · 先补高频' : level === 'advanced' ? '进阶 · 冲六级高分' : '中级 · 六级主力'
  return { score, estimated, level, label }
}
