import { db } from '@/db/db'
import { buildBackup, parseBackup, type BackupFile } from '@/domain/backup'

export async function collectBackup(): Promise<BackupFile> {
  const [cards, reviewLogs, wordbook, settings, submissions, attempts, questionReviews] =
    await Promise.all([
      db.cards.toArray(),
      db.reviewLogs.toArray(),
      db.wordbook.toArray(),
      db.settings.toArray(),
      db.submissions.toArray(),
      db.attempts.toArray(),
      db.questionReviews.toArray(),
    ])
  return buildBackup({
    cards,
    reviewLogs,
    wordbook,
    settings,
    submissions,
    attempts,
    questionReviews,
  })
}

export function downloadBackup(backup: BackupFile) {
  const name = `skystep-backup-${new Date().toISOString().slice(0, 10)}.json`
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function restoreBackup(text: string) {
  const backup = parseBackup(text)
  await db.transaction(
    'rw',
    [
      db.cards,
      db.reviewLogs,
      db.wordbook,
      db.settings,
      db.submissions,
      db.attempts,
      db.questionReviews,
    ],
    async () => {
      await Promise.all([
        db.cards.clear(),
        db.reviewLogs.clear(),
        db.wordbook.clear(),
        db.settings.clear(),
        db.submissions.clear(),
        db.attempts.clear(),
        db.questionReviews.clear(),
      ])
      await db.cards.bulkAdd(backup.data.cards)
      await db.reviewLogs.bulkAdd(backup.data.reviewLogs)
      await db.wordbook.bulkAdd(backup.data.wordbook)
      await db.settings.bulkAdd(backup.data.settings)
      await db.submissions.bulkAdd(backup.data.submissions)
      await db.attempts.bulkAdd(backup.data.attempts)
      await db.questionReviews.bulkAdd(backup.data.questionReviews)
    },
  )
  return backup.counts
}
