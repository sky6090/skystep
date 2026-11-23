import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/db/db'
import { startOfStudyDay } from '@/domain/day'

export const useSessionStore = defineStore('session', () => {
  const dueCount = ref(0)
  const learnedToday = ref(0)
  const reviewedToday = ref(0)
  const wroteToday = ref(0)
  const totalCards = ref(0)
  const loading = ref(false)

  async function refresh() {
    loading.value = true
    const now = Date.now()
    const start = startOfStudyDay().getTime()
    const [due, cardsToday, logsToday, total, wrote] = await Promise.all([
      db.cards.where('dueAt').belowOrEqual(now).count(),
      db.cards.where('createdAt').aboveOrEqual(start).toArray(),
      db.reviewLogs.where('reviewedAt').aboveOrEqual(start).toArray(),
      db.cards.count(),
      db.submissions.where('createdAt').aboveOrEqual(start).count(),
    ])
    dueCount.value = due
    learnedToday.value = cardsToday.filter((card) => card.origin !== 'dictionary').length
    reviewedToday.value = logsToday.filter((log) => log.kind === 'review').length
    wroteToday.value = wrote
    totalCards.value = total
    loading.value = false
  }

  return {
    dueCount,
    learnedToday,
    reviewedToday,
    wroteToday,
    totalCards,
    loading,
    refresh,
  }
})
