import Dexie, { type Table } from 'dexie'
import type { FsrsCard } from '@/domain/fsrs'
import type { WritingMode, WritingResult } from '@/domain/writing'

export interface CardRow {
  wordId: string
  dueAt: number
  state: number
  card: FsrsCard
  createdAt: number
  updatedAt: number
  sameDay?: boolean
  origin?: 'learn' | 'dictionary' | 'review'
}

export interface ReviewLogRow {
  id?: number
  wordId: string
  rating: number
  kind?: 'new' | 'review'
  reviewedAt: number
  dueAt: number
  state: number
  stability: number
  difficulty: number
  scheduledDays: number
}

export interface SettingRow {
  key: string
  value: unknown
}

export interface WordbookRow {
  wordId: string
  favorite: boolean
  learned: boolean
  wrong?: boolean
  wrongCount?: number
  lastWrongAt?: number
  learnedAt?: number
  source: 'manual' | 'dictionary' | 'practice' | 'reading' | 'custom'
  note: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

export interface SubmissionRow {
  id?: number
  createdAt: number
  mode: WritingMode
  articleId: string
  title: string
  targetWords: string[]
  sourceText: string
  userText: string
  result: WritingResult
  score: number
  engine?: 'rule' | 'ai'
}

export interface AttemptRow {
  id?: number
  createdAt: number
  mode: 'practice' | 'exam' | 'writing'
  title: string
  durationSec: number
  answers: Record<string, string>
  correct: number
  total: number
  score: number
  readingScore: number
  byType: Record<string, { correct: number; total: number }>
  wrongIds: string[]
}

export interface QuestionReviewRow {
  questionId: string
  wrongCount: number
  stage: 1 | 2 | 3
  nextDueAt: number
  lastReviewedAt: number
}

class SkyStepDB extends Dexie {
  cards!: Table<CardRow, string>
  reviewLogs!: Table<ReviewLogRow, number>
  settings!: Table<SettingRow, string>
  wordbook!: Table<WordbookRow, string>
  submissions!: Table<SubmissionRow, number>
  attempts!: Table<AttemptRow, number>
  questionReviews!: Table<QuestionReviewRow, string>

  constructor() {
    super('skystep')
    this.version(1).stores({
      cards: 'wordId, dueAt, state, createdAt, updatedAt',
      reviewLogs: '++id, wordId, reviewedAt',
      settings: 'key',
      wordbook: 'wordId, favorite, learned, source, updatedAt',
    })
    this.version(2).stores({
      cards: 'wordId, dueAt, state, createdAt, updatedAt',
      reviewLogs: '++id, wordId, reviewedAt',
      settings: 'key',
      wordbook: 'wordId, favorite, learned, source, updatedAt',
      submissions: '++id, createdAt, mode, articleId',
    })
    this.version(3).stores({
      cards: 'wordId, dueAt, state, createdAt, updatedAt',
      reviewLogs: '++id, wordId, reviewedAt',
      settings: 'key',
      wordbook: 'wordId, favorite, learned, source, updatedAt',
      submissions: '++id, createdAt, mode, articleId',
      attempts: '++id, createdAt, mode',
    })
    this.version(4).stores({
      cards: 'wordId, dueAt, state, createdAt, updatedAt',
      reviewLogs: '++id, wordId, reviewedAt',
      settings: 'key',
      wordbook: 'wordId, favorite, learned, source, updatedAt',
      submissions: '++id, createdAt, mode, articleId',
      attempts: '++id, createdAt, mode',
      questionReviews: 'questionId, nextDueAt, stage',
    })
  }
}

export const db = new SkyStepDB()
