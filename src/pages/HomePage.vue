<template>
  <AppShell>
    <div class="page home">
      <header class="home-head">
        <div>
          <p class="eyebrow">{{ greeting }}</p>
          <h1 class="display">{{ settings.profile.petName || '小步' }} 在等你。</h1>
        </div>
        <span class="today-count">{{ session.reviewedToday }} 张复习</span>
      </header>

      <StepStairs
        :steps="steps"
        :pet-species="settings.profile.petSpecies"
        :pet-name="settings.profile.petName"
        @select="go"
      />

      <div class="today-line">
        <span>今天 {{ session.reviewedToday }} 张复习 · {{ session.learnedToday }} 个新词 · {{ session.wroteToday }} 篇写作</span>
        <span v-if="newRemaining > 0" class="muted">还差 {{ newRemaining }} 个新词</span>
        <span v-else class="muted">新词已完成</span>
      </div>

      <button class="btn btn-primary btn-block continue" type="button" @click="continueStudy">
        {{ continueLabel }}
      </button>

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
import { useSessionStore } from '@/stores/session'
import { useSettingsStore } from '@/stores/settings'

const router = useRouter()
const settings = useSettingsStore()
const session = useSessionStore()

onMounted(() => {
  session.refresh()
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const newRemaining = computed(() =>
  Math.max(0, settings.profile.dailyNewWords - session.learnedToday),
)

const steps = computed<
  Array<{ key: 'review' | 'learn' | 'writing'; label: string; hint: string; done: boolean }>
>(() => [
  {
    key: 'writing',
    label: '写作',
    hint: session.wroteToday > 0 ? '已完成' : '写 1 篇',
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

const continueLabel = computed(() => {
  if (session.dueCount > 0) return '继续复习'
  if (newRemaining.value > 0) return '学新词'
  if (session.wroteToday === 0) return '去写作'
  return '去单词本'
})

function go(key: 'review' | 'learn' | 'writing') {
  if (key === 'review') router.push('/review')
  else if (key === 'learn') router.push('/learn')
  else router.push('/writing')
}

function continueStudy() {
  if (session.dueCount > 0) router.push('/review')
  else if (newRemaining.value > 0) router.push('/learn')
  else if (session.wroteToday === 0) router.push('/writing')
  else router.push('/wordbook')
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

.today-line {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 0 2px;
  color: var(--ink-2);
  font-size: 13px;
}

.continue {
  min-height: 54px;
  font-size: 16px;
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
