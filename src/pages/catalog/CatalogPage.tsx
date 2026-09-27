import { RouteLinks } from '../../features/navigation/ui/RouteLinks'
import type { CatalogSearch } from '../../shared/lib/router/searchParams'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

export function CatalogPage({ offset, limit }: CatalogSearch) {
  return (
    <PlaceholderPage
      title="Movie catalog"
      description="The local movie catalog will be implemented in a later sprint."
    >
      <p className="route-data">
        Typed search params: offset={offset}, limit={limit}
      </p>
      <RouteLinks />
    </PlaceholderPage>
  )
}
