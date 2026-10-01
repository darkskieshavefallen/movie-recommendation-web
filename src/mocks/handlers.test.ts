import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { movieFixtures } from './fixtures/movies'
import { movieErrorHandlers, movieHandlers } from './handlers'

const server = setupServer(...movieHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('movieHandlers', () => {
  it('returns a paginated success response', async () => {
    const response = await fetch(
      'http://127.0.0.1:8000/movies/?offset=1&limit=1',
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual([movieFixtures[1]])
  })

  it('returns a not-found response for an unknown movie', async () => {
    const response = await fetch('http://127.0.0.1:8000/movies/999')

    expect(response.status).toBe(404)
    await expect(response.json()).resolves.toEqual({
      detail: 'Movie not found',
    })
  })

  it('deletes an existing movie', async () => {
    const response = await fetch('http://127.0.0.1:8000/movies/1', {
      method: 'DELETE',
    })

    expect(response.status).toBe(204)
    await expect(response.text()).resolves.toBe('')
  })

  it.each([
    ['rateLimited', 429],
    ['serviceUnavailable', 503],
    ['serverError', 500],
  ] as const)('supports the %s error scenario', async (scenario, status) => {
    server.use(movieErrorHandlers[scenario])

    const response = await fetch('http://127.0.0.1:8000/movies/')

    expect(response.status).toBe(status)
  })

  it('supports a validation error scenario', async () => {
    server.use(movieErrorHandlers.validation)

    const response = await fetch('http://127.0.0.1:8000/movies/', {
      method: 'POST',
    })

    expect(response.status).toBe(422)
    await expect(response.json()).resolves.toMatchObject({
      detail: [
        {
          loc: ['body', 'title'],
          type: 'string_too_short',
        },
      ],
    })
  })

  it('supports a network failure scenario', async () => {
    server.use(movieErrorHandlers.network)

    await expect(fetch('http://127.0.0.1:8000/movies/')).rejects.toThrow()
  })
})
