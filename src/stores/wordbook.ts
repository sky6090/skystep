import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db, type WordbookRow } from '@/db/db'

export type WordbookSource = WordbookRow['source']

export const useWordbookStore = defineStore('wordbook', () => {
  const rows = ref<WordbookRow[]>([])
  const loaded = ref(false)

  async function load(force = false) {
    if (loaded.value && !force) return
    rows.value = await db.wordbook.toArray()
    loaded.value = true
  }

  function get(wordId: string) {
    return rows.value.find((row) => row.wordId === wordId)
  }

  async function ensure(wordId: string, source: WordbookSource = 'manual') {
    const existing = get(wordId)
    if (existing) return existing
    const now = Date.now()
    const row: WordbookRow = {
      wordId,
      favorite: false,
      learned: false,
      wrong: false,
      wrongCount: 0,
      source,
      note: '',
      tags: [],
      createdAt: now,
      updatedAt: now,
    }
    await db.wordbook.put({ ...row })
    rows.value.push(row)
    return row
  }

  async function persist(row: WordbookRow) {
    row.updatedAt = Date.now()
    const plain: WordbookRow = { ...row, tags: [...row.tags] }
    await db.wordbook.put(plain)
    const index = rows.value.findIndex((item) => item.wordId === row.wordId)
    if (index >= 0) rows.value[index] = { ...plain }
    else rows.value.push({ ...plain })
  }

  async function toggleFavorite(wordId: string, source: WordbookSource = 'manual') {
    const row = await ensure(wordId, source)
    row.favorite = !row.favorite
    await persist(row)
  }

  async function markWrong(wordId: string, source: WordbookSource = 'manual') {
    const row = await ensure(wordId, source)
    row.wrong = true
    row.wrongCount = (row.wrongCount ?? 0) + 1
    row.lastWrongAt = Date.now()
    row.learned = false
    row.learnedAt = undefined
    await persist(row)
  }

  async function markLearned(wordId: string, source: WordbookSource = 'manual') {
    const row = await ensure(wordId, source)
    row.learned = true
    row.learnedAt = Date.now()
    row.wrong = false
    await persist(row)
  }

  async function unmarkLearned(wordId: string) {
    const row = get(wordId)
    if (!row) return
    row.learned = false
    row.learnedAt = undefined
    await persist(row)
  }

  async function saveNote(wordId: string, note: string, source: WordbookSource = 'manual') {
    const row = await ensure(wordId, source)
    row.note = note
    await persist(row)
  }

  function isFavorite(wordId: string) {
    return Boolean(get(wordId)?.favorite)
  }

  return {
    rows,
    loaded,
    load,
    get,
    ensure,
    toggleFavorite,
    markWrong,
    markLearned,
    unmarkLearned,
    saveNote,
    isFavorite,
  }
})
