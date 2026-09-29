import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import type { MovieId } from '../../entities/movie/model/types'
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
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Movie #{movieId}</CardTitle>
          <CardDescription>
            The identifier comes from a type-safe route parameter.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Movie data and actions will appear here when the API client is
          connected.
        </CardContent>
      </Card>
    </PlaceholderPage>
  )
}
