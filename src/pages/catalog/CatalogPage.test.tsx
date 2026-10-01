import { screen } from '@testing-library/react'
import { delay, HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { movieFixtures } from '@/mocks/fixtures/movies'
import { movieHandlers } from '@/mocks/handlers'
import { renderRoute } from '@/test/renderRoute'

const server = setupServer(...movieHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('movie catalog', () => {
  it('renders movies in backend order with links to their details', async () => {
    await renderRoute('/movies?offset=0&limit=20')

    const movieHeadings = await screen.findAllByRole('heading', { level: 2 })

    expect(movieHeadings.map((heading) => heading.textContent)).toEqual([
      'Alien',
      'Arrival',
    ])
    expect(
      screen.getByRole('link', { name: /Alien 1979 Genres/ }),
    ).toHaveAttribute('href', '/movies/1')
  })

  it('shows a skeleton while the catalog request is pending', async () => {
    server.use(
      http.get('*/movies/', async () => {
        await delay('infinite')
        return HttpResponse.json([])
      }),
    )

    await renderRoute('/movies?offset=0&limit=20')

    expect(screen.getByRole('status')).toHaveTextContent(
      'Loading movie catalog…',
    )
  })

  it('shows an empty state with a create action', async () => {
    server.use(http.get('*/movies/', () => HttpResponse.json([])))

    await renderRoute('/movies?offset=0&limit=20')

    expect(
      await screen.findByRole('heading', { name: 'Your catalog is empty' }),
    ).toBeVisible()
    expect(
      screen.getByRole('link', { name: 'Create the first movie' }),
    ).toHaveAttribute('href', '/movies/new')
  })

  it('shows an offline state after a network failure', async () => {
    server.use(http.get('*/movies/', () => HttpResponse.error()))

    await renderRoute('/movies?offset=0&limit=20')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Catalog unavailable',
    )
    expect(screen.getByRole('button', { name: 'Try again' })).toBeEnabled()
  })

  it('retries the request when the user activates Try again', async () => {
    let isOffline = true

    server.use(
      http.get('*/movies/', () =>
        isOffline ? HttpResponse.error() : HttpResponse.json(movieFixtures),
      ),
    )

    const { user } = await renderRoute('/movies?offset=0&limit=20')
    const retryButton = await screen.findByRole('button', { name: 'Try again' })

    isOffline = false
    await user.click(retryButton)

    expect(
      await screen.findByRole('heading', { name: 'Alien', level: 2 }),
    ).toBeVisible()
  })

  it('shows a dedicated not-found state for an unknown movie', async () => {
    await renderRoute('/movies/999')

    expect(
      await screen.findByRole('heading', {
        name: 'This movie is not in the catalog',
      }),
    ).toBeVisible()
    expect(
      screen.getByRole('link', { name: 'Back to catalog' }),
    ).toHaveAttribute('href', '/movies?offset=0&limit=20')
  })

  it('opens a movie from its focused card link with the keyboard', async () => {
    const { user } = await renderRoute('/movies?offset=0&limit=20')
    const movieLink = await screen.findByRole('link', {
      name: /Alien 1979 Genres/,
    })

    for (
      let tabIndex = 0;
      tabIndex < 10 && document.activeElement !== movieLink;
      tabIndex += 1
    ) {
      await user.tab()
    }

    expect(movieLink).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(
      await screen.findByRole('heading', { name: 'Alien', level: 1 }),
    ).toBeVisible()
  })
})
