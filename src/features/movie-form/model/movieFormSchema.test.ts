import { describe, expect, it } from 'vitest'
import {
  type MovieFormInput,
  movieFormSchema,
  toMovieFormInput,
} from './movieFormSchema'

describe('movieFormSchema', () => {
  it('normalizes form values into the API payload shape', () => {
    expect(
      movieFormSchema.parse({
        title: '  Arrival  ',
        release_year: '2016',
        description: '  First contact.  ',
        genres: 'Drama, Science Fiction',
      }),
    ).toEqual({
      title: 'Arrival',
      release_year: 2016,
      description: 'First contact.',
      genres: ['Drama', 'Science Fiction'],
    })
  })

  it('rejects duplicate genres regardless of casing', () => {
    const result = movieFormSchema.safeParse({
      title: 'Alien',
      release_year: '1979',
      description: '',
      genres: 'Horror, horror',
    })

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors.genres).toContain(
      'Genres must be unique.',
    )
  })

  it.each([
    {
      field: 'title',
      value: {
        title: 'A'.repeat(256),
        release_year: '2000',
        description: '',
        genres: '',
      },
    },
    {
      field: 'release_year',
      value: {
        title: 'A movie',
        release_year: '1887',
        description: '',
        genres: '',
      },
    },
    {
      field: 'genres',
      value: {
        title: 'A movie',
        release_year: '2000',
        description: '',
        genres: Array.from({ length: 11 }, (_, index) => `Genre ${index}`).join(
          ', ',
        ),
      },
    },
    {
      field: 'genres',
      value: {
        title: 'A movie',
        release_year: '2000',
        description: '',
        genres: 'G'.repeat(51),
      },
    },
  ] satisfies Array<{
    field: keyof MovieFormInput
    value: MovieFormInput
  }>)('enforces the backend constraint for $field', ({ field, value }) => {
    const result = movieFormSchema.safeParse(value)

    expect(result.success).toBe(false)
    expect(result.error?.flatten().fieldErrors[field]).toBeDefined()
  })

  it('converts API values into editable form inputs', () => {
    expect(
      toMovieFormInput({
        title: 'Alien',
        release_year: 1979,
        description: null,
        genres: ['Horror', 'Science Fiction'],
      }),
    ).toEqual({
      title: 'Alien',
      release_year: 1979,
      description: '',
      genres: 'Horror, Science Fiction',
    })
  })
})
