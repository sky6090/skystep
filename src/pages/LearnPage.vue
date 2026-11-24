<template>
  <AppShell>
    <div class="page learn">
      <header class="page-head">
        <div>
          <p class="eyebrow">today's new words</p>
          <h1 class="h1">学新词</h1>
        </div>
        <span class="count">{{ phaseIndex + 1 }} / 3 遍</span>
      </header>

      <div class="phase-row" aria-label="学习阶段">
        <span
          v-for="(phase, index) in phases"
          :key="phase"
          class="phase-chip"
          :class="{ active: index === phaseIndex, done: index < phaseIndex }"
        >
          {{ index + 1 }}. {{ phase }}
        </span>
      </div>

      <div class="progress" aria-hidden="true">
        <span :style="{ width: progressWidth }" />
      </div>

      <section v-if="finished" class="done card">
        <p class="eyebrow">done</p>
        <h2 class="h2">今天的三遍学完了。</h2>
        <p class="muted small">
          英译中、中译英、拼写各过了一遍；学过的词已经进入 FSRS 复习。
        </p>
        <div class="done-actions">
          <RouterLink to="/review" class="btn btn-primary">去复习</RouterLink>
          <RouterLink to="/" class="btn btn-ghost">回首页</RouterLink>
        </div>
      </section>

      <template v-else-if="current">
        <article class="word-sheet card">
          <div class="word-meta">
            <span class="tag tag-accent">{{ current.tags[0] }}</span>
            <span class="tag">{{ current.pos }}</span>
            <button
              class="icon-btn"
              type="button"
              :aria-label="wordbook.isFavorite(current.id) ? '取消收藏' : '收藏'"
              @click="toggleFavorite"
            >
              {{ wordbook.isFavorite(current.id) ? '★' : '☆' }}
            </button>
            <button class="btn btn-sm step-btn" type="button" :disabled="busy" @click="stepWord">
              Step
            </button>
          </div>

          <template v-if="phaseIndex === 0">
            <p class="eyebrow">
              {{ isRetry ? '错题重做 · ' : '' }}英 → 中 · {{ wordIndex + 1 }} / {{ activeQueue.length }}
            </p>
            <h2 class="word-head">{{ current.word }}</h2>
            <p class="phonetic">{{ current.phonetic }}</p>
            <div class="option-list">
              <button
                v-for="option in quiz?.options"
                :key="option"
                class="option-btn"
                :class="optionClass(option)"
                type="button"
                :disabled="answered"
                @click="pickOption(option)"
              >
                {{ option }}
              </button>
            </div>
          </template>

          <template v-else-if="phaseIndex === 1">
            <p class="eyebrow">
              {{ isRetry ? '错题重做 · ' : '' }}中 → 英 · {{ wordIndex + 1 }} / {{ activeQueue.length }}
            </p>
            <h2 class="meaning-head">{{ current.meaning }}</h2>
            <div class="option-list">
              <button
                v-for="option in quiz?.options"
                :key="option"
                class="option-btn"
                :class="optionClass(option)"
                type="button"
                :disabled="answered"
                @click="pickOption(option)"
              >
                {{ option }}
              </button>
            </div>
          </template>

          <template v-else>
            <p class="eyebrow">
              {{ isRetry ? '错题重做 · ' : '' }}拼写 · {{ wordIndex + 1 }} / {{ activeQueue.length }}
            </p>
            <h2 class="meaning-head">{{ current.meaning }}</h2>
            <p class="phonetic">{{ current.phonetic }}</p>
            <div class="spell-row">
              <input
                v-model="spellingInput"
                class="input"
                type="text"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
                placeholder="拼出这个单词"
                :disabled="answered"
                @keyup.enter="checkSpelling"
              />
              <button
                class="btn btn-primary"
                type="button"
                :disabled="!spellingInput.trim() || answered"
                @click="checkSpelling"
              >
                检查
              </button>
            </div>
          </template>

          <p v-if="feedback" class="feedback" :class="feedbackTone">{{ feedback }}</p>

          <p v-if="answered && phaseIndex === 2" class="reveal-word">
            <span class="sub-label">正确拼写</span> {{ current.word }}
          </p>

          <p v-if="answered && lastCorrect" class="hint">
            正确，1.06 秒后自动进入下一题。
          </p>
          <p v-else-if="answered" class="hint">
            做错了，点下方 Step 继续；这个阶段结束前会把错题重做，直到做对。
          </p>
          <p v-else class="hint">
            四选一，选最接近的一个；想直接跳过就点右上角 Step。
          </p>

          <button
            v-if="answered && !lastCorrect"
            class="btn btn-primary btn-block"
            type="button"
            :disabled="busy"
            @click="advance"
          >
            Step · 下一题
          </button>
        </article>
      </template>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import { db } from '@/db/db'
