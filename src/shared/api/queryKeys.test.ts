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
    expect(queryKeys.movies.recommendations({ limit: 5, movieId: 7 })).toEqual([
      'movies',
      'detail',
      7,
      'recommendations',
      { limit: 5 },
    ])
  })

  it('separates recommendation caches by source movie and limit', () => {
    expect(
      queryKeys.movies.recommendations({ limit: 5, movieId: 7 }),
    ).not.toEqual(queryKeys.movies.recommendations({ limit: 10, movieId: 7 }))
    expect(
      queryKeys.movies.recommendations({ limit: 5, movieId: 7 }),
    ).not.toEqual(queryKeys.movies.recommendations({ limit: 5, movieId: 8 }))
  })

  it('keeps external search separate from the local catalog', () => {
    expect(queryKeys.externalSearch.results('Alien')).toEqual([
      'external-search',
      { query: 'Alien' },
    ])
  })
})
