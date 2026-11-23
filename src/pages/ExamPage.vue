<template>
  <AppShell>
    <div class="page exam">
      <header class="page-head">
        <div>
          <p class="eyebrow">reading practice</p>
          <h1 class="h1">{{ title }}</h1>
        </div>
        <span class="tag tag-accent">{{ questions.length }} 题</span>
      </header>

      <section v-if="!started" class="card intro">
        <p class="eyebrow">{{ modeLabel }}</p>
        <h2 class="h2">{{ title }}</h2>
        <p class="muted small">
          {{ questions.length }} 题 · {{ durationMin }} 分钟。
          模考模式禁用词典；交卷后给正确率、阅读估分和错题解析。
        </p>
        <div v-if="questions.length === 0" class="empty-copy">
          最近一次没有错题，先去练一组。
        </div>
        <button
          v-else
          class="btn btn-primary btn-block"
          type="button"
          @click="start"
        >
          开始
        </button>
        <RouterLink to="/practice" class="btn btn-ghost btn-block">回练习</RouterLink>
      </section>

      <template v-else-if="!result">
        <div class="exam-bar">
          <span class="timer">{{ formatTime(remaining) }}</span>
          <span class="answered">{{ answeredCount }} / {{ questions.length }} 已答</span>
          <button class="btn btn-primary btn-sm" type="button" @click="submit">交卷</button>
        </div>

        <section v-if="clozeQuestions.length" class="card question-section">
          <h2 class="h3">选词填空</h2>
          <p class="passage">{{ clozePassage?.text }}</p>
          <div class="word-bank">
            <span v-for="word in clozeOptions" :key="word" class="tag">{{ word }}</span>
          </div>
          <div class="cloze-list">
            <label v-for="question in clozeQuestions" :key="question.id" class="cloze-row">
              <span class="cloze-prompt">{{ question.prompt }}</span>
              <select v-model="answers[question.id]" class="input select">
                <option value="">请选择</option>
                <option v-for="word in question.options" :key="word" :value="word">{{ word }}</option>
              </select>
            </label>
          </div>
        </section>

        <section v-if="matchingQuestions.length" class="card question-section">
          <h2 class="h3">长篇匹配</h2>
          <p class="passage">{{ matchingPassage?.text }}</p>
          <div class="matching-list">
            <label v-for="question in matchingQuestions" :key="question.id" class="matching-row">
              <span class="matching-prompt">{{ question.prompt }}</span>
              <select v-model="answers[question.id]" class="input select">
                <option value="">选择段落</option>
                <option v-for="label in question.options" :key="label" :value="label">{{ label }}</option>
              </select>
            </label>
          </div>
        </section>

        <section
          v-for="group in carefulGroups"
          :key="group.passageId"
          class="card question-section"
        >
          <h2 class="h3">{{ group.passage?.title }}</h2>
          <p class="passage">{{ group.passage?.text }}</p>
          <div class="careful-list">
            <div v-for="(question, index) in group.questions" :key="question.id" class="careful-question">
              <p class="careful-prompt">{{ index + 1 }}. {{ question.prompt }}</p>
              <label v-for="(option, optionIndex) in question.options" :key="option" class="option-row">
                <input
                  v-model="answers[question.id]"
                  type="radio"
                  :name="question.id"
                  :value="letter(optionIndex)"
                />
                <span>{{ letter(optionIndex) }}. {{ option }}</span>
              </label>
            </div>
          </div>
        </section>

        <button class="btn btn-primary btn-block" type="button" @click="submit">交卷</button>
      </template>

      <section v-else class="result">
        <div class="card score-card">
          <div class="score-main">
            <span class="score-number">{{ result.score }}</span>
            <span class="score-unit">/ 100</span>
          </div>
          <p class="muted small">
            答对 {{ result.correct }} / {{ result.total }} 题 · 阅读估分
            {{ result.readingScore }} / 248.5 · 用时 {{ formatTime(durationSec) }}
          </p>
          <div class="type-scores">
            <div v-for="(score, type) in result.byType" :key="type" class="type-score">
              <span>{{ questionTypeLabels[type] ?? type }}</span>
              <strong>{{ score.correct }} / {{ score.total }}</strong>
            </div>
          </div>
        </div>

        <section v-if="result.wrong.length" class="card wrong-card">
          <h2 class="h3">错题解析</h2>
          <div class="wrong-list">
            <article v-for="question in result.wrong" :key="question.id" class="wrong-item">
              <p class="wrong-title">{{ passageById.get(question.passageId)?.title }}</p>
              <p class="wrong-prompt">{{ question.prompt }}</p>
              <p class="wrong-line">
                你的答案：<span class="danger">{{ answers[question.id] || '未答' }}</span>
                · 正确答案：<span class="ok">{{ question.answer }}</span>
              </p>
              <p class="wrong-explanation">{{ question.explanation }}</p>
            </article>
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
import { useRoute } from 'vue-router'
import AppShell from '@/components/AppShell.vue'
import { db } from '@/db/db'
import {
  passageById,
  questionById,
  readingSections,
  sectionById,
  type Question,
  type QuestionType,
} from '@/data/reading'
import {
  buildPracticeSet,
  formatTime,
  groupByPassage,
  questionTypeLabels,
  scoreQuestions,
  type AttemptScore,
} from '@/domain/exam'
import {
  nextQuizStage,
  quizDueAt,
} from '@/domain/quizSchedule'

