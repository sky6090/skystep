<template>
  <AppShell>
    <div class="page writing">
      <header class="page-head">
        <div>
          <p class="eyebrow">practice</p>
          <h1 class="h1">练习</h1>
        </div>
        <span class="tag tag-accent">M3</span>
      </header>

      <div class="mode-tabs" role="tablist" aria-label="练习模式">
        <button
          v-for="item in modes"
          :key="item.value"
          class="mode-tab"
          :class="{ active: mode === item.value }"
          type="button"
          @click="switchMode(item.value)"
        >
          {{ item.label }}
        </button>
      </div>

      <section v-if="!libraryMode && !dailyArticle" class="empty card">
        <p class="empty-title">今天没有错词或今日收藏，练习为空。</p>
        <p class="muted small">
          去学新词或复习，把不认识的词、想留住的词收进来；每多一个，今日练习就多一组中英句子。
        </p>
        <div class="empty-actions">
          <RouterLink to="/learn" class="btn btn-primary">去学新词</RouterLink>
          <RouterLink to="/review" class="btn btn-ghost">去复习</RouterLink>
          <button class="btn btn-ghost" type="button" @click="showLibrary">去素材库</button>
        </div>
      </section>

      <template v-else>
      <section class="targets">
        <div class="spread">
          <span class="sub-label">今天的目标词</span>
          <span class="caption">
            {{ isDaily ? '今日错词 / 收藏练习' : `${sampleArticles.length} 篇素材` }}
          </span>
        </div>
        <div class="target-list">
          <span v-for="word in article.targetWords" :key="word" class="tag tag-accent">{{ word }}</span>
        </div>
      </section>

      <article class="card article-card">
        <div class="article-head">
          <div>
            <p class="eyebrow">{{ article.theme }}</p>
            <h2 class="h2">{{ article.title }}</h2>
          </div>
          <div class="article-actions">
            <button
              v-if="dailyArticle && !isDaily"
              class="btn btn-sm"
              type="button"
              @click="returnToDaily"
            >
              今日练习
            </button>
            <button class="btn btn-sm" type="button" @click="nextArticle">
              {{ isDaily ? '换素材' : '换一篇' }}
            </button>
          </div>
        </div>

        <label v-if="!isDaily" class="article-picker">
          <span class="sub-label">选文章</span>
          <select
            class="input article-select"
            :value="article.id"
            @change="selectArticle(($event.target as HTMLSelectElement).value)"
          >
            <option v-for="item in sampleArticles" :key="item.id" :value="item.id">
              {{ item.theme }} · {{ item.title }}
            </option>
          </select>
        </label>

        <p v-if="isDaily" class="daily-note">
          今日错词 / 今日收藏：{{ article.targetWords.length }} 个词，英译中 {{ article.sentences.length }} 句 + 中译英 {{ article.sentences.length }} 句。
        </p>

        <p class="article-hint">
          {{
            isDaily
              ? '每句后面括号里是这一句必须用上的词。先保证每句写完、目标词用上，再谈表达。'
              : mode === 'en-to-zh'
                ? '把每句英文译成中文。'
                : '把每句中文译成英文。'
          }}
        </p>

        <div class="sentence-list">
          <div v-for="(sentence, index) in article.sentences" :key="index" class="sentence">
            <div class="sentence-head">
              <span class="sentence-num">{{ index + 1 }}</span>
              <p class="source">{{ mode === 'en-to-zh' ? sentence.en : sentence.zh }}</p>
            </div>
            <textarea
              v-model="inputs[index]"
              class="input sentence-input"
              rows="2"
              :disabled="Boolean(result)"
              :placeholder="mode === 'en-to-zh' ? '在这里写中文翻译' : 'Write your English translation here'"
            />
          </div>
        </div>

        <button
          v-if="!result"
          class="btn btn-primary btn-block"
          type="button"
          :disabled="submitting || !hasAnyInput"
          @click="submit"
        >
          {{ submitting ? '正在批改…' : '提交批改' }}
        </button>
      </article>
      </template>

      <section v-if="result" class="result">
        <div v-if="ai.config.enabled && ai.hasKey" class="ai-bar">
          <button class="btn btn-sm" type="button" :disabled="aiRunning" @click="runAI">
            {{ aiRunning ? 'AI 批改中…' : 'AI 深度批改' }}
          </button>
          <span v-if="aiError" class="caption ai-error">{{ aiError }}</span>
        </div>

        <div class="score-card card">
          <div class="score-main">
            <span class="score-number">{{ result.score }}</span>
            <span class="score-unit">/ 100</span>
          </div>
          <p class="score-summary">{{ result.summary }}</p>

          <div class="dimensions">
            <div class="dimension">
              <span>{{ mode === 'en-to-zh' ? '目标词理解' : '目标词使用' }}</span>
              <div class="progress"><span :style="{ width: percent(result.dimensions.target, mode === 'en-to-zh' ? 40 : 30) }" /></div>
              <span class="dimension-value">{{ result.dimensions.target }}/{{ mode === 'en-to-zh' ? 40 : 30 }}</span>
            </div>
            <div class="dimension">
              <span>完整度</span>
              <div class="progress"><span :style="{ width: percent(result.dimensions.completeness, 30) }" /></div>
              <span class="dimension-value">{{ result.dimensions.completeness }}/30</span>
            </div>
            <div class="dimension">
              <span>格式</span>
              <div class="progress"><span :style="{ width: percent(result.dimensions.form, 20) }" /></div>
              <span class="dimension-value">{{ result.dimensions.form }}/20</span>
            </div>
            <div class="dimension">
              <span>表达</span>
              <div class="progress"><span :style="{ width: percent(result.dimensions.expression, mode === 'en-to-zh' ? 10 : 20) }" /></div>
              <span class="dimension-value">{{ result.dimensions.expression }}/{{ mode === 'en-to-zh' ? 10 : 20 }}</span>
            </div>
          </div>

          <div class="target-result">
            <span
              v-for="item in result.targetCoverage"
              :key="item.word"
              class="tag"
              :class="item.used ? 'tag-accent' : 'tag-danger'"
            >
              {{ item.word }} {{ item.used ? '✓' : '×' }}
            </span>
          </div>
        </div>

        <div class="sentence-feedback">
          <article v-for="feedback in result.sentences" :key="feedback.index" class="card feedback-card">
            <div class="feedback-head">
              <span class="sentence-num">{{ feedback.index + 1 }}</span>
              <span class="caption">本句 {{ feedback.score }}/100</span>
            </div>
            <p class="feedback-source">{{ feedback.source }}</p>
            <p class="feedback-user"><span class="sub-label">你的翻译</span>{{ feedback.user || '（空）' }}</p>
            <p class="feedback-ref"><span class="sub-label">参考</span>{{ feedback.reference }}</p>
            <ul v-if="feedback.issues.length" class="issue-list">
              <li v-for="issue in feedback.issues" :key="issue">{{ issue }}</li>
            </ul>
            <p v-else class="ok-line">这一句没有明显的格式问题。</p>
          </article>
        </div>

        <div class="paper-panel reference">
          <p class="sub-label">参考译文</p>
          <p class="reference-text">{{ referenceText }}</p>
        </div>

        <div class="result-actions">
          <button class="btn btn-primary" type="button" @click="reset">重写这一篇</button>
          <button class="btn" type="button" @click="nextArticle">换一篇</button>
        </div>
      </section>

      <section v-if="history.length" class="history">
        <div class="spread">
          <h2 class="h3">最近批改</h2>
          <span class="caption">{{ history.length }} 次</span>
        </div>
        <div class="history-list">
          <div v-for="item in history" :key="item.id" class="history-row">
            <span class="history-title">{{ item.title }}</span>
            <span class="caption">{{ item.mode === 'en-to-zh' ? '英译中' : '中译英' }} · {{ item.engine === 'ai' ? 'AI' : '规则' }}</span>
            <span class="history-score">{{ item.score }}</span>
          </div>
        </div>
      </section>

      <p class="footnote">
        每日练习句数 = 今日错词 + 今日收藏；每个词各 1 句英译中、1 句中译英。
        没有今日错词/收藏时练习为空；素材库仍可从练习页手动打开。
      </p>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import { db, type SubmissionRow } from '@/db/db'
