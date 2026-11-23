import {
  readingPassages,
  readingQuestions,
  readingSection,
  type ReadingPassage,
  type ReadingSection,
} from './questions.sample'
import {
  readingPassages2,
  readingQuestions2,
  readingSection2,
} from './questions.set2'
import {
  readingPassages3,
  readingQuestions3,
  readingSection3,
} from './questions.set3'

export type { Question, QuestionType } from './questions.sample'

export const readingSections: ReadingSection[] = [
  readingSection,
  readingSection2,
  readingSection3,
]
export const allReadingQuestions = [
  ...readingQuestions,
  ...readingQuestions2,
  ...readingQuestions3,
]
export const allReadingPassages: ReadingPassage[] = [
  ...readingPassages,
  ...readingPassages2,
  ...readingPassages3,
]

export const passageById = new Map(
  allReadingPassages.map((passage) => [passage.id, passage]),
)
export const questionById = new Map(
  allReadingQuestions.map((question) => [question.id, question]),
)

export function sectionById(id: unknown): ReadingSection {
  return (
    readingSections.find((section) => section.id === id) ?? readingSections[0]
  )
}