const route = useRoute()

const mode = computed(() => {
  if (route.query.mode === 'practice') return 'practice'
  if (route.query.mode === 'wrong') return 'wrong'
  return 'exam'
})
const typeFilter = computed(() => {
  const type = route.query.type
  return typeof type === 'string' ? (type as QuestionType) : null
})

const questions = ref<Question[]>(readingSections[0].questions)
const title = ref(readingSections[0].title)
const durationMin = ref(readingSections[0].durationMin)
const modeLabel = computed(() =>
  mode.value === 'practice' ? '每日一练' : mode.value === 'wrong' ? '错题重练' : '阅读专项',
)

const started = ref(false)
const answers = ref<Record<string, string>>({})
const remaining = ref(durationMin.value * 60)
const result = ref<AttemptScore | null>(null)
const startedAt = ref(0)
const durationSec = ref(0)
let timer: number | undefined

const clozeQuestions = computed(() =>
  questions.value.filter((question) => question.type === 'banked-cloze'),
)
const matchingQuestions = computed(() =>
  questions.value.filter((question) => question.type === 'matching'),
)
const clozePassage = computed(() => {
  const id = clozeQuestions.value[0]?.passageId
  return id ? passageById.get(id) : null
})
const matchingPassage = computed(() => {
  const id = matchingQuestions.value[0]?.passageId
  return id ? passageById.get(id) : null
})
const clozeOptions = computed(() => clozeQuestions.value[0]?.options ?? [])

const carefulGroups = computed(() => {
  const map = groupByPassage(
    questions.value.filter((question) => question.type === 'careful-reading'),
  )
  return [...map.entries()].map(([passageId, list]) => ({
    passageId,
    passage: passageById.get(passageId),
    questions: list,
  }))
})

const answeredCount = computed(
  () => Object.values(answers.value).filter((value) => Boolean(value)).length,
)

onMounted(async () => {
  await prepare()
})

onBeforeUnmount(stopTimer)

async function prepare() {
  const selectedSet = sectionById(route.query.set)
  if (mode.value === 'practice') {
    questions.value = buildPracticeSet(selectedSet.questions, 10)
    title.value = '每日一练 · 10 题'
    durationMin.value = 10
  } else if (mode.value === 'wrong') {
    const now = Date.now()
    const due = await db.questionReviews
      .where('nextDueAt')
      .belowOrEqual(now)
      .toArray()
    let ids = due.map((row) => row.questionId)
    if (!ids.length) {
      const latest = await db.attempts.orderBy('createdAt').reverse().first()
      ids = latest?.wrongIds ?? []
    }
    questions.value = ids
      .map((id) => questionById.get(id))
      .filter((question): question is Question => Boolean(question))
    title.value = due.length ? `今日错题 · ${questions.value.length} 题` : '错题重练'
    durationMin.value = 10
  } else if (typeFilter.value) {
    questions.value = selectedSet.questions.filter(
      (question) => question.type === typeFilter.value,
    )
    title.value = `${questionTypeLabels[typeFilter.value] ?? '专项'} · ${questions.value.length} 题`
    durationMin.value = 15
  } else {
    questions.value = selectedSet.questions
    title.value = selectedSet.title
    durationMin.value = selectedSet.durationMin
  }
  remaining.value = durationMin.value * 60
}

