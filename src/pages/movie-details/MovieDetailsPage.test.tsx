import { screen, waitFor, within } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
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
      within(section).getAllByRole('list', { name: 'Matching genres' })[0],
    ).toHaveTextContent('Science Fiction')
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
})
