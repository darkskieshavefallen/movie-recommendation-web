import { expect, test } from './fixtures/testApi'

test.describe('catalog', () => {
  test.use({ viewport: { height: 844, width: 390 } })

  test('opens the catalog and paginates on a mobile viewport', async ({
    page,
  }) => {
    await page.goto('/movies?offset=0&limit=1')

    await expect(
      page.getByRole('heading', { level: 1, name: 'Movie catalog' }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /Alien 1979/ })).toBeVisible()
    await expect(page.getByText('Showing movies 1–1')).toBeVisible()

    await page.getByRole('link', { name: 'Next' }).click()

    await expect(page).toHaveURL(
      (url) =>
        url.pathname === '/movies' &&
        url.searchParams.get('limit') === '1' &&
        url.searchParams.get('offset') === '1',
    )
    await expect(page.getByRole('link', { name: /Arrival 2016/ })).toBeVisible()
    await expect(page.getByText('Showing movies 2–2')).toBeVisible()

    await page.getByRole('link', { name: 'Previous' }).click()

    await expect(page).toHaveURL(
      (url) =>
        url.pathname === '/movies' &&
        url.searchParams.get('limit') === '1' &&
        url.searchParams.get('offset') === '0',
    )
    await expect(page.getByRole('link', { name: /Alien 1979/ })).toBeVisible()
  })
})

test('creates, edits, and deletes a movie', async ({ page }) => {
  await page.goto('/movies')
  await page.getByRole('link', { name: 'Create movie' }).click()

  await expect(
    page.getByRole('heading', { level: 1, name: 'Create movie' }),
  ).toBeVisible()
  await page.getByLabel('Title').fill('The Thing')
  await page.getByLabel('Release year').fill('1982')
  await page
    .getByLabel(/Description/)
    .fill('Researchers encounter a shape-shifting alien.')
  await page.getByLabel(/Genres/).fill('Horror, Science Fiction')
  await page.getByRole('button', { name: 'Create movie' }).click()

  await expect(
    page.getByRole('heading', { level: 1, name: 'The Thing' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Edit' }).click()

  await page.getByLabel('Title').fill('The Thing — Updated')
  await page.getByLabel('Release year').fill('1983')
  await page.getByLabel(/Description/).fill('Updated description.')
  await page.getByLabel(/Genres/).fill('Horror')
  await page.getByRole('button', { name: 'Save changes' }).click()

  await expect(
    page.getByRole('heading', { level: 1, name: 'The Thing — Updated' }),
  ).toBeVisible()
  await expect(page.getByText('1983')).toBeVisible()
  await expect(page.getByText('Updated description.')).toBeVisible()

  await page.getByRole('button', { name: 'Delete' }).click()
  await expect(
    page.getByRole('dialog', { name: 'Delete The Thing — Updated?' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Delete movie' }).click()

  await expect(
    page.getByRole('heading', { level: 1, name: 'Movie catalog' }),
  ).toBeVisible()
  await expect(page.getByText('Movie deleted')).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: 'The Thing — Updated' }),
  ).toHaveCount(0)
})

test('opens movie details and follows a recommendation', async ({ page }) => {
  await page.goto('/movies')
  await page.getByRole('link', { name: /Alien 1979/ }).click()

  await expect(
    page.getByRole('heading', { level: 1, name: 'Alien' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: 'Similar movies' }),
  ).toBeVisible()
  await expect(page.getByText('Matching genres')).toBeVisible()
  await page
    .getByRole('combobox', { name: 'Number of recommendations' })
    .selectOption('1')
  await expect(page).toHaveURL(/\/movies\/1\?limit=1$/)

  await page.getByRole('link', { name: /Arrival 2016/ }).click()

  await expect(page).toHaveURL(/\/movies\/2\?limit=1$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Arrival' }),
  ).toBeVisible()
  await expect(page.getByRole('link', { name: /Alien 1979/ })).toBeVisible()
})

test('searches the external catalog without changing local movies', async ({
  page,
}) => {
  await page.goto('/external-search')
  await page.getByRole('textbox', { name: 'Movie title' }).fill('Alien')
  await page.getByRole('button', { name: 'Search' }).click()

  await expect(
    page.getByRole('heading', { level: 2, name: 'Results for “Alien”' }),
  ).toBeVisible()
  await expect(
    page.getByRole('link', {
      name: 'Visit The Movie Database (opens in a new tab)',
    }),
  ).toBeVisible()
  await expect(
    page.getByText(/not part of your local collection/),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Catalog' }).click()

  await expect(page.getByRole('link', { name: /Alien 1979/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Arrival 2016/ })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Alien: Unknown Archive' }),
  ).toHaveCount(0)
})

test('explains when the external provider is disabled', async ({
  api,
  page,
}) => {
  api.externalSearchError = {
    detail: 'External movie catalog is disabled.',
    status: 503,
  }

  await page.goto('/external-search?query=Alien')

  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'External catalog is turned off',
    }),
  ).toBeVisible()
  await expect(
    page.getByText(/Your local collection remains available/),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Try external search again' }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('link', { name: 'Open local catalog' }),
  ).toBeVisible()
})
