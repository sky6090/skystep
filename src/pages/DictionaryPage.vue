<template>
  <AppShell>
    <div class="page dictionary">
      <header class="page-head">
        <div>
          <p class="eyebrow">look it up</p>
          <h1 class="h1">词典</h1>
        </div>
        <span class="count">{{ loading ? '加载中' : `${entries.length} 个词` }}</span>
      </header>

      <label class="search">
        <span class="sr-only">搜索单词或中文释义</span>
        <input
          v-model="query"
          class="input"
          type="search"
          placeholder="查单词，或输入中文，比如「能力」"
          autocomplete="off"
        />
      </label>

      <p v-if="loading" class="hint">正在加载 18,000 词库…</p>
      <p v-else-if="error" class="hint error">{{ error }}</p>
      <p v-else-if="!query.trim()" class="hint">先看看高频词；也可以直接输入中文反查。</p>
      <p v-else class="hint">找到 {{ results.length }} 个结果。</p>

      <p v-if="status" class="status">{{ status }}</p>

      <div v-if="loading" class="empty card">
        <p class="empty-title">词典正在搬进来。</p>
        <p class="muted small">第一次打开会加载约 1.4 MB 的 CET-6 词条，之后会缓存。</p>
      </div>

      <div v-else-if="results.length === 0" class="empty card">
        <p class="empty-title">没找到。</p>
        <p class="muted small">试试词根、中文释义，或者换一个拼写。</p>
      </div>

      <div v-else class="results">
        <article v-for="entry in results" :key="entry.id" class="entry">
          <div class="entry-head">
            <div>
              <h2 class="entry-word">{{ entry.w }}</h2>
              <p class="phonetic">{{ entry.p }}</p>
            </div>
            <div class="entry-actions">
              <button
                class="icon-btn small"
                type="button"
                :aria-label="wordbook.isFavorite(entry.id) ? '取消收藏' : '收藏'"
                @click="toggleFavorite(entry)"
              >
                {{ wordbook.isFavorite(entry.id) ? '★' : '☆' }}
              </button>
            </div>
          </div>

          <div class="entry-meta">
            <span class="tag tag-accent">{{ entry.tag }}</span>
            <span class="tag">{{ entry.pos }}</span>
          </div>

          <p class="entry-meaning">{{ entry.t }}</p>

          <div v-if="entry.forms?.length" class="subsection">
            <span class="sub-label">词形</span>
            <div class="forms-row">
              <span v-for="form in entry.forms" :key="form" class="tag">{{ form }}</span>
            </div>
          </div>

          <div v-if="entry.ex" class="paper-panel example-panel">
            <p class="example">{{ entry.ex }}</p>
            <p class="example-zh">{{ entry.exZh }}</p>
          </div>

          <div v-if="entry.phr.length" class="subsection">
            <span class="sub-label">短语</span>
            <ul class="plain-list">
              <li v-for="phrase in entry.phr" :key="phrase">{{ phrase }}</li>
            </ul>
          </div>

          <p v-if="entry.syn.length" class="syn">
            <span class="sub-label">近义</span>
            {{ entry.syn.join(' · ') }}
          </p>

          <p v-if="relationsFor(entry.id)?.syn.length" class="syn">
            <span class="sub-label">近义</span>
            {{ relationsFor(entry.id)?.syn.join(' · ') }}
          </p>
          <p v-if="relationsFor(entry.id)?.ant.length" class="ant">
            <span class="sub-label">反义</span>
            {{ relationsFor(entry.id)?.ant.join(' · ') }}
          </p>

          <div class="entry-foot">
            <button class="btn btn-sm" type="button" @click="toggleFavorite(entry)">
              {{ wordbook.isFavorite(entry.id) ? '取消收藏' : '收藏' }}
            </button>
            <button class="btn btn-primary btn-sm" type="button" @click="addToReview(entry)">
              加入复习
            </button>
          </div>
        </article>
      </div>

      <p class="footnote">
        词库 18,000 条，来源 ECDICT（MIT）；词形变化已显示，例句和短语后续补。
      </p>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import { db } from '@/db/db'
