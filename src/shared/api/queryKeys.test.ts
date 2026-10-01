import { describe, expect, it } from 'vitest'
import { queryKeys } from './queryKeys'

describe('queryKeys', () => {
  it('builds hierarchical movie keys', () => {
    expect(queryKeys.movies.list({ limit: 20, offset: 40 })).toEqual([
      'movies',
      'list',
      { limit: 20, offset: 40 },
    ])
    expect(queryKeys.movies.detail(7)).toEqual(['movies', 'detail', 7])
    expect(queryKeys.movies.recommendations(7)).toEqual([
      'movies',
      'detail',
      7,
      'recommendations',
    ])
  })

  it('keeps external search separate from the local catalog', () => {
    expect(queryKeys.externalSearch.results('Alien')).toEqual([
      'external-search',
      { query: 'Alien' },
    ])
  })
})
