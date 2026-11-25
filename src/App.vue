<template>
  <div v-if="bootError" class="boot boot-error">
    <BrandMark :size="64" />
    <p class="boot-name">页面没能打开</p>
    <p class="boot-message">{{ bootError }}</p>
    <button class="btn btn-primary" type="button" @click="initialize">重试</button>
    <p class="boot-hint">
      如果是在微信、小红书等 App 内打开，请点右上角，选择在系统浏览器中打开。
    </p>
  </div>
  <div v-else-if="!ready" class="boot">
    <BrandMark :size="64" />
    <p class="boot-name">SkyStep</p>
    <p class="boot-tagline">sky above, step below</p>
  </div>
  <RouterView v-else />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BrandMark from '@/components/BrandMark.vue'
import { usePetStore } from '@/stores/pet'
import { useSettingsStore } from '@/stores/settings'
import { useSessionStore } from '@/stores/session'

const router = useRouter()
const settings = useSettingsStore()
const session = useSessionStore()
const pet = usePetStore()
const ready = ref(false)
const bootError = ref('')
let themeTimer: number | undefined
let settlementTimer: number | undefined
let bootWatchdog: number | undefined

function msUntilFourAm() {
  const now = new Date()
  const next = new Date(now)
  next.setHours(4, 0, 0, 0)
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1)
  return next.getTime() - now.getTime()
}

function scheduleSettlement() {
  if (settlementTimer) window.clearTimeout(settlementTimer)
  settlementTimer = window.setTimeout(async () => {
    await pet.settleDue()
    scheduleSettlement()
  }, msUntilFourAm() + 1000)
}

async function onVisible() {
  if (document.visibilityState === 'visible') await pet.settleDue()
}

function applyTheme() {
  const mode = settings.profile.theme
  let theme: 'day' | 'night'
  if (mode === 'auto') {
    const hour = new Date().getHours()
    theme = hour >= 7 && hour < 19 ? 'day' : 'night'
  } else {
    theme = mode
  }
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = 'light'
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'night' ? '#D5E7F4' : '#F2F8FC')
}

async function initialize() {
  bootError.value = ''
  ready.value = false
  if (bootWatchdog) window.clearTimeout(bootWatchdog)
  bootWatchdog = window.setTimeout(() => {
    if (!ready.value && !bootError.value) {
      bootError.value = '本地数据加载超时。请刷新页面，或换到系统浏览器再试。'
    }
  }, 8000)

  try {
    await settings.load()
    bootError.value = ''
    applyTheme()
    ready.value = true
    if (bootWatchdog) window.clearTimeout(bootWatchdog)
    if (!settings.profile.onboarded && router.currentRoute.value.path !== '/onboarding') {
      await router.replace('/onboarding')
    }
    scheduleSettlement()
    document.addEventListener('visibilitychange', onVisible)
    themeTimer = window.setInterval(applyTheme, 60_000)

    // These are not required to render the app; keep startup fast and resilient.
    void session.refresh()
    void pet
      .load()
      .then(() => pet.settleDue())
      .catch(() => undefined)
  } catch (error) {
    if (bootWatchdog) window.clearTimeout(bootWatchdog)
    bootError.value =
      error instanceof Error
        ? `本地存储没有打开：${error.message}`
        : '浏览器没有允许本地存储，学习数据打不开。'
  }
}

onMounted(initialize)

watch(
  () => settings.profile.theme,
  () => applyTheme(),
)

onBeforeUnmount(() => {
  if (themeTimer) window.clearInterval(themeTimer)
  if (settlementTimer) window.clearTimeout(settlementTimer)
  if (bootWatchdog) window.clearTimeout(bootWatchdog)
  document.removeEventListener('visibilitychange', onVisible)
})
</script>

<style scoped>
.boot {
  display: grid;
  min-height: 100dvh;
  place-content: center;
  justify-items: center;
  gap: 10px;
  background: var(--bg);
}

.boot-name {
  margin-top: 8px;
  font-family: var(--font-word);
  font-size: 34px;
  font-weight: 600;
  letter-spacing: -0.03em;
}

.boot-tagline {
  color: var(--muted);
  font-family: var(--font-serif);
  font-size: 16px;
  font-style: italic;
}

.boot-error {
  padding: 24px;
}

.boot-message {
  max-width: 30ch;
  color: var(--ink-2);
  font-size: 13px;
  line-height: 1.6;
  text-align: center;
}

.boot-hint {
  max-width: 34ch;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.6;
  text-align: center;
}
</style>
