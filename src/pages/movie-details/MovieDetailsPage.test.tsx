import { screen, waitFor, within } from '@testing-library/react'
import { delay, HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { MovieRecommendations } from '@/entities/movie/model/types'
import { movieHandlers } from '@/mocks/handlers'
import { renderRoute } from '@/test/renderRoute'

const server = setupServer(...movieHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('movie recommendations', () => {
  it('renders backend-ranked recommendations with matching genre explanations', async () => {
    await renderRoute('/movies/1?limit=2')

    const section = await screen.findByRole('region', {
      name: 'Similar movies',
    })
    const recommendationHeadings = within(section).getAllByRole('heading', {
      level: 3,
    })

    expect(
      recommendationHeadings.map(({ textContent }) => textContent),
    ).toEqual(['Arrival', 'Blade Runner'])
    expect(
      within(section)
        .getAllByRole('list', { name: 'Matching genres' })
        .map((list) =>
          within(list)
            .getAllByRole('listitem')
            .map(({ textContent }) => textContent),
        ),
    ).toEqual([['Science Fiction'], ['Science Fiction', 'Thriller']])
    expect(
      within(section).getByRole('link', { name: /Arrival/ }),
    ).toHaveAttribute('href', '/movies/2?limit=2')
  })

  it('stores limit changes in the URL and sends them to the backend', async () => {
    const requestedLimits: string[] = []

    server.use(
      http.get('*/movies/:movieId/recommendations', ({ params, request }) => {
        const limit = new URL(request.url).searchParams.get('limit') ?? ''
        requestedLimits.push(limit)

        return HttpResponse.json({
          source_movie_id: Number(params.movieId),
          recommendations: [],
        } satisfies MovieRecommendations)
      }),
    )

    const { router, user } = await renderRoute('/movies/1?limit=1')
    const limitControl = await screen.findByRole('combobox', {
      name: 'Number of recommendations',
    })

    await user.selectOptions(limitControl, '20')

    await waitFor(() => {
      expect(router.state.location.search).toEqual({ limit: 20 })
      expect(requestedLimits).toContain('20')
    })
  })

  it('keeps recommendation links keyboard-focusable', async () => {
    const { user } = await renderRoute('/movies/1?limit=2')
    const recommendationLink = await screen.findByRole('link', {
      name: /Arrival/,
    })

    for (
      let tabIndex = 0;
      tabIndex < 12 && document.activeElement !== recommendationLink;
      tabIndex += 1
    ) {
      await user.tab()
    }

    expect(recommendationLink).toHaveFocus()
  })

  it('shows a dedicated loading state while recommendations are pending', async () => {
    server.use(
      http.get('*/movies/:movieId/recommendations', async () => {
        await delay('infinite')
        return HttpResponse.json({
          source_movie_id: 1,
          recommendations: [],
        } satisfies MovieRecommendations)
      }),
    )

    await renderRoute('/movies/1')

    expect(
      await screen.findByRole('heading', { name: 'Alien', level: 1 }),
    ).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Loading recommendations…',
    )
  })

  it('treats an empty recommendation list as a successful state', async () => {
    server.use(
      http.get('*/movies/:movieId/recommendations', ({ params }) =>
        HttpResponse.json({
          source_movie_id: Number(params.movieId),
          recommendations: [],
        } satisfies MovieRecommendations),
      ),
    )

    await renderRoute('/movies/1')

    expect(
      await screen.findByRole('heading', { name: 'No similar movies yet' }),
    ).toBeVisible()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('explains a recommendation failure and retries it', async () => {
    let isOffline = true

    server.use(
      http.get('*/movies/:movieId/recommendations', () =>
        isOffline
          ? HttpResponse.error()
          : HttpResponse.json({
              source_movie_id: 1,
              recommendations: [
                {
                  movie_id: 2,
                  title: 'Arrival',
                  release_year: 2016,
                  matching_genres: ['Science Fiction'],
                },
              ],
            } satisfies MovieRecommendations),
      ),
    )

    const { user } = await renderRoute('/movies/1')
    const retryButton = await screen.findByRole('button', { name: 'Try again' })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Recommendations unavailable',
    )

    isOffline = false
    await user.click(retryButton)

    expect(
      await screen.findByRole('heading', { name: 'Arrival', level: 3 }),
    ).toBeVisible()
  })

  it('supports cyclic recommendation navigation without retaining old content', async () => {
    const { user } = await renderRoute('/movies/1?limit=2')

    await user.click(await screen.findByRole('link', { name: /Arrival/ }))

    expect(
      await screen.findByRole('heading', { name: 'Arrival', level: 1 }),
    ).toBeVisible()
    expect(
      await screen.findByRole('link', { name: /Alien 1979/ }),
    ).toHaveAttribute('href', '/movies/1?limit=2')
    expect(
      screen.queryByRole('heading', { name: 'Blade Runner', level: 3 }),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /Alien 1979/ }))

    expect(
      await screen.findByRole('heading', { name: 'Alien', level: 1 }),
    ).toBeVisible()
    expect(
      await screen.findByRole('heading', { name: 'Arrival', level: 3 }),
    ).toBeVisible()
  })

  it('restores the recommendation source and limit on a direct route refresh', async () => {
    const recommendationRequests: string[] = []

    server.use(
      http.get('*/movies/:movieId/recommendations', ({ params, request }) => {
        recommendationRequests.push(request.url)

        return HttpResponse.json({
          source_movie_id: Number(params.movieId),
          recommendations: [
            {
              movie_id: 1,
              title: 'Alien',
              release_year: 1979,
              matching_genres: ['Science Fiction'],
            },
          ],
        } satisfies MovieRecommendations)
      }),
    )

    await renderRoute('/movies/2?limit=1')

    expect(
      await screen.findByRole('heading', { name: 'Arrival', level: 1 }),
    ).toBeVisible()
    expect(
      screen.getByRole('combobox', { name: 'Number of recommendations' }),
    ).toHaveValue('1')
    expect(
      await screen.findByRole('link', { name: /Alien 1979/ }),
    ).toHaveAttribute('href', '/movies/1?limit=1')
    expect(recommendationRequests).toHaveLength(1)
    const [recommendationRequest] = recommendationRequests
    if (!recommendationRequest) {
      throw new Error('Expected one recommendation request')
    }
    const recommendationUrl = new URL(recommendationRequest)

    expect(recommendationUrl.pathname).toBe('/movies/2/recommendations')
    expect(recommendationUrl.searchParams.get('limit')).toBe('1')
  })

  it('renders long recommendation titles and genres without truncating content', async () => {
    const longTitle =
      'A Very Long Recommendation Title That Must Remain Available to Readers'
    const longGenre = 'Speculative Science Fiction With An Unusually Long Name'

    server.use(
      http.get('*/movies/:movieId/recommendations', () =>
        HttpResponse.json({
          source_movie_id: 1,
          recommendations: [
            {
              movie_id: 20,
              title: longTitle,
              release_year: 2026,
              matching_genres: [longGenre],
            },
          ],
        } satisfies MovieRecommendations),
      ),
    )

    await renderRoute('/movies/1')

    expect(
      await screen.findByRole('heading', { name: longTitle, level: 3 }),
    ).toBeVisible()
    expect(screen.getByText(longGenre)).toBeVisible()
  })
})
