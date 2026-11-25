<template>
  <nav class="bottom-nav" aria-label="主导航">
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="nav-item"
      :class="{ active: isActive(item.to) }"
      :aria-current="isActive(item.to) ? 'page' : undefined"
    >
      <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path v-if="item.icon === 'book'" d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
        <path v-if="item.icon === 'book'" d="M4 18.5A2.5 2.5 0 0 1 6.5 16H19" />
        <path v-if="item.icon === 'cards'" d="M4 7h11v10H4z" />
        <path v-if="item.icon === 'cards'" d="M8 4h11v10" />
        <path v-if="item.icon === 'paw'" d="M12 13c3 0 5 1.8 5 4 0 1.8-1.8 3-5 3s-5-1.2-5-3c0-2.2 2-4 5-4Z" />
        <circle v-if="item.icon === 'paw'" cx="7" cy="9" r="2" />
        <circle v-if="item.icon === 'paw'" cx="12" cy="7" r="2" />
        <circle v-if="item.icon === 'paw'" cx="17" cy="9" r="2" />
        <circle v-if="item.icon === 'search'" cx="10.5" cy="10.5" r="5.5" />
        <path v-if="item.icon === 'search'" d="m15 15 4.5 4.5" />
        <circle v-if="item.icon === 'user'" cx="12" cy="8" r="3.2" />
        <path v-if="item.icon === 'user'" d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5" />
      </svg>
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const items = [
  { to: '/', label: '学习', icon: 'book' },
  { to: '/wordbook', label: '单词本', icon: 'cards' },
  { to: '/pet', label: '宠物', icon: 'paw' },
  { to: '/dictionary', label: '词典', icon: 'search' },
  { to: '/settings', label: '我的', icon: 'user' },
]

function isActive(to: string) {
  if (to === '/pet') return route.path === '/pet' || route.path === '/shop'
  if (to === '/') {
    return (
      route.path === '/' ||
      route.path === '/practice' ||
      route.path === '/exam' ||
      route.path === '/writing-exam' ||
      route.path === '/review'
    )
  }
  return route.path.startsWith(to)
}
</script>
