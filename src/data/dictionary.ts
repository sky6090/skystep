import type { WordEntry } from '@/data/words.sample'

export interface DictionaryEntry {
  id: string
  w: string
  p: string
  t: string
  pos: string
  ex: string
  exZh: string
  phr: string[]
  syn: string[]
  forms: string[]
  rank: number
  tag: string
}

let cache: DictionaryEntry[] | null = null
let loading: Promise<DictionaryEntry[]> | null = null

export async function loadDictionary(): Promise<DictionaryEntry[]> {
  if (cache) return cache
  if (!loading) {
    loading = fetch(`${import.meta.env.BASE_URL}data/dictionary.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`dictionary ${response.status}`)
        return response.json() as Promise<DictionaryEntry[]>
      })
      .then((entries) => {
        cache = entries
        return entries
      })
      .catch((error) => {
        loading = null
        throw error
      })
  }
  return loading
}

export function entryToWord(entry: DictionaryEntry): WordEntry {
  return {
    id: entry.id,
    word: entry.w,
    phonetic: entry.p,
    pos: entry.pos,
    meaning: entry.t,
    example: entry.ex,
    exampleZh: entry.exZh,
    forms: entry.forms ?? [],
    tags: [entry.tag],
  }
}

export function searchDictionary(
  entries: DictionaryEntry[],
  query: string,
  limit = 20,
): DictionaryEntry[] {
  const raw = query.trim()
  if (!raw) {
    const examWords = entries.filter((entry) => entry.tag !== '高频')
    return (examWords.length ? examWords : entries).slice(0, 12)
  }
  const q = raw.toLowerCase()

  const exact: DictionaryEntry[] = []
  const prefix: DictionaryEntry[] = []
  const contains: DictionaryEntry[] = []
  const chinese: DictionaryEntry[] = []
  const seen = new Set<string>()

  const push = (bucket: DictionaryEntry[], entry: DictionaryEntry) => {
    if (seen.has(entry.id)) return
    seen.add(entry.id)
    bucket.push(entry)
  }

  for (const entry of entries) {
    const id = entry.id
    if (id === q) {
      push(exact, entry)
      continue
    }
    if (id.startsWith(q)) {
      push(prefix, entry)
      continue
    }
    if (id.includes(q)) {
      push(contains, entry)
      continue
    }
    if (entry.t.includes(raw)) {
      push(chinese, entry)
    }
  }

  const chineseScore = (entry: DictionaryEntry) => {
    if (entry.t === raw) return 0
    if (entry.t.startsWith(raw)) return 1
    if (entry.t.includes(` ${raw}`)) return 2
    return 3
  }

  chinese.sort(
    (a, b) =>
      chineseScore(a) - chineseScore(b) ||
      a.t.length - b.t.length ||
      a.rank - b.rank,
  )

  return [...exact, ...prefix, ...contains, ...chinese].slice(0, limit)
}

export function dictionaryMap(entries: DictionaryEntry[]): Map<string, DictionaryEntry> {
  return new Map(entries.map((entry) => [entry.id, entry]))
}
