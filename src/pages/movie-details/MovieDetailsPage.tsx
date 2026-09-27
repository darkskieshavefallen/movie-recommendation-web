import type { MovieId } from '../../entities/movie/model/types'
import { RouteLinks } from '../../features/navigation/ui/RouteLinks'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

type MovieDetailsPageProps = {
  movieId: MovieId
}

export function MovieDetailsPage({ movieId }: MovieDetailsPageProps) {
  return (
    <PlaceholderPage
      title="Movie details"
      description="The movie data will be loaded from the API in a later sprint."
    >
      <p className="route-data">Typed route param: movieId={movieId}</p>
      <RouteLinks />
    </PlaceholderPage>
  )
}
