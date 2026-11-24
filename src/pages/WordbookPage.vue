<template>
  <AppShell>
    <div class="page wordbook">
      <header class="page-head">
        <div>
          <p class="eyebrow">card box</p>
          <h1 class="h1">单词本</h1>
        </div>
        <span class="count">{{ wordbook.rows.length }} 个词</span>
      </header>

      <div class="tabs" role="tablist" aria-label="单词本分类">
        <button
          v-for="item in tabs"
          :key="item.key"
          class="tab"
          :class="{ active: tab === item.key }"
          type="button"
          @click="tab = item.key"
        >
          {{ item.label }}
          <span class="tab-count">{{ counts[item.key] }}</span>
        </button>
      </div>

      <label class="search">
        <span class="sr-only">搜索单词本</span>
        <input v-model="query" class="input" type="search" placeholder="搜索单词、释义或笔记" />
      </label>

      <div class="filters" role="group" aria-label="筛选单词本">
        <button
          v-for="item in filters"
          :key="item.key"
          class="filter-chip"
          :class="{ active: filter === item.key }"
          type="button"
          @click="filter = item.key"
        >
          {{ item.label }}
        </button>
      </div>

      <section v-if="items.length === 0" class="empty card">
        <p class="empty-title">{{ emptyText.title }}</p>
        <p class="muted small">{{ emptyText.desc }}</p>
        <RouterLink v-if="tab === 'favorite'" to="/learn" class="btn btn-primary">去学新词</RouterLink>
        <RouterLink v-else-if="tab === 'wrong'" to="/review" class="btn btn-primary">去复习</RouterLink>
      </section>

      <div v-else class="card-box">
        <article v-for="item in items" :key="item.row.wordId" class="word-card">
          <div class="word-card-top">
            <h2 class="word-name">{{ item.word.word }}</h2>
            <div class="card-actions">
              <button
                class="icon-btn small"
                type="button"
                :aria-label="item.row.favorite ? '取消收藏' : '收藏'"
                @click="toggleFavorite(item.row)"
              >
                {{ item.row.favorite ? '★' : '☆' }}
              </button>
              <button
                v-if="!item.row.learned && !item.row.wrong"
                class="icon-btn small"
                type="button"
                aria-label="标记已学会"
                @click="toggleLearned(item.row)"
              >
                ○
              </button>
            </div>
          </div>
          <p class="phonetic">{{ item.word.phonetic }}</p>
          <p class="word-meaning">{{ item.word.meaning }}</p>

          <div class="word-card-foot">
            <span class="tag">{{ sourceLabel(item.row.source) }}</span>
            <span v-if="item.row.wrong" class="tag tag-danger">错 {{ item.row.wrongCount }}</span>
            <span v-if="item.row.learned" class="caption">已学会</span>
            <span v-else class="caption">学习中</span>
          </div>

          <details class="note">
            <summary>笔记{{ item.row.note ? ' · 已写' : '' }}</summary>
            <textarea
              class="input note-input"
              rows="2"
              :value="item.row.note"
              placeholder="写一句自己的记法，或记下易混词"
              @change="onNote(item.row, $event)"
            />
          </details>
        </article>
      </div>

      <p class="footnote">
        M2：收藏 / 已学会 / 错词 / 自定义。已学会的 30 天抽检会在后续接上。
      </p>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import { db, type WordbookRow } from '@/db/db'
import { wordById, type WordEntry } from '@/data/words.sample'
import {
  dictionaryMap,
  entryToWord,
  loadDictionary,
  type DictionaryEntry,
} from '@/data/dictionary'
import { startOfStudyDay } from '@/domain/day'
import { useSessionStore } from '@/stores/session'
import { useWordbookStore } from '@/stores/wordbook'

type TabKey = 'favorite' | 'learned' | 'wrong' | 'custom'
type FilterKey = 'all' | 'today' | 'wrongToday' | 'noted'

const wordbook = useWordbookStore()
const session = useSessionStore()
const dictionary = ref<DictionaryEntry[]>([])
const dictMap = ref(new Map<string, DictionaryEntry>())
const tab = ref<TabKey>('favorite')
const filter = ref<FilterKey>('all')
const query = ref('')
const filters: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'today', label: '今日学习' },
  { key: 'wrongToday', label: '今日错词' },
  { key: 'noted', label: '有笔记' },
]

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'favorite', label: '收藏' },
  { key: 'learned', label: '已学会' },
  { key: 'wrong', label: '错词' },
  { key: 'custom', label: '自定义' },
]

const counts = computed<Record<TabKey, number>>(() => ({
  favorite: wordbook.rows.filter((row) => row.favorite).length,
  learned: wordbook.rows.filter((row) => row.learned).length,
  wrong: wordbook.rows.filter((row) => row.wrong).length,
  custom: wordbook.rows.filter((row) => row.source === 'custom').length,
}))

const items = computed(() => {
  const list = wordbook.rows
    .filter((row) => matchesTab(row))
    .filter((row) => matchesFilter(row))
    .filter((row) => matchesQuery(row))
    .map((row) => ({ row, word: wordFor(row) }))
    .filter((item): item is { row: WordbookRow; word: WordEntry } => item.word !== null)

  if (tab.value === 'wrong') {
    list.sort(
      (a, b) =>
        (b.row.wrongCount ?? 0) - (a.row.wrongCount ?? 0) ||
        (b.row.lastWrongAt ?? 0) - (a.row.lastWrongAt ?? 0),
    )
  } else if (tab.value === 'favorite') {
    list.sort(
      (a, b) =>
        (b.row.favoritedAt ?? b.row.updatedAt) -
        (a.row.favoritedAt ?? a.row.updatedAt),
    )
  } else if (tab.value === 'learned') {
    list.sort(
      (a, b) =>
        (b.row.learnedAt ?? b.row.updatedAt) -
        (a.row.learnedAt ?? a.row.updatedAt),
    )
  } else {
    list.sort((a, b) => b.row.updatedAt - a.row.updatedAt)
  }
  return list
})