import { sampleArticles, type WritingArticle } from '@/data/articles.sample'
import {
  dictionaryMap,
  entryToWord,
  loadDictionary,
} from '@/data/dictionary'
import { wordById, type WordEntry } from '@/data/words.sample'
import { buildDailyArticle } from '@/domain/dailyArticle'
import { AIError, correctWithAI } from '@/domain/ai'
import { startOfStudyDay, studyDayKey } from '@/domain/day'
import { evaluateWriting, type WritingMode, type WritingResult } from '@/domain/writing'
import { useAIStore } from '@/stores/ai'
import { useWordbookStore } from '@/stores/wordbook'

const modes: Array<{ value: WritingMode; label: string }> = [
  { value: 'en-to-zh', label: '每日练习 · 英译中' },
  { value: 'zh-to-en', label: '每日练习 · 中译英' },
]

const wordbook = useWordbookStore()
const ai = useAIStore()
const mode = ref<WritingMode>('en-to-zh')
const libraryArticle = ref<WritingArticle>(sampleArticles[0])
const dailyArticle = ref<WritingArticle | null>(null)
const article = ref<WritingArticle>(sampleArticles[0])
const libraryMode = ref(false)
const inputs = ref<string[]>(article.value.sentences.map(() => ''))
const result = ref<WritingResult | null>(null)
const submitting = ref(false)
const aiRunning = ref(false)
const aiError = ref('')
const history = ref<SubmissionRow[]>([])

