import { createFileRoute } from '@tanstack/react-router'
import { MovieDetailsPage } from '../pages/movie-details/MovieDetailsPage'

export const Route = createFileRoute('/movies/$movieId')({
  component: MovieDetailsRoute,
})

function MovieDetailsRoute() {
  const { movieId } = Route.useParams()

  return <MovieDetailsPage movieId={movieId} />
}