const emptyText = computed(() => {
  if (query.value.trim() || filter.value !== 'all') {
    return { title: '没有符合条件的词。', desc: '换一个关键词，或切回「全部」。' }
  }
  if (tab.value === 'favorite') {
    return { title: '收藏册还是空的。', desc: '学新词或查词典时点一下 ☆，词就会落进来。' }
  }
  if (tab.value === 'learned') {
    return { title: '还没有标记已学会的词。', desc: '在卡片上点 ○，它就会进这里。' }
  }
  if (tab.value === 'wrong') {
    return { title: '还没有错词。', desc: '复习时点「不认识」，词会自动进错词。' }
  }
  return { title: '自定义词还没上线。', desc: 'M7 会支持导入自己的词表。' }
})

onMounted(async () => {
  await wordbook.load()
  await backfillLegacyLearned()
  try {
    dictionary.value = await loadDictionary()
    dictMap.value = dictionaryMap(dictionary.value)
  } catch {
    dictionary.value = []
  }
})

async function backfillLegacyLearned() {
  const migration = await db.settings.get('learnedBackfillV1')
  if (migration?.value) return
  for (const card of await db.cards.toArray()) {
    const row = wordbook.get(card.wordId)
    if (row && !row.learned && !row.wrong) {
      await wordbook.markLearned(card.wordId, row.source)
    }
  }
  await db.settings.put({ key: 'learnedBackfillV1', value: true })
}

function wordFor(row: WordbookRow): WordEntry | null {
  const sample = wordById.get(row.wordId)
  if (sample) return sample
  const entry = dictMap.value.get(row.wordId)
  return entry ? entryToWord(entry) : null
}

function matchesTab(row: WordbookRow) {
  if (tab.value === 'favorite') return row.favorite
  if (tab.value === 'learned') return row.learned
  if (tab.value === 'wrong') return Boolean(row.wrong)
  return row.source === 'custom'
}

function matchesFilter(row: WordbookRow) {
  const start = startOfStudyDay().getTime()
  if (filter.value === 'today') return row.createdAt >= start
  if (filter.value === 'wrongToday') {
    return Boolean(row.wrong) && (row.lastWrongAt ?? 0) >= start
  }
  if (filter.value === 'noted') return row.note.trim().length > 0
  return true
}

function matchesQuery(row: WordbookRow) {
  const q = query.value.trim().toLowerCase()
  if (!q) return true
  const word = wordFor(row)
  return Boolean(
    word &&
      (word.word.toLowerCase().includes(q) ||
        word.meaning.toLowerCase().includes(q) ||
        row.note.toLowerCase().includes(q)),
  )
}

async function toggleFavorite(row: WordbookRow) {
  await wordbook.toggleFavorite(row.wordId, row.source)
}

async function toggleLearned(row: WordbookRow) {
  if (row.learned) {
    await wordbook.unmarkLearned(row.wordId)
    await db.cards.update(row.wordId, { dueAt: Date.now(), updatedAt: Date.now() })
  } else {
    await wordbook.markLearned(row.wordId, row.source)
    // M2 approximation of the 30-day verification: suspend the card for 30 days.
    await db.cards.update(row.wordId, {
      dueAt: Date.now() + 30 * 86_400_000,
      updatedAt: Date.now(),
    })
  }
  await session.refresh()
}

async function onNote(row: WordbookRow, event: Event) {
  const value = (event.target as HTMLTextAreaElement).value
  await wordbook.saveNote(row.wordId, value, row.source)
}

function sourceLabel(source: WordbookRow['source']) {
  if (source === 'dictionary') return '词典'
  if (source === 'practice') return '习题'
  if (source === 'reading') return '阅读'
  if (source === 'custom') return '自定义'
  return '手动'
}
</script>

<style scoped>
.wordbook {
  display: grid;
  gap: 14px;
}

.count {
  padding-top: 4px;
  color: var(--muted);
  font-size: 13px;
}

.tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface-2);
}

.tab {
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 10px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.tab.active {
  background: var(--surface);
  color: var(--ink);
}

.tab-count {
  color: var(--muted);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.search {
  display: block;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.filter-chip {
  padding: 4px 9px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface);
  color: var(--muted);
  font-size: 11px;
  cursor: pointer;
}

.filter-chip.active {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-weight: 600;
}

.empty {
  display: grid;
  justify-items: start;
  gap: 10px;
  padding: 28px 20px;
}

.empty-title {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 600;
}

.card-box {
  display: grid;
  gap: 10px;
}

.word-card {
  display: grid;
  gap: 3px;
  padding: 15px 16px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
}

.word-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.word-name {
  font-family: var(--font-word);
  font-size: 24px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.card-actions {
  display: flex;
  gap: 5px;
  flex: none;
}

.icon-btn.small {
  width: 32px;
  height: 32px;
  font-size: 15px;
}

.word-meaning {
  color: var(--ink-2);
  font-size: 14px;
  line-height: 1.55;
}

.word-card-foot {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.tag-danger {
  border-color: var(--danger);
  color: var(--danger);
}

.note {
  margin-top: 6px;
  border-top: 1px solid var(--line);
  padding-top: 6px;
}

.note summary {
  color: var(--muted);
  font-size: 12px;
  cursor: pointer;
}

.note-input {
  margin-top: 6px;
  min-height: 64px;
  padding: 8px 10px;
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;
}

.footnote {
  padding: 2px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}

@media (min-width: 720px) {
  .card-box {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
