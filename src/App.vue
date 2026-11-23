<template>
  <div v-if="!ready" class="boot">
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
import { useSettingsStore } from '@/stores/settings'
import { useSessionStore } from '@/stores/session'

const router = useRouter()
const settings = useSettingsStore()
const session = useSessionStore()
const ready = ref(false)
let themeTimer: number | undefined

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
  document.documentElement.style.colorScheme = theme === 'night' ? 'dark' : 'light'
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'night' ? '#0F1A22' : '#F6F4EF')
}

onMounted(async () => {
  await settings.load()
  applyTheme()
  await session.refresh()
  if (!settings.profile.onboarded && router.currentRoute.value.path !== '/onboarding') {
    await router.replace('/onboarding')
  }
  ready.value = true
  themeTimer = window.setInterval(applyTheme, 60_000)
})

watch(
  () => settings.profile.theme,
  () => applyTheme(),
)

onBeforeUnmount(() => {
  if (themeTimer) window.clearInterval(themeTimer)
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
</style>
