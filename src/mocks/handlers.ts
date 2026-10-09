import { HttpResponse, http } from 'msw'
import { externalMovieSearchFixture } from './fixtures/externalMovies'
import {
  type MovieFixture,
  movieFixtures,
  movieRecommendationsFixtures,
} from './fixtures/movies'

const MOVIES_URL = '*/movies/'
const MOVIE_DETAILS_URL = '*/movies/:movieId'
const MOVIE_RECOMMENDATIONS_URL = '*/movies/:movieId/recommendations'
const EXTERNAL_MOVIE_SEARCH_URL = '*/external/movies/search'

export const externalMovieHandlers = [
  http.get(EXTERNAL_MOVIE_SEARCH_URL, ({ request }) => {
    const query = new URL(request.url).searchParams.get('query') ?? ''

    return HttpResponse.json({
      ...externalMovieSearchFixture,
      query,
    })
  }),
]

export const movieHandlers = [
  http.get(MOVIES_URL, ({ request }) => {
    const url = new URL(request.url)
    const offset = Number(url.searchParams.get('offset') ?? 0)
    const limit = Number(url.searchParams.get('limit') ?? 100)

    return HttpResponse.json(movieFixtures.slice(offset, offset + limit))
  }),
  http.get(MOVIE_RECOMMENDATIONS_URL, ({ params, request }) => {
    const movieId = Number(params.movieId)
    const movieExists = movieFixtures.some(({ id }) => id === movieId)

    if (!movieExists) {
      return new HttpResponse(null, { status: 404 })
    }

    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit') ?? 5)
    const fixture = movieRecommendationsFixtures[movieId] ?? {
      source_movie_id: movieId,
      recommendations: [],
    }

    return HttpResponse.json({
      ...fixture,
      recommendations: fixture.recommendations.slice(0, limit),
    })
  }),
  http.get(MOVIE_DETAILS_URL, ({ params }) => {
    const movie = movieFixtures.find(({ id }) => id === Number(params.movieId))

    if (!movie) {
      return HttpResponse.json({ detail: 'Movie not found' }, { status: 404 })
    }

    return HttpResponse.json(movie)
  }),
  http.post(MOVIES_URL, async ({ request }) => {
    const movie = (await request.json()) as Omit<MovieFixture, 'id'>

    return HttpResponse.json({ id: 3, ...movie } satisfies MovieFixture, {
      status: 201,
    })
  }),
  http.put(MOVIE_DETAILS_URL, async ({ params, request }) => {
    const movieExists = movieFixtures.some(
      ({ id }) => id === Number(params.movieId),
    )

    if (!movieExists) {
      return HttpResponse.json({ detail: 'Movie not found' }, { status: 404 })
    }

    const movie = (await request.json()) as Omit<MovieFixture, 'id'>

    return HttpResponse.json({
      id: Number(params.movieId),
      ...movie,
    } satisfies MovieFixture)
  }),
  http.delete(MOVIE_DETAILS_URL, ({ params }) => {
    const movieExists = movieFixtures.some(
      ({ id }) => id === Number(params.movieId),
    )

    if (!movieExists) {
      return HttpResponse.json({ detail: 'Movie not found' }, { status: 404 })
    }

    return new HttpResponse(null, { status: 204 })
  }),
]

export const movieErrorHandlers = {
  network: http.get(MOVIES_URL, () => HttpResponse.error()),
  validation: http.post(MOVIES_URL, () =>
    HttpResponse.json(
      {
        detail: [
          {
            loc: ['body', 'title'],
            msg: 'String should have at least 1 character',
            type: 'string_too_short',
          },
        ],
      },
      { status: 422 },
    ),
  ),
  rateLimited: http.get(MOVIES_URL, () =>
    HttpResponse.json({ detail: 'Too many requests' }, { status: 429 }),
  ),
  serviceUnavailable: http.get(MOVIES_URL, () =>
    HttpResponse.json({ detail: 'Service unavailable' }, { status: 503 }),
  ),
  serverError: http.get(MOVIES_URL, () =>
    HttpResponse.json({ detail: 'Internal server error' }, { status: 500 }),
  ),
}
