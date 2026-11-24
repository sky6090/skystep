<template>
  <AppShell>
    <div class="page practice">
      <header class="page-head">
        <div>
          <p class="eyebrow">practice</p>
          <h1 class="h1">模拟练习</h1>
        </div>
        <span class="tag tag-accent">M5</span>
      </header>

      <p class="lede">
        阅读专项按六级结构：选词填空 10 题、长篇匹配 10 题、仔细阅读 10 题。
        模考模式禁查词典；练习模式可以随时看解析。
      </p>

      <section class="card main-card">
        <div class="main-copy">
          <p class="eyebrow">reading · 30 questions</p>
          <h2 class="h2">阅读专项模考</h2>
          <p class="muted small">40 分钟 · 交卷后给正确率、阅读估分和错题解析。</p>
        </div>
        <RouterLink to="/exam" class="btn btn-primary">开始模考</RouterLink>
      </section>

      <div class="set-links">
        <span class="caption">套题：</span>
        <RouterLink
          v-for="(section, index) in readingSections"
          :key="section.id"
          :to="`/exam?set=${section.id}`"
          class="tag tag-accent"
        >
          套题 {{ index + 1 }}
        </RouterLink>
      </div>

      <div class="quick-actions">
        <RouterLink to="/exam?mode=practice" class="btn">每日一练 · 10 题</RouterLink>
        <RouterLink v-if="retryCount > 0" to="/exam?mode=wrong" class="btn">
          {{ dueCount > 0 ? '今日错题' : '错题重练' }} · {{ retryCount }} 题
        </RouterLink>
        <button v-else class="btn" type="button" disabled>错题重练 · 暂无</button>
      </div>

      <section class="type-grid">
        <RouterLink
          v-for="type in types"
          :key="type.key"
          :to="`/exam?type=${type.key}`"
          class="type-card"
        >
          <span class="type-label">{{ type.label }}</span>
          <strong>{{ type.count }}</strong>
          <span class="caption">题</span>
        </RouterLink>
      </section>

      <section class="card main-card">
        <div class="main-copy">
          <p class="eyebrow">writing + translation</p>
          <h2 class="h2">写作 + 翻译模考</h2>
          <p class="muted small">60 分钟 · 写作 30 + 翻译 30 · 参考范文 / 译文 + 自评清单。</p>
        </div>
        <RouterLink to="/writing-exam" class="btn">开始</RouterLink>
      </section>

      <section v-if="attempts.length" class="card history">
        <div class="spread">
          <h2 class="h3">最近练习</h2>
          <span class="caption">{{ attempts.length }} 次</span>
        </div>
        <div class="attempt-list">
          <div v-for="attempt in attempts" :key="attempt.id" class="attempt-row">
            <span class="attempt-title">{{ attempt.title }}</span>
            <span class="caption">{{ attempt.mode === 'practice' ? '练习' : '模考' }}</span>
            <span class="attempt-score">{{ attempt.score }}</span>
          </div>
        </div>
      </section>

      <p class="footnote">
        错题按 1 / 3 / 7 天排期；有今日到期时优先练到期题，没有则回到最近一次错题。
      </p>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppShell from '@/components/AppShell.vue'
import { db, type AttemptRow } from '@/db/db'
import { readingSections } from '@/data/reading'

const attempts = ref<AttemptRow[]>([])
const wrongCount = ref(0)
const dueCount = ref(0)
const retryCount = computed(() => (dueCount.value > 0 ? dueCount.value : wrongCount.value))
const firstSet = readingSections[0]

const types = computed(() => [
  {
    key: 'banked-cloze',
    label: '选词填空',
    count: firstSet.questions.filter((question) => question.type === 'banked-cloze').length,
  },
  {
    key: 'matching',
    label: '长篇匹配',
    count: firstSet.questions.filter((question) => question.type === 'matching').length,
  },
  {
    key: 'careful-reading',
    label: '仔细阅读',
    count: firstSet.questions.filter((question) => question.type === 'careful-reading').length,
  },
])

onMounted(load)

async function load() {
  attempts.value = await db.attempts.orderBy('createdAt').reverse().limit(5).toArray()
  const latest = attempts.value[0]
  wrongCount.value = latest?.wrongIds?.length ?? 0
  dueCount.value = await db.questionReviews
    .where('nextDueAt')
    .belowOrEqual(Date.now())
    .count()
}
</script>

<style scoped>
.practice {
  display: grid;
  gap: 14px;
}

.lede {
  color: var(--ink-2);
  font-size: 13px;
  line-height: 1.6;
}

.main-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.main-copy {
  display: grid;
  gap: 3px;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.set-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: -6px;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.type-card {
  display: grid;
  gap: 1px;
  padding: 13px 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
}

.type-card:hover {
  border-color: var(--accent);
}

.type-label {
  color: var(--muted);
  font-size: 11px;
}

.type-card strong {
  font-family: var(--font-serif);
  font-size: 25px;
  font-weight: 600;
  line-height: 1.1;
}

.history {
  display: grid;
  gap: 8px;
}

.attempt-list {
  display: grid;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface-2);
  overflow: hidden;
}

.attempt-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 10px;
  padding: 9px 11px;
  border-top: 1px solid var(--line);
}

.attempt-row:first-child {
  border-top: 0;
}

.attempt-title {
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attempt-score {
  color: var(--accent-strong);
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.footnote {
  padding: 2px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}

@media (max-width: 380px) {
  .main-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .quick-actions,
  .type-grid {
    grid-template-columns: 1fr;
  }
}
</style>
