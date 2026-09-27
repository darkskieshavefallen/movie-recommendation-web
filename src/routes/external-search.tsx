import { createFileRoute } from '@tanstack/react-router'
import { ExternalSearchPage } from '../pages/external-search/ExternalSearchPage'
import { parseExternalSearch } from '../shared/lib/router/searchParams'

export const Route = createFileRoute('/external-search')({
  validateSearch: parseExternalSearch,
  component: ExternalSearchRoute,
})

function ExternalSearchRoute() {
  const search = Route.useSearch()

  return <ExternalSearchPage {...search} />
}
