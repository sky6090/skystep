export interface PetMetrics {
  R: number
  A: number
  W: number
  S: number
  G: number
  H: number
  M: number
}

export interface SettlementAward {
  xp: number
  coins: number
  writingBonus: number
  moodMultiplier: number
}

export const PET_LEVELS = [
  0, 200, 400, 600, 800, 1200, 1600, 2100, 2700, 3500, 4000, 4600, 5300, 6000, 6500,
]

export const PET_STAGE_LABELS: Record<'baby' | 'growing' | 'mature', string> = {
  baby: '幼年',
  growing: '成长',
  mature: '成熟',
}

export type PetStage = 'baby' | 'growing' | 'mature'

export interface StageInfo {
  stage: PetStage
  stageLabel: string
  level: number
  nextXp: number | null
  progress: number
  maxed: boolean
  companionLevel: number
  stars: number
  milestones: number
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

export function computeSettlement(metrics: PetMetrics): SettlementAward {
  const R = clamp01(metrics.R)
  const A = clamp01(metrics.A)
  const W = Math.max(0, Math.min(100, metrics.W))
  const S = Math.max(0, Math.min(7, metrics.S))
  const G = metrics.G > 0 ? 1 : 0
  const H = Math.max(0, Math.min(100, metrics.H))
  const M = Math.max(0, Math.min(100, metrics.M))

  const writingBonus = W >= 80 ? 1.1 : W >= 60 ? 1.05 : 1
  const moodMultiplier = (0.9 + 0.2 * (M / 100)) * (H <= 0 ? 0.85 : 1)

  const baseXp = 20 * R + 20 * A + 30 * (W / 100) + 10 * (S / 7) + 10 * G
  const xp = Math.round(baseXp * writingBonus * moodMultiplier)
  const coins = Math.round(10 * R + 10 * A + 15 * (W / 100) + 5 * (S / 7) + 5 * G)

  return { xp, coins, writingBonus, moodMultiplier }
}

export function stageForXp(xp: number): StageInfo {
  const safeXp = Math.max(0, Math.round(xp))
  let level = 1
  for (let index = 0; index < PET_LEVELS.length; index += 1) {
    if (safeXp >= PET_LEVELS[index]) level = index + 1
  }

  const stage: PetStage = safeXp < 800 ? 'baby' : safeXp < 3500 ? 'growing' : 'mature'
  const maxed = safeXp >= 6500
  const nextXp = !maxed && level < PET_LEVELS.length ? PET_LEVELS[level] : null
  const currentXp = PET_LEVELS[Math.max(0, level - 1)]
  const progress = maxed
    ? 100
    : nextXp
      ? Math.round(((safeXp - currentXp) / Math.max(1, nextXp - currentXp)) * 100)
      : 100

  const companionLevel = maxed ? Math.floor((safeXp - 6500) / 500) + 1 : 0
  const stars = maxed ? Math.floor((companionLevel - 1) / 10) + 1 : 0
  const milestones = maxed ? Math.floor((safeXp - 6500) / 5000) : 0

  return {
    stage,
    stageLabel: PET_STAGE_LABELS[stage],
    level,
    nextXp,
    progress,
    maxed,
    companionLevel,
    stars,
    milestones,
  }
}

export function stageRank(stage: PetStage): number {
  if (stage === 'growing') return 2
  if (stage === 'mature') return 3
  return 1
}
