<template>
  <div class="app-shell">
    <a class="skip-link" href="#main">跳到主要内容</a>
    <header class="topbar">
      <div class="topbar-left">
        <button
          v-if="backTo"
          class="back-btn"
          type="button"
          aria-label="返回上一页"
          @click="goBack"
        >
          <span aria-hidden="true">←</span>
          <span class="back-label">返回</span>
        </button>
        <RouterLink to="/" class="brand" aria-label="SkyStep 首页">
          <BrandMark :size="30" />
          <span class="brand-name">SkyStep</span>
        </RouterLink>
      </div>
      <span class="today">{{ todayLabel }}</span>
    </header>
    <main id="main" tabindex="-1">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandMark from '@/components/BrandMark.vue'
import BottomNav from '@/components/BottomNav.vue'

const route = useRoute()
const router = useRouter()
const backTo = computed(() => {
  const target = route.meta.backTo
  return typeof target === 'string' ? target : ''
})

function goBack() {
  if (backTo.value) router.push(backTo.value)
  else router.back()
}

const todayLabel = computed(() => {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][now.getDay()]
  return `${month} 月 ${day} 日 · ${weekday}`
})
</script>

<style scoped>
.skip-link {
  position: fixed;
  top: 8px;
  left: 12px;
  z-index: 100;
  padding: 8px 12px;
  border: 1px solid var(--accent);
  border-radius: 8px;
  background: var(--surface);
  color: var(--ink);
  font-size: 13px;
  transform: translateY(-160%);
}

.skip-link:focus {
  transform: translateY(0);
}

main:focus {
  outline: none;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px 10px;
  background: var(--bg);
}

.topbar-left {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  min-height: 34px;
  padding: 0 9px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--surface);
  color: var(--ink-2);
  font-size: 12px;
  cursor: pointer;
}

.back-btn:hover {
  border-color: var(--accent);
  color: var(--accent-strong);
}

.back-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.back-label {
  font-size: 11px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.brand-name {
  font-size: 17px;
  font-weight: 650;
  letter-spacing: -0.02em;
}

.today {
  color: var(--muted);
  font-size: 12px;
}

@media (min-width: 720px) {
  .topbar {
    padding-right: 32px;
    padding-left: 32px;
  }
}

@media (max-width: 380px) {
  .back-label {
    display: none;
  }

  .brand-name {
    font-size: 15px;
  }

  .today {
    font-size: 11px;
  }
}
</style>
