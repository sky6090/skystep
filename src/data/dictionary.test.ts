import { describe, expect, it } from 'vitest'
import { searchDictionary, type DictionaryEntry } from './dictionary'

function entry(overrides: Partial<DictionaryEntry>): DictionaryEntry {
  return {
    id: 'word',
    w: 'word',
    p: '',
    t: '词',
    pos: 'n.',
    ex: '',
    exZh: '',
    phr: [],
    syn: [],
    forms: [],
    rank: 100,
    tag: 'CET-6',
    ...overrides,
  }
}

const entries = [
  entry({ id: 'study', w: 'study', t: '学习', forms: ['studies', 'studying'] }),
  entry({ id: 'ambiguous', w: 'ambiguous', t: '模棱两可的' }),
  entry({ id: 'abandon', w: 'abandon', t: '放弃' }),
  entry({ id: 'government', w: 'government', t: '政府', tag: '高频' }),
]

describe('dictionary search', () => {
  it('finds a word by its inflected form', () => {
    expect(searchDictionary(entries, 'studies')[0].id).toBe('study')
  })

  it('tolerates a one-letter typo', () => {
    expect(searchDictionary(entries, 'ambigous')[0].id).toBe('ambiguous')
  })

  it('supports Chinese reverse lookup', () => {
    expect(searchDictionary(entries, '放弃')[0].id).toBe('abandon')
  })

  it('prefers exam words for an empty query', () => {
    expect(searchDictionary(entries, '')[0].id).toBe('study')
  })
})
