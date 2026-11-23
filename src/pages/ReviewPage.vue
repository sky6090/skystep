<template>
  <AppShell>
    <div class="page review">
      <header class="page-head">
        <div>
          <p class="eyebrow">due today</p>
          <h1 class="h1">复习</h1>
        </div>
        <span class="count">{{ index }} / {{ queue.length }}</span>
      </header>

      <div class="mode-tabs" role="tablist" aria-label="复习方式">
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
        <p class="eyebrow">cleared</p>
        <h2 class="h2">今天的到期卡清完了。</h2>
        <p class="muted small">
          {{
            queue.length === 0
              ? '现在没有到期的词，去学几个新的。'
              : hadAgain
                ? '错词会在 1 分钟后回到队列。'
                : '复习完成。'
          }}
        </p>
        <div class="done-actions">
          <RouterLink to="/learn" class="btn btn-primary">去学新词</RouterLink>
          <RouterLink to="/" class="btn btn-ghost">回首页</RouterLink>
        </div>
      </section>

      <template v-else-if="current">
        <article class="word-sheet card">
          <div class="word-meta">
            <span class="tag tag-accent">复习</span>
            <span class="tag">{{ current.word.pos }}</span>
            <button
              class="icon-btn"
              type="button"
              :aria-label="wordbook.isFavorite(current.word.id) ? '取消收藏' : '收藏'"
              @click="toggleFavorite"
            >
              {{ wordbook.isFavorite(current.word.id) ? '★' : '☆' }}
            </button>
          </div>

          <template v-if="mode === 'en-to-zh'">
            <h2 class="word-head">{{ current.word.word }}</h2>
            <p class="phonetic">{{ current.word.phonetic }}</p>
            <div v-if="!revealed" class="recall paper-panel">
              <p class="example">先回想一下它的意思。</p>
            </div>
            <template v-else>
              <div class="meaning">
                <span class="pos">{{ current.word.pos }}</span>
                <span>{{ current.word.meaning }}</span>
              </div>
              <p v-if="current.word.forms?.length" class="forms-line">
                <span class="sub-label">词形</span> {{ current.word.forms.join(' · ') }}
              </p>
              <p v-if="relationsFor(current.word.id)" class="relations-line">
                <span class="sub-label">近义</span>
                {{ relationsFor(current.word.id)?.syn.join(' · ') }}
                <span class="relation-sep">/</span>
                <span class="sub-label">反义</span>
                {{ relationsFor(current.word.id)?.ant.join(' · ') }}
              </p>
              <div v-if="current.word.example" class="paper-panel example-panel">
                <p class="example">{{ current.word.example }}</p>
                <p class="example-zh">{{ current.word.exampleZh }}</p>
              </div>
            </template>
          </template>

          <template v-else-if="mode === 'zh-to-en'">
            <p class="eyebrow">中文 → 英文</p>
            <h2 class="meaning-head">{{ current.word.meaning }}</h2>
            <div v-if="!revealed" class="recall paper-panel">
              <p class="example">先回忆英文，再显示答案。</p>
            </div>
            <template v-else>
              <h2 class="word-head">{{ current.word.word }}</h2>
              <p class="phonetic">{{ current.word.phonetic }}</p>
              <p v-if="current.word.forms?.length" class="forms-line">
                <span class="sub-label">词形</span> {{ current.word.forms.join(' · ') }}
              </p>
              <p v-if="relationsFor(current.word.id)" class="relations-line">
                <span class="sub-label">近义</span>
                {{ relationsFor(current.word.id)?.syn.join(' · ') }}
                <span class="relation-sep">/</span>
                <span class="sub-label">反义</span>
                {{ relationsFor(current.word.id)?.ant.join(' · ') }}
              </p>
              <div v-if="current.word.example" class="paper-panel example-panel">
                <p class="example">{{ current.word.example }}</p>
                <p class="example-zh">{{ current.word.exampleZh }}</p>
              </div>
            </template>
          </template>

          <template v-else>
            <p class="eyebrow">拼写</p>
            <h2 class="meaning-head">{{ current.word.meaning }}</h2>
            <p class="phonetic">{{ current.word.phonetic }}</p>
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
            <p v-if="spellingResult === 'correct'" class="spell-feedback correct">
              拼写正确。
            </p>
            <p v-else-if="spellingResult === 'wrong'" class="spell-feedback wrong">
              正确拼写是 <strong>{{ current.word.word }}</strong>。
            </p>
            <template v-if="revealed">
              <h2 class="word-head">{{ current.word.word }}</h2>
              <p v-if="current.word.forms?.length" class="forms-line">
                <span class="sub-label">词形</span> {{ current.word.forms.join(' · ') }}
              </p>
              <p v-if="relationsFor(current.word.id)" class="relations-line">
                <span class="sub-label">近义</span>
                {{ relationsFor(current.word.id)?.syn.join(' · ') }}
                <span class="relation-sep">/</span>
                <span class="sub-label">反义</span>
                {{ relationsFor(current.word.id)?.ant.join(' · ') }}
              </p>
              <div v-if="current.word.example" class="paper-panel example-panel">
                <p class="example">{{ current.word.example }}</p>
                <p class="example-zh">{{ current.word.exampleZh }}</p>
              </div>
            </template>
          </template>
        </article>

        <button
          v-if="!canRate && mode !== 'spelling'"
          class="btn btn-primary btn-block"
          type="button"
          @click="revealed = true"
        >
          {{ mode === 'zh-to-en' ? '显示英文' : '显示答案' }}
        </button>

        <div v-if="canRate" class="rating-row">
          <button class="btn rating again" type="button" :disabled="busy" @click="answer('again')">
            <strong>不认识</strong>
            <small>1 分钟后</small>
          </button>
          <button
            class="btn rating hard"
            type="button"
            :disabled="busy || (mode === 'spelling' && spellingResult === 'wrong')"
            @click="answer('hard')"
          >
            <strong>模糊</strong>
            <small>短一点</small>
          </button>
          <button
            class="btn rating good"
            type="button"
            :disabled="busy || (mode === 'spelling' && spellingResult === 'wrong')"
            @click="answer('good')"
          >
            <strong>认识</strong>
            <small>按 FSRS</small>
          </button>
        </div>
      </template>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import { db, type CardRow } from '@/db/db'
