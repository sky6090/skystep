<template>
  <AppShell>
    <div class="page learn">
      <header class="page-head">
        <div>
          <p class="eyebrow">today's new words</p>
          <h1 class="h1">学新词</h1>
        </div>
        <span class="count">{{ index }} / {{ queue.length }}</span>
      </header>

      <div class="mode-tabs" role="tablist" aria-label="学新词方式">
        <button
          v-for="item in modes"
          :key="item.value"
          class="mode-tab"
          :class="{ active: mode === item.value }"
          type="button"
          @click="setMode(item.value)"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="progress" aria-hidden="true">
        <span :style="{ width: progressWidth }" />
      </div>

      <section v-if="finished" class="done card">
        <p class="eyebrow">done</p>
        <h2 class="h2">今天的新词学完了。</h2>
        <p class="muted small">
          认识的词会在 3 天后再出现；不认识的词今天晚些时候再练一次。
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
          </div>

          <template v-if="mode === 'en-to-zh'">
            <h2 class="word-head">{{ current.word }}</h2>
            <p class="phonetic">{{ current.phonetic }}</p>
            <div v-if="revealed" class="meaning">
              <span class="pos">{{ current.pos }}</span>
              <span>{{ current.meaning }}</span>
            </div>
            <div v-else class="prompt-box">先想中文意思，再显示答案。</div>
          </template>

          <template v-else-if="mode === 'zh-to-en'">
            <p class="eyebrow">中文 → 英文</p>
            <h2 class="meaning-head">{{ current.meaning }}</h2>
            <div v-if="revealed" class="meaning">
              <span class="word-reveal">{{ current.word }}</span>
              <span class="phonetic">{{ current.phonetic }}</span>
            </div>
            <div v-else class="prompt-box">先回忆英文，再显示答案。</div>
          </template>

          <template v-else>
            <p class="eyebrow">拼写</p>
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
                :disabled="spellingResult !== null"
                @keyup.enter="checkSpelling"
              />
              <button
                class="btn btn-primary"
                type="button"
                :disabled="!spellingInput.trim() || spellingResult !== null"
                @click="checkSpelling"
              >
                检查
              </button>
            </div>
            <p
              v-if="spellingResult === 'correct'"
              class="spell-feedback correct"
            >
              拼写正确。
            </p>
            <p v-else-if="spellingResult === 'wrong'" class="spell-feedback wrong">
              正确拼写是 <strong>{{ current.word }}</strong>。
            </p>
          </template>

          <p v-if="revealed && current.forms?.length" class="forms-line">
            <span class="sub-label">词形</span> {{ current.forms.join(' · ') }}
          </p>

          <p v-if="revealed && relationsFor(current.id)" class="relations-line">
            <span class="sub-label">近义</span>
            {{ relationsFor(current.id)?.syn.join(' · ') }}
            <span class="relation-sep">/</span>
            <span class="sub-label">反义</span>
            {{ relationsFor(current.id)?.ant.join(' · ') }}
          </p>

          <div v-if="revealed && current.example" class="paper-panel example-panel">
            <p class="example">{{ current.example }}</p>
            <p class="example-zh">{{ current.exampleZh }}</p>
          </div>
        </article>

        <p class="hint">
          {{
            mode === 'spelling'
              ? '先拼，再自评；拼错也算一次“不认识”。'
              : '先回忆，再显示答案；认识 = 3 天后再见，不认识 = 今天再练一次。'
          }}
        </p>

        <button
          v-if="!canRate"
          class="btn btn-primary btn-block"
          type="button"
          :disabled="busy"
          @click="revealOrCheck"
        >
          {{ revealLabel }}
        </button>

        <div v-else class="answer-row">
          <button
            class="btn btn-ghost answer-unknown"
            type="button"
            :disabled="busy"
            @click="answer(false)"
          >
            不认识
          </button>
          <button
            class="btn btn-primary answer-known"
            type="button"
            :disabled="busy || (mode === 'spelling' && spellingResult === 'wrong')"
            @click="answer(true)"
          >
            认识
          </button>
        </div>
      </template>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import { db } from '@/db/db'
import { entryToWord, loadDictionary } from '@/data/dictionary'
import { relationsFor } from '@/data/relations'
import { sampleWords, type WordEntry } from '@/data/words.sample'
import { applyRating, createNewCard, Rating } from '@/domain/fsrs'
import { useSessionStore } from '@/stores/session'
import { useSettingsStore, type LearnMode } from '@/stores/settings'
import { useWordbookStore } from '@/stores/wordbook'

const settings = useSettingsStore()
const session = useSessionStore()
const wordbook = useWordbookStore()

const modes: Array<{ value: LearnMode; label: string }> = [
  { value: 'en-to-zh', label: '英 → 中' },
  { value: 'zh-to-en', label: '中 → 英' },
  { value: 'spelling', label: '拼写' },
]

const queue = ref<WordEntry[]>([])
const index = ref(0)
const busy = ref(false)
const finished = ref(false)
const revealed = ref(false)
const spellingInput = ref('')
const spellingResult = ref<'correct' | 'wrong' | null>(null)