const isDaily = computed(
  () => Boolean(dailyArticle.value) && article.value.id === dailyArticle.value?.id,
)
const hasAnyInput = computed(() => inputs.value.some((value) => value.trim().length > 0))
const referenceText = computed(() =>
  article.value.sentences
    .map((sentence) => (mode.value === 'en-to-zh' ? sentence.zh : sentence.en))
    .join(' '),
)

onMounted(async () => {
  await wordbook.load()
  await ai.load()

  const start = startOfStudyDay().getTime()
  const rows = wordbook.rows
  const wrong = rows
    .filter((row) => row.wrong && (row.lastWrongAt ?? 0) >= start)
    .sort((a, b) => (b.lastWrongAt ?? 0) - (a.lastWrongAt ?? 0))
  const favorites = rows
    .filter((row) => row.favorite && (row.favoritedAt ?? 0) >= start)
    .sort((a, b) => (b.favoritedAt ?? 0) - (a.favoritedAt ?? 0))

  const needsDictionary = rows.some((row) => !wordById.has(row.wordId))
  const dictionary = needsDictionary
    ? dictionaryMap(await loadDictionary())
    : null
  const resolveWord = (id: string): WordEntry | undefined => {
    const sample = wordById.get(id)
    if (sample) return sample
    const entry = dictionary?.get(id)
    return entry ? entryToWord(entry) : undefined
  }

  const seen = new Set<string>()
  const base = [...wrong, ...favorites]
    .map((row) => resolveWord(row.wordId))
    .filter((word): word is WordEntry => Boolean(word))
    .filter((word) => {
      if (seen.has(word.id)) return false
      seen.add(word.id)
      return true
    })

  const daily = base.length > 0 ? buildDailyArticle(base, studyDayKey()) : null
  dailyArticle.value = daily

  const targets = new Set(rows.filter((row) => row.favorite || row.wrong).map((row) => row.wordId))
  let best = sampleArticles[0]
  let bestScore = -1
  for (const candidate of sampleArticles) {
    const score = candidate.targetWords.filter((word) => targets.has(word)).length
    if (score > bestScore) {
      best = candidate
      bestScore = score
    }
  }
  libraryArticle.value = best
  article.value = dailyArticle.value ?? best
  inputs.value = article.value.sentences.map(() => '')
  await loadHistory()
})

async function loadHistory() {
  history.value = await db.submissions.orderBy('createdAt').reverse().limit(5).toArray()
}

function switchMode(next: WritingMode) {
  if (mode.value === next) return
  mode.value = next
  if (dailyArticle.value) {
    libraryMode.value = false
    article.value = dailyArticle.value
  } else if (!libraryMode.value) {
    article.value = libraryArticle.value
  }
  reset()
}

function showLibrary() {
  libraryMode.value = true
  mode.value = 'zh-to-en'
  article.value = libraryArticle.value
  reset()
}

function nextArticle() {
  if (isDaily.value) {
    libraryMode.value = true
    article.value = libraryArticle.value
    reset()
    return
  }
  const index = sampleArticles.findIndex((candidate) => candidate.id === article.value.id)
  const next = sampleArticles[(index + 1) % sampleArticles.length]
  libraryArticle.value = next
  article.value = next
  reset()
}

function returnToDaily() {
  if (!dailyArticle.value) return
  libraryMode.value = false
  article.value = dailyArticle.value
  reset()
}

function selectArticle(id: string) {
  const next = sampleArticles.find((candidate) => candidate.id === id)
  if (!next) return
  libraryArticle.value = next
  article.value = next
  reset()
}

function reset() {
  inputs.value = article.value.sentences.map(() => '')
  result.value = null
}

function percent(value: number, max: number) {
  return `${max > 0 ? Math.min(100, (value / max) * 100) : 0}%`
}

async function submit() {
  if (submitting.value) return
  submitting.value = true
  try {
    const evaluation = evaluateWriting({
      article: article.value,
      mode: mode.value,
      inputs: inputs.value,
    })
    result.value = evaluation

    const sourceText = article.value.sentences
      .map((sentence) => (mode.value === 'en-to-zh' ? sentence.en : sentence.zh))
      .join(' ')
    const userText = inputs.value.join(' ')

    await db.submissions.add({
      createdAt: Date.now(),
      mode: mode.value,
      articleId: article.value.id,
      title: article.value.title,
      targetWords: [...article.value.targetWords],
      sourceText,
      userText,
      result: evaluation,
      score: evaluation.score,
      engine: 'rule',
    })
    await loadHistory()
  } finally {
    submitting.value = false
  }
}

