import type { Question } from '@/data/questions.sample'

export interface TypeScore {
  correct: number
  total: number
}

export interface AttemptScore {
  correct: number
  total: number
  score: number
  readingScore: number
  byType: Record<string, TypeScore>
  wrong: Question[]
}

export function scoreQuestions(
  questions: Question[],
  answers: Record<string, string>,
): AttemptScore {
  const byType: Record<string, TypeScore> = {}
  const wrong: Question[] = []
  let correct = 0

  for (const question of questions) {
    const bucket = (byType[question.type] ??= { correct: 0, total: 0 })
    bucket.total += 1
    if (answers[question.id] === question.answer) {
      correct += 1
      bucket.correct += 1
    } else {
      wrong.push(question)
    }
  }

  const total = questions.length
  const score = total > 0 ? Math.round((correct / total) * 100) : 0
  const readingScore =
    total > 0 ? Math.round((correct / total) * 248.5 * 10) / 10 : 0

  return { correct, total, score, readingScore, byType, wrong }
}

export function buildPracticeSet(questions: Question[], count = 10): Question[] {
  const cloze = questions.filter((question) => question.type === 'banked-cloze')
  const matching = questions.filter((question) => question.type === 'matching')
  const careful = questions.filter((question) => question.type === 'careful-reading')

  const wantedCloze = Math.min(cloze.length, Math.max(2, Math.round(count * 0.3)))
  const wantedMatching = Math.min(
    matching.length,
    Math.max(2, Math.round(count * 0.3)),
  )
  const wantedCareful = Math.max(0, count - wantedCloze - wantedMatching)

  return [
    ...cloze.slice(0, wantedCloze),
    ...matching.slice(0, wantedMatching),
    ...careful.slice(0, wantedCareful),
  ].slice(0, count)
}

export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function groupByPassage(questions: Question[]): Map<string, Question[]> {
  const map = new Map<string, Question[]>()
  for (const question of questions) {
    const list = map.get(question.passageId) ?? []
    list.push(question)
    map.set(question.passageId, list)
  }
  return map
}

export const questionTypeLabels: Record<string, string> = {
  'banked-cloze': '选词填空',
  matching: '长篇匹配',
  'careful-reading': '仔细阅读',
}
