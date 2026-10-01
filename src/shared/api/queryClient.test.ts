import { describe, expect, it } from 'vitest'
import { ApiError } from './errors'
import {
  createAppQueryClient,
  MAX_QUERY_RETRIES,
  QUERY_GC_TIME_MS,
  QUERY_STALE_TIME_MS,
  shouldRetryApiQuery,
} from './queryClient'

describe('shouldRetryApiQuery', () => {
  it('retries transient failures at most twice', () => {
    const error = new ApiError({
      kind: 'network',
      message: 'Network failure',
    })

    expect(shouldRetryApiQuery(0, error)).toBe(true)
    expect(shouldRetryApiQuery(1, error)).toBe(true)
    expect(shouldRetryApiQuery(MAX_QUERY_RETRIES, error)).toBe(false)
  })

  it.each([404, 422, 429])('does not retry HTTP %s', (status) => {
    const error = new ApiError({
      kind: status === 422 ? 'validation' : 'http',
      message: 'Expected client error',
      status,
    })

    expect(shouldRetryApiQuery(0, error)).toBe(false)
  })
})

describe('createAppQueryClient', () => {
  it('provides shared query and mutation defaults', () => {
    const client = createAppQueryClient()

    expect(client.getDefaultOptions()).toMatchObject({
      mutations: { retry: false },
      queries: {
        gcTime: QUERY_GC_TIME_MS,
        refetchOnWindowFocus: false,
        retry: shouldRetryApiQuery,
        staleTime: QUERY_STALE_TIME_MS,
      },
    })
  })
})
