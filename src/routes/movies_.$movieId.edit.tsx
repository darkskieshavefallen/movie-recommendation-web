import { createFileRoute } from '@tanstack/react-router'
import { EditMoviePage } from '../pages/edit-movie/EditMoviePage'

export const Route = createFileRoute('/movies_/$movieId/edit')({
  component: EditMovieRoute,
})

function EditMovieRoute() {
  const { movieId } = Route.useParams()

  return <EditMoviePage movieId={movieId} />
}