import { entryToWord, loadDictionary } from '@/data/dictionary'
import { buildQuizOptions } from '@/domain/learnQuiz'
import { sampleWords, type WordEntry } from '@/data/words.sample'
import { applyRating, createNewCard, Rating } from '@/domain/fsrs'
import { useSessionStore } from '@/stores/session'
import { useSettingsStore } from '@/stores/settings'
import { useWordbookStore } from '@/stores/wordbook'

const phases = ['英 → 中', '中 → 英', '拼写'] as const

const settings = useSettingsStore()
const session = useSessionStore()
const wordbook = useWordbookStore()

const queue = ref<WordEntry[]>([])
const activeQueue = ref<WordEntry[]>([])
const phaseIndex = ref(0)
const wordIndex = ref(0)
const busy = ref(false)
const finished = ref(false)
const answered = ref(false)
const lastCorrect = ref(false)
const isRetry = ref(false)
const selected = ref('')
const spellingInput = ref('')
const feedback = ref('')
const feedbackTone = ref('')
const rated = new Set<string>()
const phaseWrong = new Set<string>()
let advanceTimer: number | undefined

const current = computed(() => activeQueue.value[wordIndex.value])
const quiz = computed(() => {
  if (!current.value || phaseIndex.value === 2) return null
  return buildQuizOptions(
    current.value,
    phaseIndex.value === 0 ? 0 : 1,
    [...queue.value, ...sampleWords],
  )
})
const progressWidth = computed(() => {
  const total = Math.max(1, queue.value.length * 3)
  const done = phaseIndex.value * queue.value.length + wordIndex.value
  return `${Math.min(100, (done / total) * 100)}%`
})

onMounted(async () => {
  await settings.load()
  await wordbook.load()
  await load()
})

onBeforeUnmount(clearAdvanceTimer)

function clearAdvanceTimer() {
  if (advanceTimer !== undefined) {
    window.clearTimeout(advanceTimer)
    advanceTimer = undefined
  }
}

function scheduleAdvance() {
  clearAdvanceTimer()
  advanceTimer = window.setTimeout(() => {
    advanceTimer = undefined
    advance()
  }, 1061.5)
}

async function load() {
  await session.refresh()
  const existing = new Set((await db.cards.toArray()).map((row) => row.wordId))
  const limit = Math.max(0, settings.profile.dailyNewWords - session.learnedToday)
  const seed = sampleWords
    .filter((word) => !existing.has(word.id))
    .slice(0, limit)

  if (seed.length < limit) {
    const entries = await loadDictionary()
    const seen = new Set(seed.map((word) => word.id))
    const level = settings.profile.vocabLevel
    const examWords = entries.filter((entry) => {
      if (level === 'basic') return entry.tag === 'CET-4' || entry.tag === '高频'
      if (level === 'advanced') return entry.tag === 'CET-6' || entry.tag === '考研'
      return entry.tag === 'CET-6' || entry.tag === 'CET-4'
    })
    const commonWords = entries.filter((entry) => entry.tag === '高频')
    const extras = [...examWords, ...commonWords]
      .filter((entry) => !existing.has(entry.id) && !seen.has(entry.id))
      .slice(0, limit - seed.length)
      .map(entryToWord)
    queue.value = [...seed, ...extras]
  } else {
    queue.value = seed
  }

  phaseIndex.value = 0
  wordIndex.value = 0
  activeQueue.value = queue.value
  phaseWrong.clear()
  isRetry.value = false
  rated.clear()
  finished.value = queue.value.length === 0
  resetStep()
}

function resetStep() {
  clearAdvanceTimer()
  answered.value = false
  lastCorrect.value = false
  selected.value = ''
  spellingInput.value = ''
  feedback.value = ''
  feedbackTone.value = ''
}

function optionClass(option: string) {
  if (!answered.value) return {}
  return {
    correct: option === quiz.value?.answer,
    wrong: option === selected.value && option !== quiz.value?.answer,
  }
}

async function rateWord(known: boolean) {
  if (!current.value || rated.has(current.value.id)) return
  rated.add(current.value.id)
  const word = current.value
  const now = Date.now()
  const rating = known ? Rating.Good : Rating.Again
  try {
    const card = await createNewCard(new Date(now))
    const result = await applyRating(card, rating, new Date(now))
    const dueAt = known ? result.card.dueAt.getTime() : now

    await db.cards.put({
      wordId: word.id,
      dueAt,
      state: result.card.state,
      card: result.card,
      createdAt: now,
      updatedAt: now,
      sameDay: !known,
      origin: 'learn',
    })

    await db.reviewLogs.add({
      wordId: word.id,
      rating,
      kind: 'new',
      reviewedAt: now,
      dueAt,
      state: result.card.state,
      stability: result.card.stability,
      difficulty: result.card.difficulty,
      scheduledDays: result.card.scheduledDays,
    })

    await wordbook.ensure(word.id, 'manual')
    if (known) await wordbook.markLearned(word.id, 'manual')
    else await wordbook.markWrong(word.id, 'manual')
    await session.refresh()
  } catch {
    rated.delete(word.id)
    throw new Error('save failed')
  }
}

