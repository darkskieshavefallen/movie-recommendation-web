import { CalendarDaysIcon, CloudIcon } from 'lucide-react'
import { useId } from 'react'
import type { ExternalMovie } from '@/entities/external-movie/model/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'

type ExternalMovieCardProps = {
  movie: ExternalMovie
}

export function ExternalMovieCard({ movie }: ExternalMovieCardProps) {
  const titleId = useId()

  return (
    <article aria-labelledby={titleId} className="h-full min-w-0">
      <Card className="h-full min-w-0">
        <CardHeader>
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
            <CloudIcon className="size-3.5" aria-hidden="true" />
            External catalog
          </p>
          <CardTitle>
            <h3 id={titleId} className="break-words">
              {movie.title}
            </h3>
          </CardTitle>
          <CardDescription className="flex items-center gap-1.5">
            <CalendarDaysIcon className="size-4" aria-hidden="true" />
            <span>{movie.release_year ?? 'Release year not provided'}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <p className="break-words whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {movie.description?.trim() || 'Description not provided.'}
          </p>
        </CardContent>
      </Card>
    </article>
  )
}
