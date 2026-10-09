import { screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { ExternalMovieSearchResponse } from '@/entities/external-movie/model/types'
import { renderRoute } from '@/test/renderRoute'

const EXTERNAL_SEARCH_URL = '*/external/movies/search'
const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function providerError(status: number, detail: string) {
  return http.get(EXTERNAL_SEARCH_URL, () =>
    HttpResponse.json(
      {
        detail,
        debug: 'token=must-never-be-rendered',
      },
      { status },
    ),
  )
}

describe('external search errors', () => {
  it.each([
    {
      detail: 'External movie catalog is disabled.',
      status: 503,
      title: 'External catalog is turned off',
      retryable: false,
    },
    {
      detail: 'External movie provider authentication failed.',
      status: 502,
      title: 'External catalog needs configuration',
      retryable: false,
    },
    {
      detail: 'External movie provider rate limit exceeded.',
      status: 429,
      title: 'External catalog request limit reached',
      retryable: true,
    },
    {
      detail: 'External movie provider timed out.',
      status: 504,
      title: 'External catalog timed out',
      retryable: true,
    },
    {
      detail: 'External movie provider is unavailable.',
      status: 503,
      title: 'External catalog is unavailable',
      retryable: true,
    },
  ])('renders a safe $status state for $title', async ({
    detail,
    retryable,
    status,
    title,
  }) => {
    server.use(providerError(status, detail))

    await renderRoute('/external-search?query=Alien')

    const alert = await screen.findByRole('alert')

    expect(alert).toHaveTextContent(title)
    expect(alert).toHaveTextContent('External catalog only')
    expect(alert).not.toHaveTextContent(detail)
    expect(alert).not.toHaveTextContent('token=must-never-be-rendered')
    const retryButton = screen.queryByRole('button', {
      name: 'Try external search again',
    })

    if (retryable) {
      expect(retryButton).toBeVisible()
    } else {
      expect(retryButton).not.toBeInTheDocument()
    }
    expect(
      screen.getByRole('link', { name: 'Open local catalog' }),
    ).toHaveAttribute('href', '/movies?limit=20&offset=0')
  })

  it('retries a transient provider failure only after the user asks', async () => {
    let requestCount = 0

    server.use(
      http.get(EXTERNAL_SEARCH_URL, ({ request }) => {
        requestCount += 1

        if (requestCount === 1) {
          return HttpResponse.json(
            { detail: 'External movie provider timed out.' },
            { status: 504 },
          )
        }

        const query = new URL(request.url).searchParams.get('query') ?? ''

        return HttpResponse.json({
          query,
          results: [
            {
              external_id: 'retry-success',
              title: 'Alien',
              release_year: 1979,
              description: 'Recovered after a provider timeout.',
            },
          ],
        } satisfies ExternalMovieSearchResponse)
      }),
    )

    const { user } = await renderRoute('/external-search?query=Alien')

    const retryButton = await screen.findByRole('button', {
      name: 'Try external search again',
    })
    expect(requestCount).toBe(1)

    await user.click(retryButton)

    expect(
      await screen.findByRole('heading', { name: 'Results for “Alien”' }),
    ).toBeVisible()
    expect(
      screen.getByText('Recovered after a provider timeout.'),
    ).toBeVisible()
    expect(requestCount).toBe(2)
  })

  it('keeps an unknown provider body private', async () => {
    server.use(
      providerError(
        502,
        'raw provider exception with api_key=super-secret-value',
      ),
    )

    await renderRoute('/external-search?query=Alien')

    const alert = await screen.findByRole('alert')

    expect(alert).toHaveTextContent('External catalog response failed')
    expect(alert).not.toHaveTextContent('super-secret-value')
    expect(
      screen.queryByRole('button', { name: 'Try external search again' }),
    ).not.toBeInTheDocument()
  })
})
