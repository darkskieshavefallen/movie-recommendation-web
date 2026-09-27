import { createFileRoute } from '@tanstack/react-router'
import { CatalogPage } from '../pages/catalog/CatalogPage'
import { parseCatalogSearch } from '../shared/lib/router/searchParams'

export const Route = createFileRoute('/movies/')({
  validateSearch: parseCatalogSearch,
  component: CatalogRoute,
})

function CatalogRoute() {
  const search = Route.useSearch()

  return <CatalogPage {...search} />
}
