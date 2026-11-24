<template>
  <AppShell>
    <div class="page writing-exam">
      <header class="page-head">
        <div>
          <p class="eyebrow">writing + translation</p>
          <h1 class="h1">写作 + 翻译模考</h1>
        </div>
        <span class="tag tag-accent">60 分钟</span>
      </header>

      <section v-if="!started" class="card intro">
        <p class="muted small">
          写作 30 分钟（150–200 词）+ 翻译 30 分钟。交卷后给字数、参考范文/译文和自评清单。
        </p>
        <button class="btn btn-primary btn-block" type="button" @click="start">开始</button>
        <RouterLink to="/practice" class="btn btn-ghost btn-block">回练习</RouterLink>
      </section>

      <template v-else-if="!submitted">
        <div class="exam-bar">
          <span class="timer">{{ formatTime(remaining) }}</span>
          <span class="answered">
            写作 {{ writingWords }} 词 · 翻译 {{ translationWords }} 词
          </span>
          <button class="btn btn-primary btn-sm" type="button" @click="submit">交卷</button>
        </div>

        <section class="card section">
          <div class="spread">
            <h2 class="h3">写作 · 30 分钟</h2>
            <span class="caption">{{ writingWords }} / 150–200 词</span>
          </div>
          <p class="instruction">{{ writingPrompt.instruction }}</p>
          <textarea
            v-model="writingText"
            class="input writing-area"
            rows="10"
            placeholder="Write your essay here."
          />
        </section>

        <section class="card section">
          <div class="spread">
            <h2 class="h3">翻译 · 30 分钟</h2>
            <span class="caption">{{ translationWords }} 词</span>
          </div>
          <p class="instruction">{{ translationPrompt.instruction }}</p>
          <p class="paper-panel source">{{ translationPrompt.source }}</p>
          <textarea
            v-model="translationText"
            class="input writing-area"
            rows="7"
            placeholder="Translate the passage into English."
          />
        </section>

        <button class="btn btn-primary btn-block" type="button" @click="submit">交卷</button>
      </template>

      <section v-else class="result">
        <div class="card score-card">
          <div class="score-main">
            <span class="score-number">{{ score }}</span>
            <span class="score-unit">/ 100</span>
          </div>
          <p class="muted small">
            写作 {{ writingWords }} 词 · 翻译 {{ translationWords}} 词 · 用时
            {{ formatTime(durationSec) }}
          </p>
          <div class="type-scores">
            <div class="type-score"><span>写作长度 / 任务</span><strong>{{ writingScore }} / 50</strong></div>
            <div class="type-score"><span>翻译长度 / 任务</span><strong>{{ translationScore }} / 50</strong></div>
          </div>
        </div>

        <section v-for="prompt in prompts" :key="prompt.id" class="card section">
          <h2 class="h3">{{ prompt.label }} · 自评清单</h2>
          <label v-for="(item, index) in prompt.checklist" :key="item" class="check-row">
            <input v-model="checks[prompt.id][index]" type="checkbox" />
            <span>{{ item }}</span>
          </label>
          <div class="paper-panel reference">
            <p class="sub-label">参考{{ prompt.id === 'writing' ? '范文' : '译文' }}</p>
            <p class="reference-text">{{ prompt.reference }}</p>
          </div>
        </section>

        <div class="result-actions">
          <button class="btn btn-primary" type="button" @click="reset">再做一次</button>
          <RouterLink to="/practice" class="btn">回练习</RouterLink>
        </div>
      </section>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import { db } from '@/db/db'
import { writingExam, type WritingExamPrompt } from '@/data/writingExam'
import { formatTime } from '@/domain/exam'

const prompts = writingExam.prompts
const writingPrompt = prompts.find((prompt) => prompt.id === 'writing') as WritingExamPrompt
const translationPrompt = prompts.find(
  (prompt) => prompt.id === 'translation',
) as WritingExamPrompt

const started = ref(false)
const submitted = ref(false)
const writingText = ref('')
const translationText = ref('')
const remaining = ref(writingExam.durationMin * 60)
const startedAt = ref(0)
const durationSec = ref(0)
let timer: number | undefined
const checks = ref<Record<string, boolean[]>>({
  writing: writingPrompt.checklist.map(() => false),
  translation: translationPrompt.checklist.map(() => false),
})

