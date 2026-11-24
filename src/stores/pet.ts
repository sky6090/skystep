import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { db } from '@/db/db'
import { shopById, shopItems, type ShopItem } from '@/data/shop'
import {
  nextStudyDayKey,
  previousStudyDayKey,
  studyDayKey,
  studyDayRange,
  studyWeekKey,
} from '@/domain/day'
import {
  computeSettlement,
  stageForXp,
  stageRank,
  type PetMetrics,
} from '@/domain/pet'
import { useSessionStore } from '@/stores/session'
import { useSettingsStore } from '@/stores/settings'

export interface PetSettlement {
  day: string
  xp: number
  coins: number
  message: string
  settledAt: number
}

export interface PetState {
  xp: number
  satiety: number
  mood: number
  coins: number
  inventory: Record<string, number>
  owned: string[]
  equippedSkin: string | null
  lastSettledDay: string
  lastSettlement?: PetSettlement
  lastDecayDay: string
  lastInteractDay: string
  claimedWeekly: string
  claimedStage: boolean
}

const DEFAULT_PET: PetState = {
  xp: 0,
  satiety: 80,
  mood: 70,
  coins: 100,
  inventory: { food_basic: 2 },
  owned: [],
  equippedSkin: null,
  lastSettledDay: '',
  lastDecayDay: '',
  lastInteractDay: '',
  claimedWeekly: '',
  claimedStage: false,
}

function dayDistance(from: string, to: string) {
  if (!from) return 1
  const start = Date.parse(`${from}T00:00:00Z`)
  const end = Date.parse(`${to}T00:00:00Z`)
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 1
  return Math.max(1, Math.round((end - start) / 86_400_000))
}