function start() {
  if (!questions.value.length) return
  started.value = true
  result.value = null
  answers.value = {}
  startedAt.value = Date.now()
  durationSec.value = 0
  remaining.value = durationMin.value * 60
  stopTimer()
  timer = window.setInterval(tick, 1000)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function tick() {
  const elapsed = Math.round((Date.now() - startedAt.value) / 1000)
  remaining.value = Math.max(0, durationMin.value * 60 - elapsed)
  if (remaining.value === 0) submit()
}

function stopTimer() {
  if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
}

async function submit() {
  if (result.value) return
  stopTimer()
  const score = scoreQuestions(questions.value, answers.value)
  result.value = score
  durationSec.value = Math.max(1, Math.round((Date.now() - startedAt.value) / 1000))
  try {
    await updateQuestionReviews()
  } catch {
    // Scheduling should never block the report.
  }
  try {
    await db.attempts.add({
      createdAt: Date.now(),
      mode: mode.value === 'practice' ? 'practice' : 'exam',
      title: title.value,
      durationSec: durationSec.value,
      answers: { ...answers.value },
      correct: score.correct,
      total: score.total,
      score: score.score,
      readingScore: score.readingScore,
      byType: score.byType,
      wrongIds: score.wrong.map((question) => question.id),
    })
  } catch {
    // A failed save should not hide the report.
  }
}

async function updateQuestionReviews() {
  const now = Date.now()
  const isReview = mode.value === 'wrong'
  for (const question of questions.value) {
    const correct = answers.value[question.id] === question.answer
    const existing = await db.questionReviews.get(question.id)
    if (isReview) {
      if (!correct) {
        await db.questionReviews.put({
          questionId: question.id,
          wrongCount: (existing?.wrongCount ?? 0) + 1,
          stage: 1,
          nextDueAt: quizDueAt(1, now),
          lastReviewedAt: now,
        })
      } else if (existing) {
        const next = nextQuizStage(existing.stage)
        if (!next) {
          await db.questionReviews.delete(question.id)
        } else {
          await db.questionReviews.put({
            ...existing,
            stage: next,
            nextDueAt: quizDueAt(next, now),
            lastReviewedAt: now,
          })
        }
      }
    } else if (!correct) {
      await db.questionReviews.put({
        questionId: question.id,
        wrongCount: (existing?.wrongCount ?? 0) + 1,
        stage: 1,
        nextDueAt: quizDueAt(1, now),
        lastReviewedAt: now,
      })
    }
  }
}

function reset() {
  started.value = false
  result.value = null
  answers.value = {}
  remaining.value = durationMin.value * 60
  stopTimer()
}

function letter(index: number) {
  return String.fromCharCode(65 + index)
}
</script>

<style scoped>
.exam {
  display: grid;
  gap: 14px;
}

.intro {
  display: grid;
  gap: 10px;
}

.empty-copy {
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface-2);
  color: var(--muted);
  font-size: 13px;
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

.question-section {
  display: grid;
  gap: 10px;
}

.passage {
  max-height: 280px;
  overflow: auto;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--paper);
  color: var(--paper-ink);
  font-family: var(--font-serif);
  font-size: 15px;
  line-height: 1.7;
  white-space: pre-wrap;
}

.word-bank {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.cloze-list,
.matching-list {
  display: grid;
  gap: 7px;
}

.cloze-row,
.matching-row {
  display: grid;
  grid-template-columns: 70px 1fr;
  align-items: center;
  gap: 8px;
}

.cloze-prompt,
.matching-prompt {
  color: var(--ink-2);
  font-size: 12px;
  line-height: 1.4;
}

.matching-row {
  grid-template-columns: 1fr 130px;
}

.select {
  min-height: 38px;
  padding: 0 8px;
  font-size: 12px;
}

.careful-list {
  display: grid;
  gap: 14px;
}

.careful-question {
  display: grid;
  gap: 5px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
}

.careful-question:first-child {
  padding-top: 0;
  border-top: 0;
}

.careful-prompt {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
}

.option-row {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  color: var(--ink-2);
  font-size: 13px;
  line-height: 1.5;
}

.option-row input {
  margin-top: 3px;
  accent-color: var(--accent);
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

.wrong-card {
  display: grid;
  gap: 10px;
}

.wrong-list {
  display: grid;
  gap: 12px;
}

.wrong-item {
  display: grid;
  gap: 3px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
}

.wrong-item:first-child {
  padding-top: 0;
  border-top: 0;
}

.wrong-title {
  color: var(--muted);
  font-size: 10px;
}

.wrong-prompt {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
}

.wrong-line {
  color: var(--ink-2);
  font-size: 12px;
}

.danger {
  color: var(--danger);
  font-weight: 600;
}

.ok {
  color: var(--success);
  font-weight: 600;
}

.wrong-explanation {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.55;
}

.result-actions {
  display: flex;
  gap: 8px;
}
</style>
