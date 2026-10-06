import { screen } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import type { MovieFixture } from '@/mocks/fixtures/movies'
import { movieFixtures } from '@/mocks/fixtures/movies'
import { movieHandlers } from '@/mocks/handlers'
import { renderRoute } from './renderRoute'

const server = setupServer(...movieHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('CRUD MVP', () => {
  it('creates, reads, updates, lists, and deletes a movie through the UI', async () => {
    let movies = [...movieFixtures]
    let nextMovieId = 3

    server.use(
      http.get('*/movies/', ({ request }) => {
        const url = new URL(request.url)
        const offset = Number(url.searchParams.get('offset') ?? 0)
        const limit = Number(url.searchParams.get('limit') ?? 100)

        return HttpResponse.json(movies.slice(offset, offset + limit))
      }),
      http.post('*/movies/', async ({ request }) => {
        const body = (await request.json()) as Omit<MovieFixture, 'id'>
        const movie = { id: nextMovieId, ...body }
        nextMovieId += 1
        movies = [...movies, movie]

        return HttpResponse.json(movie, { status: 201 })
      }),
      http.get('*/movies/:movieId', ({ params }) => {
        const movie = movies.find(({ id }) => id === Number(params.movieId))

        return movie
          ? HttpResponse.json(movie)
          : HttpResponse.json({ detail: 'Movie not found' }, { status: 404 })
      }),
      http.put('*/movies/:movieId', async ({ params, request }) => {
        const body = (await request.json()) as Omit<MovieFixture, 'id'>
        const updatedMovie = { id: Number(params.movieId), ...body }
        movies = movies.map((movie) =>
          movie.id === updatedMovie.id ? updatedMovie : movie,
        )

        return HttpResponse.json(updatedMovie)
      }),
      http.delete('*/movies/:movieId', ({ params }) => {
        movies = movies.filter(({ id }) => id !== Number(params.movieId))

        return new HttpResponse(null, { status: 204 })
      }),
    )

    const { user } = await renderRoute('/movies?offset=0&limit=20')

    await user.click(await screen.findByRole('link', { name: 'Create movie' }))
    await screen.findByRole('heading', { name: 'Create movie', level: 1 })
    await user.click(screen.getByRole('button', { name: 'Create movie' }))

    expect(screen.getByLabelText('Title')).toHaveAccessibleErrorMessage(
      'Enter a title.',
    )
    expect(screen.getByLabelText('Release year')).toHaveAccessibleErrorMessage(
      'Enter a release year.',
    )

    await user.type(screen.getByLabelText('Title'), 'The Thing')
    await user.type(screen.getByLabelText('Release year'), '1982')
    await user.type(
      screen.getByLabelText(/Description/),
      'Researchers encounter a shape-shifting alien.',
    )
    await user.type(screen.getByLabelText(/Genres/), 'Horror, Science Fiction')
    await user.click(screen.getByRole('button', { name: 'Create movie' }))

    expect(
      await screen.findByRole('heading', { name: 'The Thing', level: 1 }),
    ).toBeVisible()

    await user.click(screen.getByRole('link', { name: 'Edit' }))
    const title = await screen.findByLabelText('Title')
    const releaseYear = screen.getByLabelText('Release year')
    const description = screen.getByLabelText(/Description/)
    const genres = screen.getByLabelText(/Genres/)

    await user.clear(title)
    await user.type(title, 'The Thing — Updated')
    await user.clear(releaseYear)
    await user.type(releaseYear, '1983')
    await user.clear(description)
    await user.type(description, 'Updated description.')
    await user.clear(genres)
    await user.type(genres, 'Horror')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(
      await screen.findByRole('heading', {
        name: 'The Thing — Updated',
        level: 1,
      }),
    ).toBeVisible()
    expect(screen.getByText('1983')).toBeVisible()
    expect(screen.getByText('Updated description.')).toBeVisible()

    await user.click(screen.getByRole('link', { name: 'Back to catalog' }))

    expect(
      await screen.findByRole('heading', {
        name: 'The Thing — Updated',
        level: 2,
      }),
    ).toBeVisible()

    await user.click(
      screen.getByRole('link', {
        name: /The Thing — Updated 1983 Genres/,
      }),
    )
    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: 'Delete movie' }))

    expect(
      await screen.findByRole('heading', { name: 'Movie catalog', level: 1 }),
    ).toBeVisible()
    expect(
      screen.queryByRole('heading', {
        name: 'The Thing — Updated',
        level: 2,
      }),
    ).not.toBeInTheDocument()
    expect(await screen.findByText('Movie deleted')).toBeVisible()
  })
})
