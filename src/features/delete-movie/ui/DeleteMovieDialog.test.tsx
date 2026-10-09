import { screen, waitFor } from '@testing-library/react'
import { delay, HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { movieFixtures } from '@/mocks/fixtures/movies'
import { movieHandlers } from '@/mocks/handlers'
import { queryKeys } from '@/shared/api/queryKeys'
import { renderRoute } from '@/test/renderRoute'

const server = setupServer(...movieHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('DeleteMovieDialog', () => {
  it('names the movie and sends no request when cancelled', async () => {
    let requestCount = 0
    server.use(
      http.delete('*/movies/:movieId', () => {
        requestCount += 1
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = await renderRoute('/movies/1')

    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('dialog', { name: 'Delete Alien?' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(requestCount).toBe(0)
  })

  it('traps keyboard focus and restores it after Escape', async () => {
    const { user } = await renderRoute('/movies/1')
    const trigger = await screen.findByRole('button', { name: 'Delete' })

    trigger.focus()
    await user.keyboard('{Enter}')

    const dialog = screen.getByRole('dialog', { name: 'Delete Alien?' })
    expect(dialog).toBeVisible()
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true)
    })

    await user.keyboard('{Escape}')

    expect(dialog).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('removes a deleted movie from cache and the catalog UI', async () => {
    let movies = [...movieFixtures]

    server.use(
      http.get('*/movies/', () => HttpResponse.json(movies)),
      http.delete('*/movies/:movieId', ({ params }) => {
        movies = movies.filter(({ id }) => id !== Number(params.movieId))
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { queryClient, user } = await renderRoute('/movies/1')

    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: 'Delete movie' }))

    expect(
      await screen.findByRole('heading', { name: 'Arrival', level: 2 }),
    ).toBeVisible()
    expect(
      screen.queryByRole('heading', { name: 'Alien', level: 2 }),
    ).not.toBeInTheDocument()
    expect(queryClient.getQueryData(queryKeys.movies.detail(1))).toBeUndefined()
    expect(await screen.findByText('Movie deleted')).toBeVisible()
  })

  it('blocks duplicate delete requests while pending', async () => {
    let requestCount = 0
    server.use(
      http.delete('*/movies/:movieId', async () => {
        requestCount += 1
        await delay(100)
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = await renderRoute('/movies/1')

    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await user.dblClick(screen.getByRole('button', { name: 'Delete movie' }))

    expect(screen.getByRole('button', { name: 'Deleting…' })).toBeDisabled()
    expect(requestCount).toBe(1)
  })

  it.each([
    [
      'not found',
      () => HttpResponse.json({ detail: 'private' }, { status: 404 }),
      'Not found',
    ],
    ['network error', () => HttpResponse.error(), 'Connection problem'],
  ] as const)('keeps the dialog controlled after %s', async (_, response, title) => {
    server.use(http.delete('*/movies/:movieId', response))

    const { user } = await renderRoute('/movies/1')

    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: 'Delete movie' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(title)
    expect(screen.getByRole('dialog', { name: 'Delete Alien?' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Delete movie' })).toBeEnabled()
    expect(await screen.findByText('Movie not deleted')).toBeVisible()
    await waitFor(() => expect(document.body).not.toHaveTextContent('private'))
  })
})
