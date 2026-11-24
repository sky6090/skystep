<template>
  <AppShell>
    <div class="page home">
      <header class="home-head">
        <div>
          <p class="eyebrow">{{ greeting }}</p>
          <h1 class="display">{{ greetingTitle }}</h1>
        </div>
        <span class="today-count">{{ session.reviewedToday }} 张复习</span>
      </header>

      <StepStairs
        :steps="steps"
        :pet-species="settings.profile.petSpecies"
        :pet-name="settings.profile.petName"
        @select="go"
      />

      <section class="card vocab-progress">
        <div class="spread">
          <div>
            <span class="sub-label">六级词汇进度</span>
            <p class="vocab-level">
              {{ vocabLevelLabel }}<template v-if="settings.profile.estimatedVocab"> · 估算 {{ settings.profile.estimatedVocab }} 词</template>
            </p>
          </div>
          <span class="vocab-count">{{ vocabDone }} / {{ CET6_TOTAL }}</span>
        </div>
        <div class="progress" aria-hidden="true">
          <span :style="{ width: `${vocabProgress}%` }" />
        </div>
      </section>

      <div class="today-line">
        <span>今天 {{ session.reviewedToday }} 张复习 · {{ session.learnedToday }} 个新词 · {{ session.wroteToday }} 次练习</span>
        <span v-if="newRemaining > 0" class="muted">还差 {{ newRemaining }} 个新词</span>
        <span v-else class="muted">新词已完成</span>
      </div>

      <div class="home-actions">
        <RouterLink to="/learn" class="btn btn-primary home-action">
          <span>学习</span>
          <span class="action-count">{{ newRemaining }}</span>
        </RouterLink>
        <RouterLink to="/review" class="btn btn-primary home-action">
          <span>复习</span>
          <span class="action-count">{{ session.dueCount }}</span>
        </RouterLink>
      </div>

      <div class="quick-grid">
        <RouterLink to="/wordbook" class="quick-card">
          <span class="quick-label">单词本</span>
          <strong>{{ session.totalCards }}</strong>
          <span class="quick-hint">个词在册</span>
        </RouterLink>
        <RouterLink to="/dictionary" class="quick-card">
          <span class="quick-label">词典</span>
          <strong>查</strong>
          <span class="quick-hint">中英双向</span>
        </RouterLink>
        <RouterLink to="/practice" class="quick-card wide">
          <span class="quick-label">模拟练习</span>
          <strong>30 题</strong>
          <span class="quick-hint">阅读专项 · 40 分钟</span>
        </RouterLink>
      </div>

      <p class="footnote">
        宠物只是反馈层。先把复习做完，再去喂它。
      </p>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppShell from '@/components/AppShell.vue'
import StepStairs from '@/components/StepStairs.vue'
import { CET6_TOTAL, VOCAB_LEVEL_LABELS } from '@/data/vocabulary'
import { useSessionStore } from '@/stores/session'
import { useSettingsStore } from '@/stores/settings'

const router = useRouter()
const settings = useSettingsStore()
const session = useSessionStore()

onMounted(() => {
  session.refresh()
})

const vocabProgress = computed(() =>
  Math.min(100, Math.round((session.totalCards / CET6_TOTAL) * 100)),
)
const vocabDone = computed(() => Math.min(session.totalCards, CET6_TOTAL))
const vocabLevelLabel = computed(
  () => VOCAB_LEVEL_LABELS[settings.profile.vocabLevel],
)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const greetingTitle = computed(() => {
  const petName = settings.profile.petName || '小步'
  return settings.profile.userName
    ? `${settings.profile.userName}，${petName} 在等你。`
    : `${petName} 在等你。`
})

const newRemaining = computed(() =>
  Math.max(0, settings.profile.dailyNewWords - session.learnedToday),
)

const steps = computed<
  Array<{ key: 'review' | 'learn' | 'writing'; label: string; hint: string; done: boolean }>
>(() => [
  {
    key: 'writing',
    label: '练习',
    hint: session.wroteToday > 0 ? '已完成' : '写 1 组',
    done: session.wroteToday > 0,
  },
  {
    key: 'learn',
    label: '新词',
    hint: newRemaining.value > 0 ? `${newRemaining.value} 个待学` : '已完成',
    done: newRemaining.value === 0,
  },
  {
    key: 'review',
    label: '复习',
    hint: session.dueCount > 0 ? `${session.dueCount} 张到期` : '已清空',
    done: session.dueCount === 0,
  },
])

function go(key: 'review' | 'learn' | 'writing') {
  if (key === 'review') router.push('/review')
  else if (key === 'learn') router.push('/learn')
  else router.push('/writing')
}
</script>

<style scoped>
.home {
  display: grid;
  gap: 14px;
}

.home-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.today-count {
  flex: none;
  padding-top: 4px;
  color: var(--muted);
  font-size: 12px;
}

.vocab-progress {
  display: grid;
  gap: 7px;
  padding: 13px 15px;
}

.vocab-level {
  color: var(--ink-2);
  font-size: 11px;
}

.vocab-count {
  color: var(--ink-2);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.today-line {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 0 2px;
  color: var(--ink-2);
  font-size: 13px;
}

.home-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.home-action {
  display: flex;
  min-height: 54px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
}

.action-count {
  min-width: 20px;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgb(255 255 255 / 22%);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.quick-card {
  display: grid;
  gap: 2px;
  padding: 15px 16px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  transition: border-color 150ms var(--ease);
}

.quick-card:hover {
  border-color: var(--accent);
}

.quick-card.wide {
  display: flex;
  grid-column: 1 / -1;
  align-items: baseline;
  gap: 10px;
}

.quick-card.wide strong {
  font-size: 20px;
}

.quick-card.wide .quick-hint {
  margin-left: auto;
}

.quick-label {
  color: var(--muted);
  font-size: 12px;
}

.quick-card strong {
  font-family: var(--font-serif);
  font-size: 25px;
  font-weight: 600;
  line-height: 1.1;
}

.quick-hint {
  color: var(--muted);
  font-size: 11px;
}

.footnote {
  padding: 6px 2px 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}
</style>
