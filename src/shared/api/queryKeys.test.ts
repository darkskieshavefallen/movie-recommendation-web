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
    expect(queryKeys.movies.recommendation({ limit: 5, movieId: 7 })).toEqual([
      'movies',
      'recommendations',
      7,
      { limit: 5 },
    ])
  })

  it('groups recommendations for invalidation while separating sources and limits', () => {
    expect(queryKeys.movies.recommendations()).toEqual([
      'movies',
      'recommendations',
    ])
    expect(queryKeys.movies.recommendationsFor(7)).toEqual([
      'movies',
      'recommendations',
      7,
    ])
    expect(
      queryKeys.movies.recommendation({ limit: 5, movieId: 7 }),
    ).not.toEqual(queryKeys.movies.recommendation({ limit: 10, movieId: 7 }))
    expect(
      queryKeys.movies.recommendation({ limit: 5, movieId: 7 }),
    ).not.toEqual(queryKeys.movies.recommendation({ limit: 5, movieId: 8 }))
  })

  it('keeps external search separate from the local catalog', () => {
    expect(queryKeys.externalSearch.results('Alien')).toEqual([
      'external-search',
      { query: 'Alien' },
    ])
  })
})