const current = computed(() => queue.value[index.value])
const mode = computed<LearnMode>(() => settings.profile.learnMode ?? 'en-to-zh')
const progressWidth = computed(() =>
  queue.value.length === 0 ? '0%' : `${Math.min(100, (index.value / queue.value.length) * 100)}%`,
)
const canRate = computed(() =>
  mode.value === 'spelling' ? spellingResult.value !== null : revealed.value,
)
const revealLabel = computed(() =>
  mode.value === 'spelling'
    ? '检查拼写'
    : mode.value === 'zh-to-en'
      ? '显示英文'
      : '显示意思',
)

onMounted(async () => {
  await settings.load()
  await wordbook.load()
  await load()
})

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
    const examWords = entries.filter((entry) => entry.tag !== '高频')
    const commonWords = entries.filter((entry) => entry.tag === '高频')
    const extras = [...examWords, ...commonWords]
      .filter((entry) => !existing.has(entry.id) && !seen.has(entry.id))
      .slice(0, limit - seed.length)
      .map(entryToWord)
    queue.value = [...seed, ...extras]
  } else {
    queue.value = seed
  }

  finished.value = queue.value.length === 0
  resetCard()
}

function setMode(value: LearnMode) {
  if (mode.value === value) return
  settings.setLearnMode(value)
  resetCard()
}

function resetCard() {
  revealed.value = false
  spellingInput.value = ''
  spellingResult.value = null
}

function revealOrCheck() {
  if (mode.value === 'spelling') checkSpelling()
  else revealed.value = true
}

function checkSpelling() {
  if (!current.value || !spellingInput.value.trim()) return
  const correct =
    spellingInput.value.trim().toLowerCase() === current.value.word.toLowerCase()
  spellingResult.value = correct ? 'correct' : 'wrong'
  revealed.value = true
}

async function answer(known: boolean) {
  if (busy.value || !current.value) return
  busy.value = true
  const word = current.value
  const now = Date.now()
  const spelledWrong = mode.value === 'spelling' && spellingResult.value === 'wrong'
  const effectiveKnown = spelledWrong ? false : known
  const rating = effectiveKnown ? Rating.Good : Rating.Again

  try {
    const card = await createNewCard(new Date(now))
    const result = await applyRating(card, rating, new Date(now))
    const dueAt = effectiveKnown ? result.card.dueAt.getTime() : now

    await db.cards.put({
      wordId: word.id,
      dueAt,
      state: result.card.state,
      card: result.card,
      createdAt: now,
      updatedAt: now,
      sameDay: !effectiveKnown,
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
    if (!effectiveKnown) await wordbook.markWrong(word.id, 'manual')

    await session.refresh()
    index.value += 1
    resetCard()
    if (index.value >= queue.value.length) finished.value = true
  } finally {
    busy.value = false
  }
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

.mode-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  margin-top: -4px;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: var(--surface-2);
}

.mode-tab {
  min-height: 36px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

.mode-tab.active {
  background: var(--surface);
  color: var(--ink);
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
  margin-left: auto;
}

.word-head {
  font-family: var(--font-word);
  font-size: 40px;
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

.meaning {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding-top: 2px;
  font-size: 17px;
  line-height: 1.5;
}

.pos {
  flex: none;
  color: var(--accent-strong);
  font-size: 13px;
}

.word-reveal {
  font-family: var(--font-word);
  font-size: 32px;
  line-height: 1.1;
}

.prompt-box {
  padding: 18px 14px;
  border: 1px dashed var(--line);
  border-radius: 10px;
  background: var(--surface-2);
  color: var(--muted);
  font-size: 13px;
  text-align: center;
}

.spell-row {
  display: flex;
  gap: 7px;
}

.spell-row .input {
  flex: 1;
  min-width: 0;
}

.spell-feedback {
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
}

.spell-feedback.correct {
  border: 1px solid var(--success);
  color: var(--success);
}

.spell-feedback.wrong {
  border: 1px solid var(--danger);
  color: var(--danger);
}

.example-panel {
  display: grid;
  gap: 4px;
}

.example {
  font-family: var(--font-serif);
  font-size: 14px;
  line-height: 1.55;
}

.example-zh {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.5;
}

.hint {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}

.forms-line {
  color: var(--ink-2);
  font-size: 12px;
  line-height: 1.5;
}

.forms-line .sub-label {
  margin-right: 4px;
  color: var(--muted);
  font-weight: 600;
}

.relations-line {
  color: var(--ink-2);
  font-size: 12px;
  line-height: 1.6;
}

.relations-line .sub-label {
  margin-right: 3px;
  color: var(--muted);
  font-weight: 600;
}

.relation-sep {
  margin: 0 4px;
  color: var(--line);
}

.answer-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

@media (max-width: 380px) {
  .word-head {
    font-size: 34px;
  }

  .meaning-head {
    font-size: 21px;
  }
}
</style>
