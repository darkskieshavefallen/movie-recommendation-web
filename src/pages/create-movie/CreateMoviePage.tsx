import { RouteLinks } from '../../features/navigation/ui/RouteLinks'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

export function CreateMoviePage() {
  return (
    <PlaceholderPage
      title="Create movie"
      description="The create form will be added after the shared movie form is ready."
    >
      <RouteLinks />
    </PlaceholderPage>
  )
}
