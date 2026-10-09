import { test as base, expect, type Page, type Route } from '@playwright/test'
import { externalMovieSearchFixture } from '../../src/mocks/fixtures/externalMovies'
import {
  movieFixtures,
  movieRecommendationsFixtures,
} from '../../src/mocks/fixtures/movies'
import type { components } from '../../src/shared/api/generated/schema'

type MovieCreate = components['schemas']['MovieCreate']
type MovieRead = components['schemas']['MovieRead']
type MovieUpdate = components['schemas']['MovieUpdate']

type ApiRequestRecord = {
  method: string
  pathname: string
}

type TestApi = {
  externalSearchError: {
    detail: string
    status: number
  } | null
  movies: MovieRead[]
  requests: ApiRequestRecord[]
}

const API_ORIGIN = 'http://127.0.0.1:8000'
const CORS_HEADERS = {
  'access-control-allow-headers': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-origin': '*',
}

async function fulfillJson(route: Route, json: unknown, status = 200) {
  await route.fulfill({ headers: CORS_HEADERS, json, status })
}

async function installTestApi(page: Page, api: TestApi) {
  await page.route(`${API_ORIGIN}/**`, async (route) => {
    const request = route.request()
    const method = request.method()
    const url = new URL(request.url())
    const { pathname } = url

    if (method === 'OPTIONS') {
      await route.fulfill({ headers: CORS_HEADERS, status: 204 })
      return
    }

    api.requests.push({ method, pathname })

    if (pathname === '/movies/' && method === 'GET') {
      const offset = Number(url.searchParams.get('offset') ?? 0)
      const limit = Number(url.searchParams.get('limit') ?? 100)

      await fulfillJson(route, api.movies.slice(offset, offset + limit))
      return
    }

    if (pathname === '/movies/' && method === 'POST') {
      const movie = request.postDataJSON() as MovieCreate
      const id = Math.max(0, ...api.movies.map(({ id }) => id)) + 1
      const createdMovie: MovieRead = { id, ...movie }

      api.movies.push(createdMovie)
      await fulfillJson(route, createdMovie, 201)
      return
    }

    const recommendationsMatch = pathname.match(
      /^\/movies\/(\d+)\/recommendations$/,
    )

    if (recommendationsMatch && method === 'GET') {
      const movieId = Number(recommendationsMatch[1])
      const limit = Number(url.searchParams.get('limit') ?? 5)

      if (!api.movies.some(({ id }) => id === movieId)) {
        await fulfillJson(route, { detail: 'Movie not found' }, 404)
        return
      }

      const recommendations =
        movieRecommendationsFixtures[movieId]?.recommendations
          .filter(({ movie_id }) =>
            api.movies.some(({ id }) => id === movie_id),
          )
          .slice(0, limit) ?? []

      await fulfillJson(route, {
        source_movie_id: movieId,
        recommendations,
      })
      return
    }

    const movieMatch = pathname.match(/^\/movies\/(\d+)$/)

    if (movieMatch) {
      const movieId = Number(movieMatch[1])
      const movieIndex = api.movies.findIndex(({ id }) => id === movieId)

      if (movieIndex === -1) {
        await fulfillJson(route, { detail: 'Movie not found' }, 404)
        return
      }

      if (method === 'GET') {
        await fulfillJson(route, api.movies[movieIndex])
        return
      }

      if (method === 'PUT') {
        const update = request.postDataJSON() as MovieUpdate
        const updatedMovie: MovieRead = { id: movieId, ...update }

        api.movies[movieIndex] = updatedMovie
        await fulfillJson(route, updatedMovie)
        return
      }

      if (method === 'DELETE') {
        api.movies.splice(movieIndex, 1)
        await route.fulfill({ headers: CORS_HEADERS, status: 204 })
        return
      }
    }

    if (pathname === '/external/movies/search' && method === 'GET') {
      if (api.externalSearchError) {
        await fulfillJson(
          route,
          { detail: api.externalSearchError.detail },
          api.externalSearchError.status,
        )
        return
      }

      await fulfillJson(route, {
        ...externalMovieSearchFixture,
        query: url.searchParams.get('query') ?? '',
      })
      return
    }

    await fulfillJson(
      route,
      { detail: `Unhandled E2E API request: ${method} ${pathname}` },
      501,
    )
  })
}

export const test = base.extend<{ api: TestApi }>({
  api: [
    async ({ page }, use) => {
      const api: TestApi = {
        externalSearchError: null,
        movies: structuredClone(movieFixtures),
        requests: [],
      }

      await installTestApi(page, api)
      await use(api)
    },
    { auto: true },
  ],
})

export { expect }
