import { describe, expect, it } from 'vitest'
import {
  MAX_EXTERNAL_SEARCH_QUERY_LENGTH,
  parseCatalogSearch,
  parseExternalSearch,
} from './searchParams'

describe('parseCatalogSearch', () => {
  it('uses defaults when pagination is absent', () => {
    expect(parseCatalogSearch({})).toEqual({ offset: 0, limit: 20 })
  })

  it('accepts non-negative integers from URL strings', () => {
    expect(parseCatalogSearch({ offset: '40', limit: '10' })).toEqual({
      offset: 40,
      limit: 10,
    })
  })

  it('rejects invalid offsets and out-of-range limits', () => {
    expect(parseCatalogSearch({ offset: -1, limit: 101 })).toEqual({
      offset: 0,
      limit: 20,
    })
    expect(parseCatalogSearch({ offset: 1.5, limit: 0 })).toEqual({
      offset: 0,
      limit: 20,
    })
    expect(
      parseCatalogSearch({ offset: Number.MAX_SAFE_INTEGER + 1, limit: ' ' }),
    ).toEqual({
      offset: 0,
      limit: 20,
    })
    expect(parseCatalogSearch({ offset: false, limit: ['10'] })).toEqual({
      offset: 0,
      limit: 20,
    })
  })
})

describe('parseExternalSearch', () => {
  it('trims a valid query', () => {
    expect(parseExternalSearch({ query: '  Alien  ' })).toEqual({
      query: 'Alien',
    })
  })

  it('accepts the backend maximum query length', () => {
    const query = 'a'.repeat(MAX_EXTERNAL_SEARCH_QUERY_LENGTH)

    expect(parseExternalSearch({ query })).toEqual({ query })
  })

  it('rejects empty, non-string, and oversized queries', () => {
    expect(parseExternalSearch({ query: '   ' })).toEqual({})
    expect(parseExternalSearch({ query: 42 })).toEqual({})
    expect(
      parseExternalSearch({
        query: 'a'.repeat(MAX_EXTERNAL_SEARCH_QUERY_LENGTH + 1),
      }),
    ).toEqual({})
  })
})