const countEnglish = (text: string) => text.trim().split(/\s+/).filter(Boolean).length
const writingWords = computed(() => countEnglish(writingText.value))
const translationWords = computed(() => countEnglish(translationText.value))

onMounted(() => {
  // The timer starts only after the user presses Start.
})

onBeforeUnmount(stopTimer)

function bandScore(count: number, min: number, max: number, total: number) {
  if (count >= min && count <= max) return total
  if (count < min) return Math.round((count / min) * total)
  return Math.max(0, total - (count - max))
}

const writingScore = computed(() => bandScore(writingWords.value, 150, 200, 50))
const translationScore = computed(() => bandScore(translationWords.value, 100, 180, 50))
const score = computed(() => writingScore.value + translationScore.value)

function start() {
  started.value = true
  submitted.value = false
  writingText.value = ''
  translationText.value = ''
  checks.value = {
    writing: writingPrompt.checklist.map(() => false),
    translation: translationPrompt.checklist.map(() => false),
  }
  startedAt.value = Date.now()
  durationSec.value = 0
  remaining.value = writingExam.durationMin * 60
  stopTimer()
  timer = window.setInterval(tick, 1000)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function tick() {
  const elapsed = Math.round((Date.now() - startedAt.value) / 1000)
  remaining.value = Math.max(0, writingExam.durationMin * 60 - elapsed)
  if (remaining.value === 0) submit()
}

function stopTimer() {
  if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
}

async function submit() {
  if (submitted.value) return
  stopTimer()
  submitted.value = true
  durationSec.value = Math.max(1, Math.round((Date.now() - startedAt.value) / 1000))
  try {
    await db.attempts.add({
      createdAt: Date.now(),
      mode: 'writing',
      title: writingExam.title,
      durationSec: durationSec.value,
      answers: {
        writing: writingText.value,
        translation: translationText.value,
      },
      correct: score.value >= 60 ? 1 : 0,
      total: 1,
      score: score.value,
      readingScore: 0,
      byType: {
        writing: { correct: writingScore.value, total: 50 },
        translation: { correct: translationScore.value, total: 50 },
      },
      wrongIds: [],
    })
  } catch {
    // Saving history should not hide the result.
  }
}

function reset() {
  started.value = false
  submitted.value = false
  stopTimer()
}
</script>

<style scoped>
.writing-exam {
  display: grid;
  gap: 14px;
}

.intro {
  display: grid;
  gap: 10px;
}

.exam-bar {
  position: sticky;
  top: 56px;
  z-index: 15;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
}

.timer {
  font-family: var(--font-word);
  font-size: 22px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.answered {
  flex: 1;
  color: var(--muted);
  font-size: 11px;
}

.section {
  display: grid;
  gap: 10px;
}

.instruction {
  color: var(--ink-2);
  font-size: 13px;
  line-height: 1.6;
}

.writing-area {
  min-height: 180px;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.65;
  resize: vertical;
}

.source {
  font-family: var(--font-serif);
  font-size: 15px;
  line-height: 1.7;
}

.result {
  display: grid;
  gap: 12px;
}

.score-card {
  display: grid;
  gap: 8px;
}

.score-main {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.score-number {
  font-family: var(--font-word);
  font-size: 54px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
}

.score-unit {
  color: var(--muted);
  font-size: 14px;
}

.type-scores {
  display: grid;
  gap: 5px;
  padding-top: 4px;
  border-top: 1px solid var(--line);
}

.type-score {
  display: flex;
  justify-content: space-between;
  color: var(--ink-2);
  font-size: 12px;
}

.check-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--ink-2);
  font-size: 12px;
  line-height: 1.5;
}

.check-row input {
  margin-top: 2px;
  accent-color: var(--accent);
}

.reference {
  display: grid;
  gap: 5px;
}

.reference-text {
  font-family: var(--font-serif);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
}

.result-actions {
  display: flex;
  gap: 8px;
}
</style>