async function pickOption(option: string) {
  if (answered.value || !current.value || !quiz.value) return
  busy.value = true
  answered.value = true
  selected.value = option
  const correct = option === quiz.value.answer
  lastCorrect.value = correct
  if (correct) phaseWrong.delete(current.value.id)
  else phaseWrong.add(current.value.id)
  feedback.value = correct ? '正确。' : `正确答案：${quiz.value.answer}`
  feedbackTone.value = correct ? 'ok' : 'wrong'
  try {
    if (phaseIndex.value === 0) {
      await rateWord(correct)
    } else if (!correct) {
      await wordbook.markWrong(current.value.id, 'manual')
    }
  } finally {
    busy.value = false
  }
  if (correct) scheduleAdvance()
}

async function checkSpelling() {
  if (answered.value || !current.value || !spellingInput.value.trim()) return
  answered.value = true
  const correct =
    spellingInput.value.trim().toLowerCase() === current.value.word.toLowerCase()
  lastCorrect.value = correct
  if (correct) phaseWrong.delete(current.value.id)
  else phaseWrong.add(current.value.id)
  feedback.value = correct ? '拼写正确。' : `正确拼写：${current.value.word}`
  feedbackTone.value = correct ? 'ok' : 'wrong'
  if (!correct) await wordbook.markWrong(current.value.id, 'manual')
  if (correct) scheduleAdvance()
}

async function stepWord() {
  if (busy.value || !current.value) return
  busy.value = true
  try {
    if (phaseIndex.value === 0 && !answered.value) {
      await rateWord(true)
      answered.value = true
      lastCorrect.value = true
      phaseWrong.delete(current.value.id)
      feedback.value = '已标记认识，进入下一步。'
      feedbackTone.value = 'ok'
      busy.value = false
      advance()
      return
    }
  } finally {
    busy.value = false
  }
  advance()
}

function advance() {
  if (finished.value) return
  clearAdvanceTimer()
  if (wordIndex.value + 1 < activeQueue.value.length) {
    wordIndex.value += 1
    resetStep()
    return
  }

  const wrongWords = activeQueue.value.filter((word) => phaseWrong.has(word.id))
  if (wrongWords.length > 0) {
    activeQueue.value = wrongWords
    wordIndex.value = 0
    isRetry.value = true
    resetStep()
    return
  }

  if (phaseIndex.value < 2) {
    phaseIndex.value += 1
    phaseWrong.clear()
    activeQueue.value = queue.value
    wordIndex.value = 0
    isRetry.value = false
    resetStep()
    return
  }
  finished.value = true
}

async function toggleFavorite() {
  if (!current.value) return
  await wordbook.toggleFavorite(current.value.id, 'manual')
}
</script>

<style scoped>
.learn {
  display: grid;
  gap: 14px;
}

.count {
  padding-top: 4px;
  color: var(--muted);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
}

.phase-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-top: -4px;
}

.phase-chip {
  padding: 7px 4px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  color: var(--muted);
  font-size: 10px;
  text-align: center;
}

.phase-chip.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-weight: 700;
}

.phase-chip.done {
  color: var(--success);
}

.done {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.done-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.word-sheet {
  display: grid;
  gap: 10px;
  margin-top: 2px;
}

.word-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.word-meta .icon-btn {
  margin-left: 0;
}

.step-btn {
  margin-left: auto;
  font-weight: 700;
}

.word-head {
  font-family: var(--font-word);
  font-size: 42px;
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.03em;
  overflow-wrap: anywhere;
}

.meaning-head {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.4;
}

.phonetic {
  color: var(--muted);
  font-size: 13px;
}

.option-list {
  display: grid;
  gap: 7px;
  padding-top: 4px;
}

.option-btn {
  min-height: 44px;
  padding: 9px 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
  color: var(--ink);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}

.option-btn:hover:not(:disabled) {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.option-btn:disabled {
  cursor: default;
}

.option-btn.correct {
  border-color: var(--success);
  background: color-mix(in srgb, var(--success) 12%, var(--surface));
  color: var(--success);
  font-weight: 600;
}

.option-btn.wrong {
  border-color: var(--danger);
  background: color-mix(in srgb, var(--danger) 10%, var(--surface));
  color: var(--danger);
}

.spell-row {
  display: flex;
  gap: 7px;
}

.spell-row .input {
  flex: 1;
  min-width: 0;
}

.feedback {
  padding: 7px 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
}

.feedback.ok {
  border-color: var(--success);
  color: var(--success);
}

.feedback.wrong {
  border-color: var(--danger);
  color: var(--danger);
}

.reveal-word {
  font-family: var(--font-word);
  font-size: 30px;
  line-height: 1.1;
}

.reveal-word .sub-label {
  margin-right: 4px;
  color: var(--muted);
  font-size: 11px;
}

.hint {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}

@media (max-width: 380px) {
  .word-head {
    font-size: 34px;
  }

  .meaning-head {
    font-size: 21px;
  }

  .phase-chip {
    font-size: 9px;
  }
}
</style>
