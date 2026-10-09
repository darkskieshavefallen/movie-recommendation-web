import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MAX_EXTERNAL_SEARCH_QUERY_LENGTH } from '@/shared/lib/router/searchParams'
import { renderRoute } from '@/test/renderRoute'

describe('external search form', () => {
  it('stores only a submitted query in the URL', async () => {
    const { router, user } = await renderRoute('/external-search')
    const input = screen.getByRole('textbox', { name: 'Movie title' })

    await user.type(input, 'Alien')

    expect(router.state.location.search).toEqual({})
    expect(screen.getByRole('status')).toHaveTextContent(
      'Enter a movie title to start an external search.',
    )

    await user.click(screen.getByRole('button', { name: 'Search' }))

    await waitFor(() => {
      expect(router.state.location.search).toEqual({ query: 'Alien' })
    })
    expect(screen.getByRole('status')).toHaveTextContent(
      'Confirmed search: Alien',
    )
  })

  it('restores a normalized query from a direct URL', async () => {
    await renderRoute('/external-search?query=%20Blade%20Runner%20')

    expect(screen.getByRole('textbox', { name: 'Movie title' })).toHaveValue(
      'Blade Runner',
    )
    expect(screen.getByRole('status')).toHaveTextContent(
      'Confirmed search: Blade Runner',
    )
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
})
