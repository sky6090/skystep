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
    rank: entry.rank,
  }
}

function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i]
    let rowMin = i
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      const value = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + cost,
      )
      current[j] = value
      rowMin = Math.min(rowMin, value)
    }
    if (rowMin > max) return max + 1
    previous.splice(0, previous.length, ...current)
  }
  return previous[b.length]
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
  const englishQuery = /^[a-z][a-z' -]*$/i.test(raw)

  const exact: DictionaryEntry[] = []
  const formExact: DictionaryEntry[] = []
  const prefix: DictionaryEntry[] = []
  const formPrefix: DictionaryEntry[] = []
  const contains: DictionaryEntry[] = []
  const chinese: DictionaryEntry[] = []
  const near: Array<{ entry: DictionaryEntry; distance: number }> = []
  const seen = new Set<string>()

  const push = (bucket: DictionaryEntry[], entry: DictionaryEntry) => {
    if (seen.has(entry.id)) return
    seen.add(entry.id)
    bucket.push(entry)
  }

  for (const entry of entries) {
    const id = entry.id
    const forms = entry.forms ?? []
    if (id === q) {
      push(exact, entry)
      continue
    }
    if (forms.some((form) => form.toLowerCase() === q)) {
      push(formExact, entry)
      continue
    }
    if (id.startsWith(q)) {
      push(prefix, entry)
      continue
    }
    if (forms.some((form) => form.toLowerCase().startsWith(q))) {
      push(formPrefix, entry)
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

  if (englishQuery && q.length >= 4) {
    const maxDistance = q.length >= 7 ? 2 : 1
    for (const entry of entries) {
      if (seen.has(entry.id)) continue
      const candidates = [entry.id, ...(entry.forms ?? [])].map((value) =>
        value.toLowerCase(),
      )
      let best = maxDistance + 1
      for (const candidate of candidates) {
        best = Math.min(best, editDistance(q, candidate, maxDistance))
        if (best === 0) break
      }
      if (best <= maxDistance) near.push({ entry, distance: best })
    }
    near.sort(
      (a, b) =>
        a.distance - b.distance ||
        a.entry.rank - b.entry.rank ||
        a.entry.id.length - b.entry.id.length,
    )
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

  const englishResults = [
    ...exact,
    ...formExact,
    ...prefix,
    ...formPrefix,
    ...contains,
    ...near.map((item) => item.entry),
  ]
  return (englishQuery
    ? [...englishResults, ...chinese]
    : [...chinese, ...englishResults]
  ).slice(0, limit)
}

export function dictionaryMap(entries: DictionaryEntry[]): Map<string, DictionaryEntry> {
  return new Map(entries.map((entry) => [entry.id, entry]))
}
