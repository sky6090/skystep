import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { db } from '@/db/db'
import { DEFAULT_AI_CONFIG, testAIConnection, type AIConfig } from '@/domain/ai'

export const useAIStore = defineStore('ai', () => {
  const config = ref<AIConfig>({ ...DEFAULT_AI_CONFIG })
  const loaded = ref(false)
  const hasKey = computed(() => Boolean(config.value.apiKey.trim()))

  async function load() {
    if (loaded.value) return
    const row = await db.settings.get('ai')
    if (row?.value) {
      config.value = { ...DEFAULT_AI_CONFIG, ...(row.value as Partial<AIConfig>) }
    }
    loaded.value = true
  }

  async function save() {
    await db.settings.put({ key: 'ai', value: { ...config.value } })
  }

  async function update(patch: Partial<AIConfig>) {
    config.value = { ...config.value, ...patch }
    await save()
  }

  async function clearKey() {
    config.value = { ...config.value, enabled: false, apiKey: '' }
    await save()
  }

  async function test() {
    await testAIConnection(config.value)
  }

  return {
    config,
    loaded,
    hasKey,
    load,
    save,
    update,
    clearKey,
    test,
  }
})
