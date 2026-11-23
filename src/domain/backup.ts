import type {
  AttemptRow,
  CardRow,
  QuestionReviewRow,
  ReviewLogRow,
  SettingRow,
  SubmissionRow,
  WordbookRow,
} from '@/db/db'

export const BACKUP_APP = 'skystep'
export const BACKUP_VERSION = 1

export interface BackupData {
  cards: CardRow[]
  reviewLogs: ReviewLogRow[]
  wordbook: WordbookRow[]
  settings: SettingRow[]
  submissions: SubmissionRow[]
  attempts: AttemptRow[]
  questionReviews: QuestionReviewRow[]
}

export interface BackupFile {
  app: typeof BACKUP_APP
  version: number
  exportedAt: string
  data: BackupData
  counts: Record<keyof BackupData, number>
}

export function sanitizeSettings(rows: SettingRow[]): SettingRow[] {
  return rows.map((row) => {
    if (row.key === 'ai' && row.value && typeof row.value === 'object') {
      return {
        key: 'ai',
        value: {
          ...(row.value as Record<string, unknown>),
          apiKey: '',
          enabled: false,
        },
      }
    }
    return { key: row.key, value: row.value }
  })
}

export function buildBackup(data: BackupData): BackupFile {
  const clean: BackupData = {
    cards: [...data.cards],
    reviewLogs: [...data.reviewLogs],
    wordbook: [...data.wordbook],
    settings: sanitizeSettings(data.settings),
    submissions: [...data.submissions],
    attempts: [...data.attempts],
    questionReviews: [...data.questionReviews],
  }
  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: clean,
    counts: {
      cards: clean.cards.length,
      reviewLogs: clean.reviewLogs.length,
      wordbook: clean.wordbook.length,
      settings: clean.settings.length,
      submissions: clean.submissions.length,
      attempts: clean.attempts.length,
      questionReviews: clean.questionReviews.length,
    },
  }
}

function readArray<T>(value: unknown, name: string): T[] {
  if (value == null) return []
  if (!Array.isArray(value)) throw new Error(`备份里的 ${name} 不是数组。`)
  return value as T[]
}

export function parseBackup(text: string): BackupFile {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new Error('这不是有效的 JSON 文件。')
  }
  if (!raw || typeof raw !== 'object') throw new Error('备份内容为空。')
  const file = raw as Partial<BackupFile>
  if (file.app !== BACKUP_APP) throw new Error('这不是 SkyStep 的备份。')
  if (typeof file.version !== 'number' || file.version > BACKUP_VERSION) {
    throw new Error('备份版本太新，请先升级 SkyStep。')
  }
  if (!file.data || typeof file.data !== 'object') throw new Error('备份缺少 data。')

  const data = file.data as unknown as Record<string, unknown>
  const settings = sanitizeSettings(readArray<SettingRow>(data.settings, 'settings'))

  return {
    app: BACKUP_APP,
    version: file.version,
    exportedAt: typeof file.exportedAt === 'string' ? file.exportedAt : '',
    data: {
      cards: readArray<CardRow>(data.cards, 'cards'),
      reviewLogs: readArray<ReviewLogRow>(data.reviewLogs, 'reviewLogs'),
      wordbook: readArray<WordbookRow>(data.wordbook, 'wordbook'),
      settings,
      submissions: readArray<SubmissionRow>(data.submissions, 'submissions'),
      attempts: readArray<AttemptRow>(data.attempts, 'attempts'),
      questionReviews: readArray<QuestionReviewRow>(
        data.questionReviews,
        'questionReviews',
      ),
    },
    counts: {
      cards: readArray(data.cards, 'cards').length,
      reviewLogs: readArray(data.reviewLogs, 'reviewLogs').length,
      wordbook: readArray(data.wordbook, 'wordbook').length,
      settings: settings.length,
      submissions: readArray(data.submissions, 'submissions').length,
      attempts: readArray(data.attempts, 'attempts').length,
      questionReviews: readArray(data.questionReviews, 'questionReviews').length,
    },
  }
}
