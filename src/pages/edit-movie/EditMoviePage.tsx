import type { MovieId } from '../../entities/movie/model/types'
import { RouteLinks } from '../../features/navigation/ui/RouteLinks'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

type EditMoviePageProps = {
  movieId: MovieId
}

export function EditMoviePage({ movieId }: EditMoviePageProps) {
  return (
    <PlaceholderPage
      title="Edit movie"
      description="The edit form will reuse the shared movie form in a later sprint."
    >
      <p className="route-data">Typed route param: movieId={movieId}</p>
      <RouteLinks />
    </PlaceholderPage>
  )
}
