import { describe, expect, it } from 'vitest'
import { wordRelations } from './relations'
import { wordById } from './words.sample'

describe('word relations', () => {
  it('only references sample words', () => {
    for (const id of Object.keys(wordRelations)) {
      expect(wordById.has(id), id).toBe(true)
    }
  })

  it('has at least one synonym and one antonym', () => {
    for (const [id, relation] of Object.entries(wordRelations)) {
      expect(relation.syn.length, id).toBeGreaterThan(0)
      expect(relation.ant.length, id).toBeGreaterThan(0)
    }
  })
})
