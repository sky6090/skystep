import { describe, expect, it } from 'vitest'
import { studyDayKey, studyWeekKey } from './day'

describe('study calendar', () => {
  it('uses a 4 AM day boundary', () => {
    expect(studyDayKey(new Date(2026, 10, 24, 3, 30))).toBe('2026-11-23')
    expect(studyDayKey(new Date(2026, 10, 24, 4, 30))).toBe('2026-11-24')
  })

  it('returns the Monday key for a study week', () => {
    expect(studyWeekKey(new Date(2026, 10, 24, 12))).toBe('2026-11-23')
    expect(studyWeekKey(new Date(2026, 10, 23, 3))).toBe('2026-11-16')
  })
})