async function runAI() {
  if (!result.value || aiRunning.value) return
  aiRunning.value = true
  aiError.value = ''
  try {
    const aiResult = await correctWithAI(
      {
        article: article.value,
        mode: mode.value,
        inputs: inputs.value,
        fallback: result.value,
      },
      ai.config,
    )
    result.value = aiResult

    const sourceText = article.value.sentences
      .map((sentence) => (mode.value === 'en-to-zh' ? sentence.en : sentence.zh))
      .join(' ')
    await db.submissions.add({
      createdAt: Date.now(),
      mode: mode.value,
      articleId: article.value.id,
      title: article.value.title,
      targetWords: [...article.value.targetWords],
      sourceText,
      userText: inputs.value.join(' '),
      result: aiResult,
      score: aiResult.score,
      engine: 'ai',
    })
    await loadHistory()
  } catch (error) {
    aiError.value =
      error instanceof AIError
        ? error.message
        : 'AI 批改失败，规则结果仍然可用。'
  } finally {
    aiRunning.value = false
  }
}
</script>

<style scoped>
.writing {
  display: grid;
  gap: 14px;
}

.mode-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  padding: 3px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface-2);
}

.mode-tab {
  min-height: 40px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.mode-tab.active {
  background: var(--surface);
  color: var(--ink);
}

.targets {
  display: grid;
  gap: 5px;
  padding: 0 2px;
}

.sub-label {
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
}

.target-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.article-card {
  display: grid;
  gap: 12px;
}

.article-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.article-actions {
  display: flex;
  flex-shrink: 0;
  gap: 6px;
}

.article-hint {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.55;
}

.article-picker {
  display: grid;
  gap: 4px;
}

.article-select {
  min-height: 38px;
  padding: 0 8px;
  font-size: 12px;
}

.daily-note {
  padding: 7px 10px;
  border: 1px solid var(--accent);
  border-radius: 9px;
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 11px;
  line-height: 1.5;
}

.sentence-list {
  display: grid;
  gap: 10px;
}

.sentence {
  display: grid;
  gap: 6px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
}

.sentence:first-child {
  padding-top: 0;
  border-top: 0;
}

.sentence-head {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.sentence-num {
  display: grid;
  width: 20px;
  height: 20px;
  flex: none;
  place-items: center;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 10px;
  font-weight: 700;
}

.source {
  font-family: var(--font-serif);
  font-size: 16px;
  line-height: 1.55;
}

.sentence-input {
  min-height: 62px;
  padding: 9px 11px;
  font-size: 14px;
  line-height: 1.55;
  resize: vertical;
}

.result {
  display: grid;
  gap: 12px;
}

.ai-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.ai-error {
  color: var(--danger);
}

.score-card {
  display: grid;
  gap: 10px;
}

.score-main {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.score-number {
  font-family: var(--font-word);
  font-size: 52px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
}

.score-unit {
  color: var(--muted);
  font-size: 14px;
}

.score-summary {
  color: var(--ink-2);
  font-size: 13px;
  line-height: 1.6;
}

.dimensions {
  display: grid;
  gap: 7px;
}

.dimension {
  display: grid;
  grid-template-columns: 82px 1fr 38px;
  align-items: center;
  gap: 8px;
  color: var(--ink-2);
  font-size: 11px;
}

.dimension-value {
  color: var(--muted);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.target-result {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding-top: 4px;
}

.tag-danger {
  border-color: var(--danger);
  color: var(--danger);
}

.sentence-feedback {
  display: grid;
  gap: 8px;
}

.feedback-card {
  display: grid;
  gap: 5px;
  padding: 14px 16px;
}

.feedback-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.feedback-source {
  font-family: var(--font-serif);
  font-size: 14px;
  line-height: 1.5;
}

.feedback-user,
.feedback-ref {
  color: var(--ink-2);
  font-size: 12px;
  line-height: 1.55;
}

.feedback-user .sub-label,
.feedback-ref .sub-label {
  margin-right: 6px;
}

.issue-list {
  display: grid;
  gap: 2px;
  margin: 2px 0 0;
  padding-left: 16px;
  color: var(--danger);
  font-size: 12px;
  line-height: 1.5;
}

.ok-line {
  color: var(--success);
  font-size: 12px;
}

.reference {
  display: grid;
  gap: 6px;
}

.reference-text {
  font-family: var(--font-serif);
  font-size: 15px;
  line-height: 1.65;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.history {
  display: grid;
  gap: 8px;
  padding-top: 4px;
}

.history-list {
  display: grid;
  gap: 1px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
  overflow: hidden;
}

.history-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-top: 1px solid var(--line);
}

.history-row:first-child {
  border-top: 0;
}

.history-title {
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-score {
  color: var(--accent-strong);
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.empty-actions {
  display: flex;
  gap: 8px;
}

.footnote {
  padding: 2px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}
</style>
