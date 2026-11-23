import { describe, expect, it } from 'vitest'
import {
  BACKUP_VERSION,
  buildBackup,
  parseBackup,
  sanitizeSettings,
  type BackupData,
} from './backup'

const emptyData: BackupData = {
  cards: [],
  reviewLogs: [],
  wordbook: [],
  settings: [],
  submissions: [],
  attempts: [],
  questionReviews: [],
}

describe('backup format', () => {
  it('never exports the AI key', () => {
    const settings = sanitizeSettings([
      {
        key: 'ai',
        value: { enabled: true, baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat', apiKey: 'secret' },
      },
    ])
    expect(settings[0].value).toMatchObject({ apiKey: '', enabled: false })
  })

  it('round-trips a backup and counts records', () => {
    const backup = buildBackup({
      ...emptyData,
      wordbook: [
        {
          wordId: 'advocate',
          favorite: true,
          learned: false,
          source: 'manual',
          note: '',
          tags: [],
          createdAt: 1,
          updatedAt: 2,
        },
      ],
    })
    const parsed = parseBackup(JSON.stringify(backup))
    expect(parsed.version).toBe(BACKUP_VERSION)
    expect(parsed.counts.wordbook).toBe(1)
    expect(parsed.counts.cards).toBe(0)
  })

  it('rejects a foreign file', () => {
    expect(() => parseBackup('{"app":"other"}')).toThrow('不是 SkyStep')
    expect(() => parseBackup('not json')).toThrow('JSON')
  })

  it('rejects a newer schema', () => {
    expect(() =>
      parseBackup(
        JSON.stringify({ app: 'skystep', version: BACKUP_VERSION + 1, data: {} }),
      ),
    ).toThrow('版本太新')
  })
})
