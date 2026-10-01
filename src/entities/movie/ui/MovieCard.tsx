import { Link } from '@tanstack/react-router'
import { CalendarDaysIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { normalizeGenres } from '../model/genres'
import type { Movie } from '../model/types'

type MovieCardProps = {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  const genres = normalizeGenres(movie.genres)
  const titleId = `movie-${movie.id}-title`

  return (
    <article aria-labelledby={titleId} className="h-full">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Card className="h-full transition-[transform,box-shadow] duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
          <CardHeader>
            <CardTitle>
              <h2 id={titleId}>{movie.title}</h2>
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <CalendarDaysIcon className="size-4" aria-hidden="true" />
              <span>{movie.release_year}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            {genres.length > 0 ? (
              <ul className="flex flex-wrap gap-2" aria-label="Genres">
                {genres.map((genre) => (
                  <li
                    key={genre.toLowerCase()}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {genre}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Genres not listed</p>
            )}
          </CardContent>
        </Card>
      </Link>
    </article>
  )
}
