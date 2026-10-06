import { screen } from '@testing-library/react'
import { delay, HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { MovieFixture } from '@/mocks/fixtures/movies'
import { movieFixtures } from '@/mocks/fixtures/movies'
import { movieHandlers } from '@/mocks/handlers'
import { renderRoute } from '@/test/renderRoute'

const server = setupServer(...movieHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('edit movie page', () => {
  it('loads existing data and replaces every movie field', async () => {
    let movies = [...movieFixtures]
    let receivedBody: unknown

    server.use(
      http.get('*/movies/', () => HttpResponse.json(movies)),
      http.get('*/movies/:movieId', ({ params }) => {
        const movie = movies.find(({ id }) => id === Number(params.movieId))

        return movie
          ? HttpResponse.json(movie)
          : HttpResponse.json({ detail: 'Movie not found' }, { status: 404 })
      }),
      http.put('*/movies/:movieId', async ({ params, request }) => {
        receivedBody = await request.json()
        const updatedMovie = {
          id: Number(params.movieId),
          ...(receivedBody as Omit<MovieFixture, 'id'>),
        }
        movies = movies.map((movie) =>
          movie.id === updatedMovie.id ? updatedMovie : movie,
        )

        return HttpResponse.json(updatedMovie)
      }),
    )

    const { user } = await renderRoute('/movies/1/edit')
    const title = await screen.findByLabelText('Title')
    const releaseYear = screen.getByLabelText('Release year')
    const description = screen.getByLabelText(/Description/)
    const genres = screen.getByLabelText(/Genres/)

    expect(title).toHaveValue('Alien')
    expect(releaseYear).toHaveValue(1979)
    expect(description).toHaveValue(
      'A space crew encounters a dangerous life-form.',
    )
    expect(genres).toHaveValue('Horror, Science Fiction')

    await user.clear(title)
    await user.type(title, 'Alien: Director’s Cut')
    await user.clear(releaseYear)
    await user.type(releaseYear, '2003')
    await user.clear(description)
    await user.type(description, 'The restored cut.')
    await user.clear(genres)
    await user.type(genres, 'Horror')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(receivedBody).toEqual({
      title: 'Alien: Director’s Cut',
      release_year: 2003,
      description: 'The restored cut.',
      genres: ['Horror'],
    })
    expect(
      await screen.findByRole('heading', {
        name: 'Alien: Director’s Cut',
        level: 1,
      }),
    ).toBeVisible()
    expect(await screen.findByText('Movie updated')).toBeVisible()

    await user.click(screen.getByRole('link', { name: 'Back to catalog' }))

    expect(
      await screen.findByRole('heading', {
        name: 'Alien: Director’s Cut',
        level: 2,
      }),
    ).toBeVisible()
  })

  it('shows a loading state on direct navigation', async () => {
    server.use(
      http.get('*/movies/:movieId', async () => {
        await delay('infinite')
        return HttpResponse.json(movieFixtures[0])
      }),
    )

    await renderRoute('/movies/1/edit')

    expect(screen.getByRole('status')).toHaveTextContent(
      'Loading movie editor…',
    )
  })

  it('shows a dedicated state when the movie does not exist', async () => {
    await renderRoute('/movies/999/edit')

    expect(
      await screen.findByRole('heading', {
        name: 'This movie cannot be edited',
      }),
    ).toBeVisible()
  })

  it('shows that a movie disappeared while saving', async () => {
    server.use(
      http.put('*/movies/:movieId', () =>
        HttpResponse.json({ detail: 'Movie not found' }, { status: 404 }),
      ),
    )

    const { user } = await renderRoute('/movies/1/edit')

    await screen.findByLabelText('Title')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(
      await screen.findByRole('heading', {
        name: 'This movie is no longer in the catalog',
      }),
    ).toBeVisible()
  })

  it('keeps edited values and explains an update conflict', async () => {
    server.use(
      http.put('*/movies/:movieId', () =>
        HttpResponse.json(
          { detail: 'Movie was changed by another request' },
          { status: 409 },
        ),
      ),
    )

    const { user } = await renderRoute('/movies/1/edit')
    const title = await screen.findByLabelText('Title')

    await user.clear(title)
    await user.type(title, 'Edited locally')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(title).toHaveValue('Edited locally')
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Update conflict',
    )
    expect(await screen.findByText('Changes not saved')).toBeVisible()
  })
})
