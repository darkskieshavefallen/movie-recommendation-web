import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import type { MovieId } from '../../entities/movie/model/types'
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
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Edit movie #{movieId}</CardTitle>
          <CardDescription>
            The identifier comes from a type-safe route parameter.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          The shared edit form will be connected in Web Sprint 3.
        </CardContent>
      </Card>
    </PlaceholderPage>
  )
}
