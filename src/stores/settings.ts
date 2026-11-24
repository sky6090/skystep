import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/db/db'
import type { VocabLevel } from '@/data/placement'

export type PetSpecies = 'cat' | 'dog' | 'dragon' | 'elf'
export type ThemeMode = 'auto' | 'day' | 'night'
export type LearnMode = 'en-to-zh' | 'zh-to-en' | 'spelling'

export interface Profile {
  userName: string
  petSpecies: PetSpecies
  petName: string
  onboarded: boolean
  dailyNewWords: number
  theme: ThemeMode
  learnMode: LearnMode
  vocabLevel: VocabLevel
  estimatedVocab: number
}

const DEFAULT_PROFILE: Profile = {
  userName: '',
  petSpecies: 'cat',
  petName: '',
  onboarded: false,
  dailyNewWords: 20,
  theme: 'auto',
  learnMode: 'en-to-zh',
  vocabLevel: 'intermediate',
  estimatedVocab: 0,
}

export const useSettingsStore = defineStore('settings', () => {
  const profile = ref<Profile>({ ...DEFAULT_PROFILE })
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    const row = await db.settings.get('profile')
    if (row?.value) {
      profile.value = { ...DEFAULT_PROFILE, ...(row.value as Partial<Profile>) }
    }
    loaded.value = true
  }

  async function save() {
    await db.settings.put({ key: 'profile', value: { ...profile.value } })
  }

  async function completeOnboarding(
    species: PetSpecies,
    name: string,
    level: VocabLevel = 'intermediate',
    estimatedVocab = 0,
    userName = '',
  ) {
    profile.value.userName = userName.trim() || '同学'
    profile.value.petSpecies = species
    profile.value.petName = name.trim() || '小步'
    profile.value.onboarded = true
    profile.value.vocabLevel = level
    profile.value.estimatedVocab = estimatedVocab
    await save()
  }

  async function setVocabPlacement(level: VocabLevel, estimatedVocab: number) {
    profile.value.vocabLevel = level
    profile.value.estimatedVocab = estimatedVocab
    await save()
  }

  async function setUserName(name: string) {
    profile.value.userName = name.trim() || '同学'
    await save()
  }

  async function setDailyNewWords(count: number) {
    profile.value.dailyNewWords = Math.min(100, Math.max(10, Math.round(count)))
    await save()
  }

  async function setTheme(theme: ThemeMode) {
    profile.value.theme = theme
    await save()
  }

  async function setLearnMode(mode: LearnMode) {
    profile.value.learnMode = mode
    await save()
  }

  return {
    profile,
    loaded,
    load,
    save,
    completeOnboarding,
    setDailyNewWords,
    setTheme,
    setLearnMode,
    setVocabPlacement,
    setUserName,
  }
})
