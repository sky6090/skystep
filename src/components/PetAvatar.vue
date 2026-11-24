<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 96 96"
    role="img"
    :aria-label="name || '宠物'"
    :style="{ '--pet-skin': skinColor || 'var(--pet)' }"
  >
    <ellipse cx="48" cy="84" rx="25" ry="5.5" fill="var(--ink)" opacity="0.08" />

    <path
      v-if="species === 'cat'"
      d="M28 38 C20 44 18 56 24 64"
      fill="none"
      stroke="var(--pet-skin, var(--pet))"
      stroke-width="7"
      stroke-linecap="round"
    />
    <path
      v-else-if="species === 'dog'"
      d="M30 64 C22 66 20 76 28 80"
      fill="none"
      stroke="var(--pet-skin, var(--pet))"
      stroke-width="8"
      stroke-linecap="round"
    />
    <path
      v-else-if="species === 'dragon'"
      d="M28 64 C18 62 16 74 26 78"
      fill="none"
      stroke="var(--pet-skin, var(--pet))"
      stroke-width="7"
      stroke-linecap="round"
    />
    <path
      v-else
      d="M30 64 C24 68 24 76 30 78"
      fill="none"
      stroke="var(--pet-skin, var(--pet))"
      stroke-width="6"
      stroke-linecap="round"
    />

    <path
      v-if="species === 'dragon'"
      d="M26 48 C14 40 12 52 20 58 C24 60 28 56 30 52"
      fill="var(--pet-skin, var(--pet))"
      stroke="var(--ink)"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <path
      v-if="species === 'dragon'"
      d="M70 48 C82 40 84 52 76 58 C72 60 68 56 66 52"
      fill="var(--pet-skin, var(--pet))"
      stroke="var(--ink)"
      stroke-width="2"
      stroke-linejoin="round"
    />

    <ellipse
      cx="48"
      cy="62"
      rx="23"
      ry="19"
      fill="var(--pet-skin, var(--pet))"
      stroke="var(--ink)"
      stroke-width="2.4"
    />

    <path
      v-if="species === 'cat'"
      d="M36 26 L31 12 L44 20 Z"
      fill="var(--pet-skin, var(--pet))"
      stroke="var(--ink)"
      stroke-width="2.4"
      stroke-linejoin="round"
    />
    <path
      v-if="species === 'cat'"
      d="M60 26 L65 12 L52 20 Z"
      fill="var(--pet-skin, var(--pet))"
      stroke="var(--ink)"
      stroke-width="2.4"
      stroke-linejoin="round"
    />
    <path
      v-if="species === 'dog'"
      d="M31 30 C22 30 18 40 22 50 C26 56 32 52 34 44 Z"
      fill="var(--pet-skin, var(--pet))"
      stroke="var(--ink)"
      stroke-width="2.4"
      stroke-linejoin="round"
    />
    <path
      v-if="species === 'dog'"
      d="M65 30 C74 30 78 40 74 50 C70 56 64 52 62 44 Z"
      fill="var(--pet-skin, var(--pet))"
      stroke="var(--ink)"
      stroke-width="2.4"
      stroke-linejoin="round"
    />
    <path
      v-if="species === 'dragon'"
      d="M38 22 L34 10 L44 16 Z"
      fill="var(--paper)"
      stroke="var(--ink)"
      stroke-width="2.4"
      stroke-linejoin="round"
    />
    <path
      v-if="species === 'dragon'"
      d="M58 22 L62 10 L52 16 Z"
      fill="var(--paper)"
      stroke="var(--ink)"
      stroke-width="2.4"
      stroke-linejoin="round"
    />
    <path
      v-if="species === 'elf'"
      d="M27 36 C18 30 16 38 22 44 L30 48 Z"
      fill="var(--pet-skin, var(--pet))"
      stroke="var(--ink)"
      stroke-width="2.4"
      stroke-linejoin="round"
    />
    <path
      v-if="species === 'elf'"
      d="M69 36 C78 30 80 38 74 44 L66 48 Z"
      fill="var(--pet-skin, var(--pet))"
      stroke="var(--ink)"
      stroke-width="2.4"
      stroke-linejoin="round"
    />

    <circle cx="48" cy="40" r="21" fill="var(--surface)" stroke="var(--ink)" stroke-width="2.4" />

    <path
      v-if="species === 'elf'"
      d="M42 20 C44 14 52 14 54 20"
      fill="none"
      stroke="var(--accent-strong)"
      stroke-width="3"
      stroke-linecap="round"
    />

    <circle cx="40" cy="40" r="2.2" fill="var(--ink)" />
    <circle cx="56" cy="40" r="2.2" fill="var(--ink)" />
    <circle cx="40.8" cy="39.2" r="0.7" fill="var(--surface)" />
    <circle cx="56.8" cy="39.2" r="0.7" fill="var(--surface)" />

    <path
      d="M44 48 Q48 51 52 48"
      fill="none"
      stroke="var(--ink)"
      stroke-width="1.8"
      stroke-linecap="round"
    />

    <g v-if="species === 'cat'" stroke="var(--ink)" stroke-width="1.2" stroke-linecap="round">
      <path d="M28 44 L36 46" />
      <path d="M28 50 L36 49" />
      <path d="M68 44 L60 46" />
      <path d="M68 50 L60 49" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { PetSpecies } from '@/stores/settings'

withDefaults(
  defineProps<{
    species?: PetSpecies
    size?: number
    name?: string
    skinColor?: string
  }>(),
  { species: 'cat', size: 96, name: '', skinColor: '' },
)
</script>
