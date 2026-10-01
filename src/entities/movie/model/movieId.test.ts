import { describe, expect, it } from 'vitest'
import { parseMovieId } from './movieId'

describe('parseMovieId', () => {
  it.each([
    ['1', 1],
    ['42', 42],
  ])('parses the valid route ID %s', (value, expected) => {
    expect(parseMovieId(value)).toBe(expected)
  })

  it.each([
    '',
    ' ',
    '0',
    '-1',
    '1.5',
    'movie',
    '9007199254740992',
  ])('rejects the invalid route ID %s', (value) => {
    expect(parseMovieId(value)).toBeNull()
  })
})
