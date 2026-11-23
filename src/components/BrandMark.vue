<template>
  <svg
    :width="size"
    :height="size * 0.692"
    viewBox="210 90 780 540"
    role="img"
    aria-label="SkyStep"
  >
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path
        d="M 850 360 L 600 360 C 570 360 570 390 570 420 L 570 480 C 570 510 600 510 630 510 L 850 510 C 880 510 880 540 880 570 L 880 600 C 880 630 850 630 820 630 L 350 630"
        stroke="var(--ink)"
        stroke-width="26"
      />
      <path
        d="M 1130 90 L 760 90 C 720 90 720 120 720 150 L 720 210 C 720 240 750 240 780 240 L 980 240 C 1010 240 1010 270 1010 300 L 1010 330 C 1010 360 980 360 950 360 L 650 360"
        stroke="var(--bg)"
        stroke-width="46"
      />
      <path
        d="M 1130 90 L 760 90 C 720 90 720 120 720 150 L 720 210 C 720 240 750 240 780 240 L 980 240 C 1010 240 1010 270 1010 300 L 1010 330 C 1010 360 980 360 950 360 L 650 360"
        stroke="var(--accent)"
        stroke-width="26"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 32 })
</script>
