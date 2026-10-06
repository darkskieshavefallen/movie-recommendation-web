import { describe, expect, it } from 'vitest'
import { ApiError } from '@/shared/api/errors'
import {
  getMovieCrudErrorToast,
  getMovieCrudSuccessToast,
} from './movieCrudFeedback'

describe('movie CRUD feedback', () => {
  it.each([
    ['create', 'Movie created'],
    ['update', 'Movie updated'],
    ['delete', 'Movie deleted'],
  ] as const)('provides consistent %s success feedback', (action, title) => {
    expect(getMovieCrudSuccessToast(action, 'Alien')).toMatchObject({
      title,
      type: 'success',
    })
  })

  it('never exposes backend details in error feedback', () => {
    const toast = getMovieCrudErrorToast(
      'delete',
      new ApiError({
        body: { detail: 'private database constraint name' },
        kind: 'http',
        message: 'Raw backend failure',
        status: 500,
      }),
    )

    expect(toast).toEqual({
      title: 'Movie not deleted',
      description:
        'The server could not complete the request. Try again later.',
      type: 'error',
    })
  })
})
