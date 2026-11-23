<template>
  <section class="room" aria-label="今日天阶">
    <div class="window" aria-hidden="true">
      <span class="window-line window-line-v" />
      <span class="window-line window-line-h" />
    </div>
    <div class="lamp" aria-hidden="true">
      <span class="lamp-shade" />
      <span class="lamp-stand" />
    </div>

    <div class="pet-spot">
      <PetAvatar :species="petSpecies" :size="78" :name="petName" />
      <span class="pet-bubble">{{ petName || '小步' }}</span>
    </div>

    <div class="stairs">
      <button
        v-for="(step, index) in steps"
        :key="step.key"
        class="step"
        :class="{ done: step.done, next: index === nextIndex }"
        :style="{ width: widthFor(index) }"
        type="button"
        @click="$emit('select', step.key)"
      >
        <span class="step-num" aria-hidden="true">{{ steps.length - index }}</span>
        <span class="step-copy">
          <strong>{{ step.label }}</strong>
          <small>{{ step.hint }}</small>
        </span>
        <span class="step-mark" aria-hidden="true">{{ step.done ? '✓' : '' }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PetAvatar from '@/components/PetAvatar.vue'
import type { PetSpecies } from '@/stores/settings'

export interface StairStep {
  key: 'review' | 'learn' | 'writing'
  label: string
  hint: string
  done: boolean
}

const props = defineProps<{
  steps: StairStep[]
  petSpecies: PetSpecies
  petName: string
}>()

defineEmits<{ select: [key: StairStep['key']] }>()

const nextIndex = computed(() => {
  for (let index = props.steps.length - 1; index >= 0; index -= 1) {
    if (!props.steps[index].done) return index
  }
  return -1
})

function widthFor(index: number) {
  return ['68%', '84%', '100%'][index] ?? '100%'
}
</script>

<style scoped>
.room {
  position: relative;
  display: flex;
  min-height: 336px;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  overflow: hidden;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--room);
}

.window {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 94px;
  height: 72px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 10px 10px 4px 4px;
  background: var(--surface);
}

.window::after {
  position: absolute;
  right: -6px;
  bottom: -5px;
  left: -6px;
  height: 5px;
  border-radius: 2px;
  background: var(--line);
  content: '';
}

.window-line {
  position: absolute;
  background: var(--line);
}

.window-line-v {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
}

.window-line-h {
  top: 50%;
  right: 0;
  left: 0;
  height: 1px;
}

.lamp {
  position: absolute;
  top: 28px;
  right: 122px;
  width: 30px;
  height: 58px;
}

.lamp-shade {
  position: absolute;
  top: 0;
  left: 2px;
  width: 26px;
  height: 16px;
  border: 1px solid var(--accent);
  border-radius: 6px 6px 3px 3px;
  background: var(--accent-soft);
}

.lamp-stand {
  position: absolute;
  top: 16px;
  left: 14px;
  width: 2px;
  height: 38px;
  background: var(--line);
}

.lamp-stand::after {
  position: absolute;
  bottom: -2px;
  left: -9px;
  width: 20px;
  height: 3px;
  border-radius: 2px;
  background: var(--line);
  content: '';
}

.pet-spot {
  position: absolute;
  top: 16px;
  right: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.pet-bubble {
  padding: 2px 8px;
  border: 1px solid var(--line);
  border-radius: 7px;
  background: var(--surface);
  color: var(--ink-2);
  font-size: 11px;
  line-height: 1.4;
}

.stairs {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  margin-top: 92px;
}

.step {
  display: flex;
  min-height: 64px;
  align-items: center;
  gap: 10px;
  padding: 10px 13px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  color: var(--ink);
  text-align: left;
  cursor: pointer;
  transition: background 150ms var(--ease), border-color 150ms var(--ease), transform 150ms var(--ease);
}

.step:active {
  transform: translateY(1px);
}

.step:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.step.done {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.step.next {
  border-color: var(--accent);
}

.step-num {
  width: 16px;
  flex: none;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
}

.step-copy {
  display: grid;
  min-width: 0;
  gap: 1px;
}

.step-copy strong {
  font-size: 14px;
  font-weight: 650;
  line-height: 1.3;
}

.step-copy small {
  overflow: hidden;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.step-mark {
  margin-left: auto;
  color: var(--accent-strong);
  font-size: 15px;
  font-weight: 700;
}

@media (max-width: 360px) {
  .room {
    padding: 14px;
  }

  .pet-spot {
    right: 14px;
  }

  .lamp {
    display: none;
  }
}
</style>
