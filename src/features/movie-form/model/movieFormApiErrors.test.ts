import { describe, expect, it } from 'vitest'
import { ApiError } from '@/shared/api/errors'
import { getMovieFormFieldErrors } from './movieFormApiErrors'

describe('getMovieFormFieldErrors', () => {
  it('maps FastAPI 422 locations to form fields', () => {
    const error = new ApiError({
      kind: 'validation',
      message: 'Validation failed',
      status: 422,
      body: {
        detail: [
          {
            loc: ['body', 'title'],
            msg: 'Title already exists',
            type: 'value_error',
          },
          {
            loc: ['body', 'genres', 0],
            msg: 'Genre is too long',
            type: 'string_too_long',
          },
        ],
      },
    })

    expect(getMovieFormFieldErrors(error)).toEqual({
      title: 'Title already exists',
      genres: 'Genre is too long',
    })
  })

  it('ignores non-validation and malformed errors', () => {
    expect(getMovieFormFieldErrors(new Error('No connection'))).toEqual({})
    expect(
      getMovieFormFieldErrors(
        new ApiError({
          kind: 'validation',
          message: 'Validation failed',
          status: 422,
          body: { detail: 'invalid' },
        }),
      ),
    ).toEqual({})
  })
})