import { sampleWords, wordById } from '@/data/words.sample'
import { relationsFor } from '@/data/relations'
import {
  loadDictionary,
  searchDictionary,
  type DictionaryEntry,
} from '@/data/dictionary'
import { createNewCard } from '@/domain/fsrs'
import { useSessionStore } from '@/stores/session'
import { useWordbookStore } from '@/stores/wordbook'

const session = useSessionStore()
const wordbook = useWordbookStore()

const entries = ref<DictionaryEntry[]>([])
const loading = ref(true)
const error = ref('')
const query = ref('')
const status = ref('')

const results = computed(() => searchDictionary(entries.value, query.value, 20))

onMounted(async () => {
  await wordbook.load()
  try {
    const loaded = await loadDictionary()
    entries.value = loaded.map((entry) => {
      const sample = wordById.get(entry.id)
      if (!sample) return entry
      return {
        ...entry,
        ex: entry.ex || sample.example,
        exZh: entry.exZh || sample.exampleZh,
      }
    })
  } catch {
    error.value = '词库加载失败，先改用示例词。'
    entries.value = sampleWords.map((word) => ({
      id: word.id,
      w: word.word,
      p: word.phonetic,
      t: word.meaning,
      pos: word.pos,
      ex: word.example,
      exZh: word.exampleZh,
      phr: [],
      syn: [],
      forms: word.forms ?? [],
      rank: 0,
      tag: 'CET-6',
    }))
  } finally {
    loading.value = false
  }
})

async function toggleFavorite(entry: DictionaryEntry) {
  await wordbook.toggleFavorite(entry.id, 'dictionary')
  status.value = wordbook.isFavorite(entry.id)
    ? `已收藏 ${entry.w}`
    : `已取消收藏 ${entry.w}`
}

async function addToReview(entry: DictionaryEntry) {
  const existing = await db.cards.get(entry.id)
  if (existing) {
    status.value = `${entry.w} 已经在复习队列里`
    return
  }
  const card = await createNewCard()
  const now = Date.now()
  await db.cards.put({
    wordId: entry.id,
    dueAt: now,
    state: card.state,
    card,
    createdAt: now,
    updatedAt: now,
    origin: 'dictionary',
  })
  await session.refresh()
  status.value = `${entry.w} 已加入复习`
}
</script>

<style scoped>
.dictionary {
  display: grid;
  gap: 12px;
}

.count {
  padding-top: 4px;
  color: var(--muted);
  font-size: 12px;
}

.search {
  display: block;
}

.hint {
  padding: 0 2px;
  color: var(--muted);
  font-size: 12px;
}

.hint.error {
  color: var(--danger);
}

.status {
  padding: 8px 12px;
  border: 1px solid var(--accent);
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 12px;
}

.results {
  display: grid;
  gap: 10px;
}

.entry {
  display: grid;
  gap: 6px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
}

.entry-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.entry-word {
  font-family: var(--font-word);
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.entry-actions {
  display: flex;
  flex: none;
  gap: 5px;
}

.icon-btn.small {
  width: 32px;
  height: 32px;
  font-size: 15px;
}

.entry-meta {
  display: flex;
  gap: 5px;
}

.entry-meaning {
  color: var(--ink-2);
  font-size: 15px;
  line-height: 1.6;
}

.example-panel {
  margin-top: 2px;
  padding: 14px 16px;
}

.subsection {
  display: grid;
  gap: 3px;
  padding-top: 4px;
}

.sub-label {
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
}

.forms-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.plain-list {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--ink-2);
  font-size: 12px;
  line-height: 1.55;
}

.syn {
  color: var(--ink-2);
  font-size: 12px;
}

.ant {
  color: var(--ink-2);
  font-size: 12px;
}

.entry-foot {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.empty {
  display: grid;
  gap: 8px;
  padding: 28px 20px;
}

.empty-title {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 600;
}

.footnote {
  padding: 4px 2px 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}
</style>
