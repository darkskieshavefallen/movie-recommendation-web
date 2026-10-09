import { screen } from '@testing-library/react'
import axe, { type Result } from 'axe-core'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { externalMovieHandlers, movieHandlers } from '@/mocks/handlers'
import { renderRoute } from '@/test/renderRoute'

const server = setupServer(...externalMovieHandlers, ...movieHandlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function summarizeViolations(violations: Result[]) {
  return violations.map(({ help, id, impact, nodes }) => ({
    help,
    id,
    impact,
    targets: nodes.map((node) => node.target),
  }))
}

async function expectNoAxeViolations() {
  const { violations } = await axe.run(document.body, {
    rules: {
      'color-contrast': { enabled: false },
    },
  })

  expect(summarizeViolations(violations)).toEqual([])
}

describe('key route accessibility', () => {
  it('has no axe violations on the populated catalog', async () => {
    await renderRoute('/movies')

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Alien' }),
    ).toBeVisible()
    await expectNoAxeViolations()
  })

  it('has no axe violations on the create form', async () => {
    await renderRoute('/movies/new')

    expect(
      screen.getByRole('heading', { level: 1, name: 'Create movie' }),
    ).toBeVisible()
    await expectNoAxeViolations()
  })

  it('has no axe violations on movie details and recommendations', async () => {
    await renderRoute('/movies/1')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Alien' }),
    ).toBeVisible()
    await expectNoAxeViolations()
  })

  it('has no axe violations on external search results', async () => {
    await renderRoute('/external-search?query=Alien')

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Results for “Alien”',
      }),
    ).toBeVisible()
    await expectNoAxeViolations()
  })

  it('moves focus into updated content after keyboard navigation', async () => {
    const { user } = await renderRoute('/movies')

    await user.click(screen.getByRole('link', { name: 'Create movie' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Create movie' }),
    ).toBeVisible()
    expect(screen.getByRole('main')).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveFocus()
  })
})
