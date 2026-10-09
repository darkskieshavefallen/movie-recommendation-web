import { createFileRoute } from '@tanstack/react-router'
import {
  DEFAULT_RECOMMENDATIONS_LIMIT,
  parseMovieDetailsSearch,
} from '../entities/movie/model/recommendations'
import { MovieDetailsPage } from '../pages/movie-details/MovieDetailsPage'

export const Route = createFileRoute('/movies/$movieId')({
  validateSearch: parseMovieDetailsSearch,
  component: MovieDetailsRoute,
})

function MovieDetailsRoute() {
  const { movieId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <MovieDetailsPage
      movieId={movieId}
      recommendationsLimit={search.limit ?? DEFAULT_RECOMMENDATIONS_LIMIT}
      onRecommendationsLimitChange={(limit) => {
        void navigate({ search: { limit } })
      }}
    />
  )
}
