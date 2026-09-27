import { RouteLinks } from '../../features/navigation/ui/RouteLinks'
import type { ExternalSearch } from '../../shared/lib/router/searchParams'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

export function ExternalSearchPage({ query }: ExternalSearch) {
  return (
    <PlaceholderPage
      title="External movie search"
      description="External provider results will be implemented in a later sprint."
    >
      <p className="route-data">
        Typed search param: query={query ?? 'not set'}
      </p>
      <RouteLinks />
    </PlaceholderPage>
  )
}
