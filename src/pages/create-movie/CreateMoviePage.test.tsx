import { screen } from '@testing-library/react'
import { delay, HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { MovieFixture } from '@/mocks/fixtures/movies'
import { movieFixtures } from '@/mocks/fixtures/movies'
import { movieHandlers } from '@/mocks/handlers'
import { queryKeys } from '@/shared/api/queryKeys'
import { renderRoute } from '@/test/renderRoute'

const server = setupServer(...movieHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

async function fillValidMovieForm() {
  const title = screen.getByLabelText('Title')
  const releaseYear = screen.getByLabelText('Release year')
  const description = screen.getByLabelText(/Description/)
  const genres = screen.getByLabelText(/Genres/)

  return { title, releaseYear, description, genres }
}

describe('create movie page', () => {
  it('creates a movie, opens its details, and refreshes the catalog', async () => {
    const createdMovie: MovieFixture = {
      id: 3,
      title: 'Blade Runner',
      release_year: 1982,
      description: 'A detective hunts synthetic humans.',
      genres: ['Science Fiction', 'Thriller'],
    }
    let movies = [...movieFixtures]

    server.use(
      http.post('*/movies/', async ({ request }) => {
        const body = (await request.json()) as Omit<MovieFixture, 'id'>
        const movie = { id: 3, ...body }
        movies = [...movies, movie]

        return HttpResponse.json(movie, { status: 201 })
      }),
      http.get('*/movies/', () => HttpResponse.json(movies)),
      http.get('*/movies/:movieId', ({ params }) => {
        const movie = movies.find(({ id }) => id === Number(params.movieId))

        return movie
          ? HttpResponse.json(movie)
          : HttpResponse.json({ detail: 'Movie not found' }, { status: 404 })
      }),
    )

    const { queryClient, user } = await renderRoute('/movies/new')
    const cachedRecommendationsKey = queryKeys.movies.recommendation({
      limit: 5,
      movieId: 1,
    })
    queryClient.setQueryData(cachedRecommendationsKey, {
      source_movie_id: 1,
      recommendations: [],
    })
    const fields = await fillValidMovieForm()

    await user.type(fields.title, createdMovie.title)
    await user.type(fields.releaseYear, String(createdMovie.release_year))
    await user.type(fields.description, createdMovie.description ?? '')
    await user.type(fields.genres, createdMovie.genres?.join(', ') ?? '')
    await user.click(screen.getByRole('button', { name: 'Create movie' }))

    expect(
      await screen.findByRole('heading', {
        name: createdMovie.title,
        level: 1,
      }),
    ).toBeVisible()
    expect(await screen.findByText('Movie created')).toBeVisible()
    expect(
      queryClient.getQueryState(cachedRecommendationsKey)?.isInvalidated,
    ).toBe(true)

    await user.click(screen.getByRole('link', { name: 'Back to catalog' }))

    expect(
      await screen.findByRole('heading', {
        name: createdMovie.title,
        level: 2,
      }),
    ).toBeVisible()
  })

  it('blocks a duplicate submit while the request is pending', async () => {
    let requestCount = 0

    server.use(
      http.post('*/movies/', async () => {
        requestCount += 1
        await delay(100)

        return HttpResponse.json(
          {
            id: 3,
            title: 'Alien',
            release_year: 1979,
            description: null,
            genres: [],
          },
          { status: 201 },
        )
      }),
    )

    const { user } = await renderRoute('/movies/new')
    const fields = await fillValidMovieForm()

    await user.type(fields.title, 'Alien')
    await user.type(fields.releaseYear, '1979')

    const submitButton = screen.getByRole('button', { name: 'Create movie' })
    await user.dblClick(submitButton)

    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
    expect(requestCount).toBe(1)
  })

  it('keeps entered values and shows field and toast errors after 422', async () => {
    server.use(
      http.post('*/movies/', () =>
        HttpResponse.json(
          {
            detail: [
              {
                loc: ['body', 'title'],
                msg: 'A movie with this title already exists',
                type: 'value_error',
              },
            ],
          },
          { status: 422 },
        ),
      ),
    )

    const { user } = await renderRoute('/movies/new')
    const fields = await fillValidMovieForm()

    await user.type(fields.title, 'Alien')
    await user.type(fields.releaseYear, '1979')
    await user.click(screen.getByRole('button', { name: 'Create movie' }))

    expect(fields.title).toHaveValue('Alien')
    expect(fields.releaseYear).toHaveValue(1979)
    expect(fields.title).toHaveAccessibleErrorMessage(
      'A movie with this title already exists',
    )
    expect(await screen.findByText('Movie not created')).toBeVisible()
  })
})
