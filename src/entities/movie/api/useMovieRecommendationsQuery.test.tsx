import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { delay, HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import type { PropsWithChildren } from 'react'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { MovieRecommendations } from '@/entities/movie/model/types'
import { toApiErrorViewModel } from '@/shared/api/errors'

const RECOMMENDATIONS_URL =
  'http://127.0.0.1:8000/movies/:movieId/recommendations'

const recommendations: MovieRecommendations = {
  source_movie_id: 1,
  recommendations: [
    {
      matching_genres: ['Science Fiction', 'Drama'],
      movie_id: 3,
      release_year: 2016,
      title: 'Arrival',
    },
    {
      matching_genres: ['Science Fiction'],
      movie_id: 2,
      release_year: 1982,
      title: 'Blade Runner',
    },
  ],
}

const server = setupServer()
let useMovieRecommendationsQuery: typeof import('./useMovieRecommendationsQuery')['useMovieRecommendationsQuery']

beforeAll(async () => {
  server.listen({ onUnhandledRequest: 'error' })
  const recommendationQueryModule = await import(
    './useMovieRecommendationsQuery'
  )
  useMovieRecommendationsQuery =
    recommendationQueryModule.useMovieRecommendationsQuery
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return function QueryWrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

describe('useMovieRecommendationsQuery', () => {
  it('does not request recommendations without a valid movie ID', () => {
    let requestCount = 0

    server.use(
      http.get(RECOMMENDATIONS_URL, () => {
        requestCount += 1
        return HttpResponse.json(recommendations)
      }),
    )

    const { result } = renderHook(
      () => useMovieRecommendationsQuery({ movieId: null }),
      { wrapper: createWrapper() },
    )

    expect(result.current.fetchStatus).toBe('idle')
    expect(requestCount).toBe(0)
  })

  it('passes the limit and preserves backend ranking and matching genres', async () => {
    let requestedLimit: string | null = null

    server.use(
      http.get(RECOMMENDATIONS_URL, ({ request }) => {
        requestedLimit = new URL(request.url).searchParams.get('limit')
        return HttpResponse.json(recommendations)
      }),
    )

    const { result } = renderHook(
      () => useMovieRecommendationsQuery({ limit: 2, movieId: 1 }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(requestedLimit).toBe('2')
    expect(result.current.data).toEqual(recommendations)
  })

  it('does not retain recommendations when the source movie changes', async () => {
    server.use(
      http.get(RECOMMENDATIONS_URL, async ({ params }) => {
        if (params.movieId === '2') {
          await delay('infinite')
        }

        return HttpResponse.json(recommendations)
      }),
    )

    const { rerender, result } = renderHook(
      ({ movieId }: { movieId: number }) =>
        useMovieRecommendationsQuery({ movieId }),
      {
        initialProps: { movieId: 1 },
        wrapper: createWrapper(),
      },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.source_movie_id).toBe(1)

    rerender({ movieId: 2 })

    expect(result.current.isPending).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  it('distinguishes an empty successful response from a missing source movie', async () => {
    server.use(
      http.get(RECOMMENDATIONS_URL, ({ params }) => {
        if (params.movieId === '999') {
          return new HttpResponse(null, { status: 404 })
        }

        return HttpResponse.json({
          source_movie_id: Number(params.movieId),
          recommendations: [],
        } satisfies MovieRecommendations)
      }),
    )

    const emptyQuery = renderHook(
      () => useMovieRecommendationsQuery({ movieId: 1 }),
      { wrapper: createWrapper() },
    )
    const missingQuery = renderHook(
      () => useMovieRecommendationsQuery({ movieId: 999 }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(emptyQuery.result.current.isSuccess).toBe(true))
    await waitFor(() => expect(missingQuery.result.current.isError).toBe(true))

    expect(emptyQuery.result.current.data?.recommendations).toEqual([])
    expect(toApiErrorViewModel(missingQuery.result.current.error).code).toBe(
      'not_found',
    )
  })
})
