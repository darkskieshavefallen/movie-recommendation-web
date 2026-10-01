import { QueryClient } from '@tanstack/react-query'
import { isRetryableApiError } from './errors'

export const QUERY_STALE_TIME_MS = 30_000
export const QUERY_GC_TIME_MS = 5 * 60_000
export const MAX_QUERY_RETRIES = 2

export function shouldRetryApiQuery(
  failureCount: number,
  error: unknown,
): boolean {
  return failureCount < MAX_QUERY_RETRIES && isRetryableApiError(error)
}

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: QUERY_GC_TIME_MS,
        refetchOnWindowFocus: false,
        retry: shouldRetryApiQuery,
        staleTime: QUERY_STALE_TIME_MS,
      },
      mutations: {
        retry: false,
      },
    },
  })
}
