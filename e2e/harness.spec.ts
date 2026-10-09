import { expect, test } from './fixtures/testApi'

test('serves a deterministic catalog without a backend process', async ({
  api,
  page,
}) => {
  await page.goto('/movies')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Movie catalog' }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: /Alien 1979/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Arrival 2016/ })).toBeVisible()

  expect(api.requests).toContainEqual({ method: 'GET', pathname: '/movies/' })
})