export const usePetStore = defineStore('pet', () => {
  const state = ref<PetState>({ ...DEFAULT_PET })
  const loaded = ref(false)
  const lastAward = ref<{ xp: number; coins: number; message: string } | null>(null)

  const stageInfo = computed(() => stageForXp(state.value.xp))
  const equippedSkinItem = computed<ShopItem | null>(() =>
    state.value.equippedSkin ? shopById.get(state.value.equippedSkin) ?? null : null,
  )
  const foodCount = computed(() =>
    shopItems
      .filter((item) => item.type === 'food')
      .reduce((sum, item) => sum + (state.value.inventory[item.id] ?? 0), 0),
  )
  const renameCount = computed(() => state.value.inventory.rename ?? 0)
  const weeklyClaimed = computed(
    () => state.value.claimedWeekly === studyWeekKey(),
  )
  const stageClaimed = computed(() => state.value.claimedStage)

  async function load() {
    if (loaded.value) return
    const row = await db.settings.get('pet')
    if (row?.value) {
      state.value = {
        ...DEFAULT_PET,
        ...(row.value as Partial<PetState>),
        inventory: {
          ...DEFAULT_PET.inventory,
          ...((row.value as Partial<PetState>).inventory ?? {}),
        },
        owned: [...((row.value as Partial<PetState>).owned ?? [])],
      }
    }
    if (!state.value.lastDecayDay) state.value.lastDecayDay = studyDayKey()
    loaded.value = true
    await applyDecay()
    await save()
  }

  async function save() {
    const plain: PetState = {
      ...state.value,
      inventory: { ...state.value.inventory },
      owned: [...state.value.owned],
    }
    await db.settings.put({ key: 'pet', value: plain })
  }

  async function applyDecay() {
    const today = studyDayKey()
    if (!state.value.lastDecayDay) {
      state.value.lastDecayDay = today
      return
    }
    if (state.value.lastDecayDay === today) return
    const days = dayDistance(state.value.lastDecayDay, today)
    state.value.satiety = Math.max(0, state.value.satiety - 8 * days)
    if (state.value.satiety === 0) {
      state.value.mood = Math.max(0, state.value.mood - 8 * days)
    }
    state.value.lastDecayDay = today
    await save()
  }

  async function buildMetrics(day: string): Promise<PetMetrics> {
    const settings = useSettingsStore()
    const session = useSessionStore()
    await session.refresh()
    const { start, end } = studyDayRange(day)
    const logs = await db.reviewLogs
      .where('reviewedAt')
      .between(start, end, true, false)
      .toArray()
    const reviews = logs.filter((log) => log.kind === 'review')
    const due = session.dueCount
    const reviewDenominator = reviews.length + due
    const R = reviewDenominator > 0 ? reviews.length / reviewDenominator : 0
    const A = logs.length
      ? logs.reduce((sum, log) => {
          if (log.rating >= 3) return sum + 1
          if (log.rating === 2) return sum + 0.5
          return sum
        }, 0) / logs.length
      : 0

    const learned = await db.cards
      .where('createdAt')
      .between(start, end, true, false)
      .count()

    const submissions = await db.submissions
      .where('createdAt')
      .between(start, end, true, false)
      .toArray()
    submissions.sort((a, b) => a.createdAt - b.createdAt)
    const W = submissions.length ? submissions[0].score : 0

    const allLogs = await db.reviewLogs.orderBy('reviewedAt').reverse().limit(2000).toArray()
    const allSubs = await db.submissions.orderBy('createdAt').reverse().limit(500).toArray()
    const activeDays = new Set<string>()
    allLogs.forEach((log) => activeDays.add(studyDayKey(new Date(log.reviewedAt))))
    allSubs.forEach((submission) => activeDays.add(studyDayKey(new Date(submission.createdAt))))
    let streak = 0
    const cursor = new Date(studyDayRange(day).start)
    while (streak < 365 && activeDays.has(studyDayKey(cursor))) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    }

    const G = learned >= settings.profile.dailyNewWords && R >= 0.8 ? 1 : 0

    return {
      R,
      A,
      W,
      S: streak,
      G,
      H: state.value.satiety,
      M: state.value.mood,
    }
  }

  async function settleDue() {
    await applyDecay()
    const target = previousStudyDayKey()
    if (!state.value.lastSettledDay) {
      state.value.lastSettledDay = target
      await save()
      return { settledDays: 0, message: '自动结算已就绪。' }
    }
    if (state.value.lastSettledDay >= target) {
      return { settledDays: 0, message: '没有需要结算的昨日记录。' }
    }

    let cursor = nextStudyDayKey(state.value.lastSettledDay)
    let settledDays = 0
    let lastMessage = ''
    while (cursor <= target) {
      lastMessage = await settleDay(cursor)
      settledDays += 1
      cursor = nextStudyDayKey(cursor)
    }
    return { settledDays, message: lastMessage }
  }

  async function settleDay(day: string) {
    const metrics = await buildMetrics(day)
    const award = computeSettlement(metrics)

    state.value.xp += award.xp
    state.value.coins += award.coins
    if (metrics.G) {
      state.value.inventory.food_basic = (state.value.inventory.food_basic ?? 0) + 1
    }
    state.value.mood = Math.min(
      100,
      Math.max(0, state.value.mood + (metrics.G ? 5 : 0) - (state.value.satiety < 30 ? 8 : 0)),
    )
    state.value.lastSettledDay = day

    const message =
      award.xp === 0 && award.coins === 0
        ? '昨日没有学习记录，本次结算 0 经验。'
        : `昨日学习结算：+${award.xp} 经验，+${award.coins} 金币。${metrics.G ? ' 日目标完成，+1 基础粮。' : ''}`
    state.value.lastSettlement = {
      day,
      xp: award.xp,
      coins: award.coins,
      message,
      settledAt: Date.now(),
    }
    lastAward.value = { xp: award.xp, coins: award.coins, message }

    await unlockStageRewards()
    await save()
    return message
  }

  async function unlockStageRewards() {
    const info = stageForXp(state.value.xp)
    const currentRank = stageRank(info.stage)
    const rewards = shopItems.filter(
      (item) => item.unlockStage && stageRank(item.unlockStage) <= currentRank,
    )
    let changed = false
    for (const item of rewards) {
      if (!state.value.owned.includes(item.id)) {
        state.value.owned.push(item.id)
        changed = true
      }
    }
    if (changed) await save()
  }

  async function feed(itemId?: string) {
    const item = itemId
      ? shopById.get(itemId)
      : shopItems.find(
          (candidate) =>
            candidate.type === 'food' && (state.value.inventory[candidate.id] ?? 0) > 0,
        )
    if (!item || item.type !== 'food') return null
    if ((state.value.inventory[item.id] ?? 0) <= 0) return null
    state.value.inventory[item.id] -= 1
    state.value.satiety = Math.min(100, state.value.satiety + (item.satiety ?? 30))
    state.value.mood = Math.min(100, state.value.mood + (item.mood ?? 10))
    await save()
    return item
  }

  async function buy(itemId: string) {
    const item = shopById.get(itemId)
    if (!item) return { ok: false, message: '没有这个商品。' }
    if (item.unlockStage) return { ok: false, message: '这是阶段解锁奖励，不用买。' }
    if (item.price > state.value.coins) {
      return { ok: false, message: '金币不够，先完成今天的复习。' }
    }
    state.value.coins -= item.price
    if (item.type === 'food' || item.type === 'toy' || item.type === 'rename') {
      state.value.inventory[item.id] = (state.value.inventory[item.id] ?? 0) + 1
    } else {
      if (!state.value.owned.includes(item.id)) state.value.owned.push(item.id)
    }
    await save()
    return { ok: true, message: `已购买 ${item.name}。` }
  }

  async function equipSkin(itemId: string) {
    const item = shopById.get(itemId)
    if (!item || item.type !== 'skin') return false
    if (!state.value.owned.includes(itemId)) return false
    state.value.equippedSkin = itemId
    await save()
    return true
  }

  async function rename(name: string) {
    const trimmed = name.trim()
    const cards = state.value.inventory.rename ?? 0
    if (!trimmed || cards <= 0) return false
    const settings = useSettingsStore()
    state.value.inventory.rename = cards - 1
    settings.profile.petName = trimmed
    await settings.save()
    await save()
    return true
  }

  async function interact() {
    const today = studyDayKey()
    if (state.value.lastInteractDay === today) return false
    state.value.lastInteractDay = today
    state.value.mood = Math.min(100, state.value.mood + 5)
    await save()
    return true
  }

  async function claimWeekly(complete: boolean) {
    if (!complete) return { ok: false, message: '本周目标还没完成。' }
    if (weeklyClaimed.value) return { ok: false, message: '本周奖励已领取。' }
    state.value.claimedWeekly = studyWeekKey()
    state.value.coins += 120
    state.value.inventory.food_basic = (state.value.inventory.food_basic ?? 0) + 1
    await save()
    return { ok: true, message: '周目标奖励：+120 金币，+1 基础粮。' }
  }

  async function claimStage(complete: boolean) {
    if (!complete) return { ok: false, message: '阶段目标还没完成。' }
    if (stageClaimed.value) return { ok: false, message: '阶段奖励已领取。' }
    state.value.claimedStage = true
    state.value.coins += 300
    state.value.inventory.food_fish = (state.value.inventory.food_fish ?? 0) + 1
    await save()
    return { ok: true, message: '阶段奖励：+300 金币，+1 小鱼干。' }
  }

  return {
    state,
    loaded,
    lastAward,
    stageInfo,
    equippedSkinItem,
    foodCount,
    renameCount,
    weeklyClaimed,
    stageClaimed,
    load,
    save,
    settleDue,
    feed,
    buy,
    equipSkin,
    rename,
    interact,
    claimWeekly,
    claimStage,
  }
})