import {
  dictionaryMap,
  entryToWord,
  loadDictionary,
} from '@/data/dictionary'
import { wordById, type WordEntry } from '@/data/words.sample'
import { relationsFor } from '@/data/relations'
import { applyRating, Rating } from '@/domain/fsrs'
import { useSessionStore } from '@/stores/session'
import { useSettingsStore, type LearnMode } from '@/stores/settings'
import { useWordbookStore } from '@/stores/wordbook'

interface QueueItem {
  row: CardRow
  word: WordEntry
}

const session = useSessionStore()
const settings = useSettingsStore()
const wordbook = useWordbookStore()
const modes: Array<{ value: LearnMode; label: string }> = [
  { value: 'en-to-zh', label: '英 → 中' },
  { value: 'zh-to-en', label: '中 → 英' },
  { value: 'spelling', label: '拼写' },
]

const queue = ref<QueueItem[]>([])
const index = ref(0)
const revealed = ref(false)
const spellingInput = ref('')
const spellingResult = ref<'correct' | 'wrong' | null>(null)
const busy = ref(false)
const finished = ref(false)
const hadAgain = ref(false)

const current = computed(() => queue.value[index.value])
const mode = computed<LearnMode>(() => settings.profile.learnMode ?? 'en-to-zh')
const progressWidth = computed(() =>
  queue.value.length === 0 ? '0%' : `${Math.min(100, (index.value / queue.value.length) * 100)}%`,
)
const canRate = computed(() =>
  mode.value === 'spelling' ? spellingResult.value !== null : revealed.value,
)

onMounted(async () => {
  await settings.load()
  await wordbook.load()
  await load()
})

async function load() {
  await session.refresh()
  const rows = await db.cards.where('dueAt').belowOrEqual(Date.now()).toArray()
  const needsDictionary = rows.some((row) => !wordById.has(row.wordId))
  const dictionary = needsDictionary
    ? dictionaryMap(await loadDictionary())
    : new Map()

  queue.value = rows
    .map((row) => {
      const word = wordById.get(row.wordId)
      if (word) return { row, word }
      const entry = dictionary.get(row.wordId)
      return entry ? { row, word: entryToWord(entry) } : null
    })
    .filter((item): item is QueueItem => item !== null)
    .sort((a, b) => a.row.dueAt - b.row.dueAt)
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

function checkSpelling() {
  if (!current.value || !spellingInput.value.trim()) return
  const correct =
    spellingInput.value.trim().toLowerCase() === current.value.word.word.toLowerCase()
  spellingResult.value = correct ? 'correct' : 'wrong'
  revealed.value = true
}

async function answer(kind: 'again' | 'hard' | 'good') {
  if (busy.value || !current.value) return
  busy.value = true
  const item = current.value
  const spelledWrong = mode.value === 'spelling' && spellingResult.value === 'wrong'
  const effective = spelledWrong ? 'again' : kind
  const rating =
    effective === 'again' ? Rating.Again : effective === 'hard' ? Rating.Hard : Rating.Good
  const now = Date.now()
  if (effective === 'again') hadAgain.value = true

  try {
    const result = await applyRating(item.row.card, rating, new Date(now))
    const dueAt = effective === 'again' ? now + 60_000 : result.card.dueAt.getTime()

    await db.cards.update(item.row.wordId, {
      card: result.card,
      dueAt,
      state: result.card.state,
      updatedAt: now,
      sameDay: effective === 'again',
    })

    await db.reviewLogs.add({
      wordId: item.row.wordId,
      rating,
      kind: 'review',
      reviewedAt: now,
      dueAt,
      state: result.card.state,
      stability: result.card.stability,
      difficulty: result.card.difficulty,
      scheduledDays: result.card.scheduledDays,
    })

    await wordbook.ensure(item.row.wordId, 'manual')
    if (effective === 'again') await wordbook.markWrong(item.row.wordId, 'manual')

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
  await wordbook.toggleFavorite(current.value.word.id, 'manual')
}
</script>

<style scoped>
.review {
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

.recall {
  display: grid;
  gap: 14px;
  justify-items: start;
  margin-top: 4px;
}

.meaning-head {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.4;
}

.meaning {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding-top: 4px;
  font-size: 18px;
  line-height: 1.5;
}

.pos {
  flex: none;
  color: var(--accent-strong);
  font-size: 13px;
  font-style: italic;
  font-weight: 600;
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
  margin-top: 4px;
  padding: 16px 18px;
}

.rating-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.rating {
  display: grid;
  min-height: 64px;
  gap: 2px;
  place-content: center;
  padding: 8px;
  text-align: center;
}

.rating strong {
  font-size: 14px;
  font-weight: 650;
}

.rating small {
  color: var(--muted);
  font-size: 10px;
}

.rating.again {
  color: var(--danger);
}

.rating.good {
  border-color: var(--accent);
  background: var(--accent-soft);
}

@media (max-width: 380px) {
  .meaning-head {
    font-size: 21px;
  }
}
</style>
