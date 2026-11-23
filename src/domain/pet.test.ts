import { describe, expect, it } from 'vitest'
import { computeSettlement, stageForXp, stageRank } from './pet'

describe('pet economy', () => {
  it('computes standard XP and coins with writing and mood bonuses', () => {
    const award = computeSettlement({
      R: 1,
      A: 1,
      W: 100,
      S: 7,
      G: 1,
      H: 80,
      M: 70,
    })
    expect(award.writingBonus).toBe(1.1)
    expect(award.moodMultiplier).toBeCloseTo(1.04, 5)
    expect(award.xp).toBe(103)
    expect(award.coins).toBe(45)
  })

  it('applies the 0.85 hunger penalty', () => {
    const award = computeSettlement({
      R: 1,
      A: 1,
      W: 0,
      S: 7,
      G: 1,
      H: 0,
      M: 70,
    })
    expect(award.moodMultiplier).toBeCloseTo(1.04 * 0.85, 5)
    expect(award.xp).toBe(53)
  })

  it('maps XP to stages and levels', () => {
    expect(stageForXp(0).stage).toBe('baby')
    expect(stageForXp(799).level).toBe(4)
    expect(stageForXp(800).stage).toBe('growing')
    expect(stageForXp(3500).stage).toBe('mature')
    expect(stageForXp(6500).maxed).toBe(true)
    expect(stageForXp(7000).companionLevel).toBe(2)
    expect(stageForXp(11500).stars).toBe(2)
    expect(stageForXp(11500).milestones).toBe(1)
  })

  it('ranks stages for unlock checks', () => {
    expect(stageRank('baby')).toBe(1)
    expect(stageRank('growing')).toBe(2)
    expect(stageRank('mature')).toBe(3)
  })
})
