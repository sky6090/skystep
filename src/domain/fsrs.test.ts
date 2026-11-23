import { describe, expect, it } from 'vitest'
import { applyRating, createNewCard, Rating } from './fsrs'

describe('FSRS-6 scheduling', () => {
  it('creates a new card in the new state', async () => {
    const now = new Date('2026-11-23T12:00:00Z')
    const card = await createNewCard(now)
    expect(card.state).toBe(0)
    expect(card.reps).toBe(0)
    expect(card.dueAt.getTime()).toBe(now.getTime())
  })

  it('schedules a good new card into review', async () => {
    const now = new Date('2026-11-23T12:00:00Z')
    const card = await createNewCard(now)
    const result = await applyRating(card, Rating.Good, now)
    expect(result.card.state).toBe(2)
    expect(result.card.dueAt.getTime()).toBeGreaterThan(now.getTime())
    expect(result.card.scheduledDays).toBeGreaterThan(0)
  })

  it('schedules Again sooner than Good', async () => {
    const now = new Date('2026-11-23T12:00:00Z')
    const card = await createNewCard(now)
    const again = await applyRating(card, Rating.Again, now)
    const good = await applyRating(card, Rating.Good, now)
    expect(again.card.dueAt.getTime()).toBeLessThan(good.card.dueAt.getTime())
  })
})
