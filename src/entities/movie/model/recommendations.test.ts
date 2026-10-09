import { describe, expect, it } from 'vitest'
import {
  MAX_RECOMMENDATIONS_LIMIT,
  MIN_RECOMMENDATIONS_LIMIT,
  parseMovieDetailsSearch,
} from './recommendations'

describe('parseMovieDetailsSearch', () => {
  it('accepts integer limits throughout the supported range', () => {
    expect(
      parseMovieDetailsSearch({ limit: String(MIN_RECOMMENDATIONS_LIMIT) }),
    ).toEqual({ limit: 1 })
    expect(
      parseMovieDetailsSearch({ limit: MAX_RECOMMENDATIONS_LIMIT }),
    ).toEqual({ limit: 20 })
  })

  it('falls back to the default state for missing or invalid limits', () => {
    expect(parseMovieDetailsSearch({})).toEqual({})
    expect(parseMovieDetailsSearch({ limit: 0 })).toEqual({})
    expect(parseMovieDetailsSearch({ limit: 21 })).toEqual({})
    expect(parseMovieDetailsSearch({ limit: 1.5 })).toEqual({})
    expect(parseMovieDetailsSearch({ limit: 'many' })).toEqual({})
  })
})
