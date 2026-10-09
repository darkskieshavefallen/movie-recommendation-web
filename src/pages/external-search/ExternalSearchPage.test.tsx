import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { ExternalMovieSearchResponse } from '@/entities/external-movie/model/types'
import { externalMovieHandlers } from '@/mocks/handlers'
import { MAX_EXTERNAL_SEARCH_QUERY_LENGTH } from '@/shared/lib/router/searchParams'
import { renderRoute } from '@/test/renderRoute'

const server = setupServer(...externalMovieHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('external search form', () => {
  it('stores only a submitted query in the URL', async () => {
    const requestedQueries: string[] = []

    server.use(
      http.get('*/external/movies/search', ({ request }) => {
        const query = new URL(request.url).searchParams.get('query') ?? ''
        requestedQueries.push(query)

        return HttpResponse.json({
          query,
          results: [],
        } satisfies ExternalMovieSearchResponse)
      }),
    )

    const { router, user } = await renderRoute('/external-search')
    const input = screen.getByRole('textbox', { name: 'Movie title' })

    await user.type(input, 'Alien')

    expect(router.state.location.search).toEqual({})
    expect(requestedQueries).toEqual([])
    expect(screen.getByRole('status')).toHaveTextContent(
      'Enter a movie title to start an external search.',
    )

    await user.click(screen.getByRole('button', { name: 'Search' }))

    await waitFor(() => {
      expect(router.state.location.search).toEqual({ query: 'Alien' })
    })
    expect(
      await screen.findByRole('heading', { name: 'No external matches' }),
    ).toBeVisible()
    expect(requestedQueries).toEqual(['Alien'])
  })

  it('restores a normalized query from a direct URL', async () => {
    await renderRoute('/external-search?query=%20Blade%20Runner%20')

    expect(screen.getByRole('textbox', { name: 'Movie title' })).toHaveValue(
      'Blade Runner',
    )
    expect(
      await screen.findByRole('heading', {
        name: 'Results for “Blade Runner”',
      }),
    ).toBeVisible()
  })

  it('restores submitted queries across back and forward navigation', async () => {
    const { history, router, user } = await renderRoute('/external-search')

    await user.type(
      screen.getByRole('textbox', { name: 'Movie title' }),
      'Alien',
    )
    await user.click(screen.getByRole('button', { name: 'Search' }))
    await waitFor(() => {
      expect(router.state.location.search).toEqual({ query: 'Alien' })
    })

    const input = screen.getByRole('textbox', { name: 'Movie title' })
    await user.clear(input)
    await user.type(input, 'Arrival')
    await user.click(screen.getByRole('button', { name: 'Search' }))
    await waitFor(() => {
      expect(router.state.location.search).toEqual({ query: 'Arrival' })
    })

    history.back()
    await waitFor(() => {
      expect(router.state.location.search).toEqual({ query: 'Alien' })
    })
    expect(screen.getByRole('textbox', { name: 'Movie title' })).toHaveValue(
      'Alien',
    )

    history.forward()
    await waitFor(() => {
      expect(router.state.location.search).toEqual({ query: 'Arrival' })
    })
    expect(screen.getByRole('textbox', { name: 'Movie title' })).toHaveValue(
      'Arrival',
    )
  })

  it('rejects empty and oversized submissions without changing the URL', async () => {
    const { router, user } = await renderRoute('/external-search')
    const input = screen.getByRole('textbox', { name: 'Movie title' })
    const submitButton = screen.getByRole('button', { name: 'Search' })

    await user.click(submitButton)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter a movie title before searching.',
    )
    expect(router.state.location.search).toEqual({})

    fireEvent.change(input, {
      target: { value: 'a'.repeat(MAX_EXTERNAL_SEARCH_QUERY_LENGTH + 1) },
    })
    await user.click(submitButton)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Keep the search query to 200 characters or fewer.',
    )
    expect(router.state.location.search).toEqual({})
  })

  it('renders provider-independent results and missing-field fallbacks', async () => {
    await renderRoute('/external-search?query=Alien')

    const results = await screen.findByRole('region', {
      name: 'Results for “Alien”',
    })
    const resultArticles = within(results).getAllByRole('article')

    expect(resultArticles).toHaveLength(2)
    expect(resultArticles[0]).toHaveTextContent('Alien')
    expect(resultArticles[0]).toHaveTextContent('1979')
    expect(resultArticles[0]).toHaveTextContent(
      'A space crew encounters a dangerous life-form',
    )
    expect(resultArticles[1]).toHaveTextContent('Release year not provided')
    expect(resultArticles[1]).toHaveTextContent('Description not provided.')
    expect(within(results).getAllByText('External catalog')).toHaveLength(2)
    expect(
      screen.queryByRole('button', { name: /import/i }),
    ).not.toBeInTheDocument()
  })

  it('renders long descriptions in full', async () => {
    const longDescription = 'A detailed external synopsis. '.repeat(30).trim()

    server.use(
      http.get('*/external/movies/search', () =>
        HttpResponse.json({
          query: 'Long movie',
          results: [
            {
              external_id: 'long-description',
              title: 'A Movie With A Long Description',
              release_year: 2026,
              description: longDescription,
            },
          ],
        } satisfies ExternalMovieSearchResponse),
      ),
    )

    await renderRoute('/external-search?query=Long%20movie')

    expect(await screen.findByText(longDescription)).toBeVisible()
  })

  it('treats an empty provider response as a successful search', async () => {
    server.use(
      http.get('*/external/movies/search', ({ request }) => {
        const query = new URL(request.url).searchParams.get('query') ?? ''

        return HttpResponse.json({
          query,
          results: [],
        } satisfies ExternalMovieSearchResponse)
      }),
    )

    await renderRoute('/external-search?query=Missing')

    expect(
      await screen.findByRole('heading', { name: 'No external matches' }),
    ).toBeVisible()
    expect(screen.getByRole('status')).toHaveTextContent('“Missing”')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
