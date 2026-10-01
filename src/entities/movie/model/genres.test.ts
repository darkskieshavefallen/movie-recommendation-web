import { describe, expect, it } from 'vitest'
import { normalizeGenres } from './genres'

describe('normalizeGenres', () => {
  it('trims, deduplicates, and formats genres without reordering them', () => {
    expect(
      normalizeGenres([' science fiction ', 'Drama', 'SCIENCE FICTION', '']),
    ).toEqual(['Science fiction', 'Drama'])
  })

  it('returns an empty list when genres are absent', () => {
    expect(normalizeGenres(undefined)).toEqual([])
  })
})
