import { describe, expect, it } from 'vitest'
import { ApiError, isRetryableApiError, toApiErrorViewModel } from './errors'

describe('toApiErrorViewModel', () => {
  it.each([
    ['network', undefined, 'network', true],
    ['http', 404, 'not_found', false],
    ['validation', 422, 'validation', false],
    ['http', 429, 'rate_limited', false],
    ['http', 503, 'service_unavailable', true],
    ['http', 500, 'server', true],
  ] as const)('maps %s/%s to %s', (kind, status, code, retryable) => {
    const error = new ApiError({
      body: { detail: 'diagnostic detail' },
      cause: new Error('technical cause'),
      kind,
      message: 'Raw API error',
      ...(status === undefined ? {} : { status }),
    })

    const viewModel = toApiErrorViewModel(error)

    expect(viewModel).toMatchObject({ code, retryable })
    expect(viewModel.message).not.toContain('diagnostic detail')
    expect(viewModel.technicalCause).toBe(error)
  })

  it('uses a safe fallback for an unknown error', () => {
    const error = new Error('secret internal detail')

    expect(toApiErrorViewModel(error)).toEqual({
      code: 'unknown',
      message: 'An unexpected error occurred. Try again.',
      retryable: false,
      technicalCause: error,
      title: 'Something went wrong',
    })
  })
})

describe('isRetryableApiError', () => {
  it('does not retry expected client errors', () => {
    for (const status of [400, 404, 422, 429]) {
      expect(
        isRetryableApiError(
          new ApiError({ kind: 'http', message: 'Client error', status }),
        ),
      ).toBe(false)
    }
  })
})
