<template>
  <div class="onboarding">
    <header class="brand-row">
      <BrandMark :size="34" />
      <span class="brand-name">SkyStep</span>
    </header>

    <div v-if="step === 1" class="stage">
      <p class="eyebrow">first step</p>
      <h1 class="display">先选一个同桌。</h1>
      <p class="lede">
        它会住在你的书桌旁。你复习、学新词、写翻译，它慢慢长大。
        四只宠物数值一样，只看眼缘。
      </p>

      <div class="species-grid">
        <button
          v-for="option in speciesOptions"
          :key="option.id"
          class="species-card"
          :class="{ selected: selected === option.id }"
          type="button"
          @click="selected = option.id"
        >
          <PetAvatar :species="option.id" :size="84" />
          <span class="species-name">{{ option.name }}</span>
          <span class="species-desc">{{ option.desc }}</span>
        </button>
      </div>

      <button class="btn btn-primary btn-block" type="button" @click="step = 2">
        就它了
      </button>
    </div>

    <div v-else class="stage">
      <p class="eyebrow">give it a name</p>
      <h1 class="display">给它起个名字。</h1>
      <p class="lede">第一次起名免费。以后想改，要用改名卡。</p>

      <div class="name-preview">
        <PetAvatar :species="selected" :size="120" :name="name || '小步'" />
        <span class="preview-name">{{ name || '小步' }}</span>
      </div>

      <label class="field">
        <span class="field-label">名字</span>
        <input
          v-model="name"
          class="input"
          maxlength="12"
          placeholder="比如：小步、阿灯、Skye"
          autocomplete="off"
        />
      </label>

      <button class="btn btn-primary btn-block" type="button" :disabled="saving" @click="finish">
        {{ saving ? '正在安顿…' : '开始今天' }}
      </button>
      <button class="btn btn-ghost btn-block" type="button" @click="step = 1">换一只</button>
    </div>

    <p class="tagline">sky above, step below</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BrandMark from '@/components/BrandMark.vue'
import PetAvatar from '@/components/PetAvatar.vue'
import { useSettingsStore, type PetSpecies } from '@/stores/settings'

const router = useRouter()
const settings = useSettingsStore()

const step = ref(1)
const selected = ref<PetSpecies>('cat')
const name = ref('')
const saving = ref(false)

const speciesOptions: Array<{ id: PetSpecies; name: string; desc: string }> = [
  { id: 'cat', name: '猫', desc: '安静，喜欢趴在书边' },
  { id: 'dog', name: '狗', desc: '热情，会催你回来' },
  { id: 'dragon', name: '小龙', desc: '慢热，长大后会有翅膀' },
  { id: 'elf', name: '精灵', desc: '机灵，耳朵会动' },
]

async function finish() {
  if (saving.value) return
  saving.value = true
  await settings.completeOnboarding(selected.value, name.value)
  await router.replace('/')
}
</script>

<style scoped>
.onboarding {
  display: flex;
  width: 100%;
  max-width: 560px;
  min-height: 100dvh;
  margin: 0 auto;
  flex-direction: column;
  padding: 28px 20px 32px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 40px;
}

.brand-name {
  font-size: 18px;
  font-weight: 650;
  letter-spacing: -0.02em;
}

.stage {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
}

.lede {
  max-width: 34ch;
  color: var(--ink-2);
  font-size: 15px;
  line-height: 1.7;
}

.species-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 6px 0 4px;
}

.species-card {
  display: flex;
  min-height: 168px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px 10px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  color: var(--ink);
  cursor: pointer;
  transition: border-color 150ms var(--ease), background 150ms var(--ease), transform 150ms var(--ease);
}

.species-card:active {
  transform: translateY(1px);
}

.species-card.selected {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.species-name {
  margin-top: 4px;
  font-size: 16px;
  font-weight: 650;
}

.species-desc {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
}

.name-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--room);
}

.preview-name {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 600;
}

.tagline {
  margin-top: 36px;
  color: var(--muted);
  font-family: var(--font-serif);
  font-size: 14px;
  font-style: italic;
  text-align: center;
}

@media (min-width: 720px) {
  .onboarding {
    max-width: 720px;
    padding-right: 32px;
    padding-left: 32px;
  }

  .species-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
