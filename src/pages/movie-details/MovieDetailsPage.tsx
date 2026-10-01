import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon, CalendarDaysIcon, PencilIcon } from 'lucide-react'
import { useMovieQuery } from '@/entities/movie/api/useMovieQuery'
import { normalizeGenres } from '@/entities/movie/model/genres'
import { parseMovieId } from '@/entities/movie/model/movieId'
import { DeleteMovieDialog } from '@/features/delete-movie/ui/DeleteMovieDialog'
import { toApiErrorViewModel } from '@/shared/api/errors'
import { buttonVariants } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import type { MovieId } from '../../entities/movie/model/types'

type MovieDetailsPageProps = {
  movieId: MovieId
}

export function MovieDetailsPage({ movieId }: MovieDetailsPageProps) {
  const parsedMovieId = parseMovieId(movieId)
  const movieQuery = useMovieQuery(parsedMovieId)

  if (parsedMovieId === null) {
    return <MovieNotFound />
  }

  if (movieQuery.isPending) {
    return (
      <p className="text-muted-foreground" role="status">
        Loading movie details…
      </p>
    )
  }

  if (movieQuery.isError) {
    const error = toApiErrorViewModel(movieQuery.error)

    if (error.code === 'not_found') {
      return <MovieNotFound />
    }

    return (
      <section className="grid gap-3" aria-labelledby="movie-error-title">
        <h1
          id="movie-error-title"
          className="font-heading text-3xl font-semibold tracking-tight"
        >
          {error.title}
        </h1>
        <p className="text-muted-foreground">{error.message}</p>
        <CatalogLink />
      </section>
    )
  }

  const movie = movieQuery.data
  const genres = normalizeGenres(movie.genres)

  return (
    <article className="grid gap-6" aria-labelledby="movie-title">
      <CatalogLink />
      <header className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div className="grid gap-3">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            Local movie
          </p>
          <h1
            id="movie-title"
            className="max-w-3xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {movie.title}
          </h1>
          <p className="flex items-center gap-2 text-muted-foreground">
            <CalendarDaysIcon className="size-4" aria-hidden="true" />
            {movie.release_year}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/movies/$movieId/edit"
            params={{ movieId: String(movie.id) }}
            className={buttonVariants({ variant: 'outline' })}
          >
            <PencilIcon data-icon="inline-start" aria-hidden="true" />
            Edit
          </Link>
          <DeleteMovieDialog movieId={movie.id} movieTitle={movie.title} />
        </div>
      </header>
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>
            <h2>About this movie</h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <p className="whitespace-pre-line text-base leading-7 text-muted-foreground">
            {movie.description?.trim() || 'No description is available.'}
          </p>
          <div className="grid gap-2">
            <h2 className="font-heading text-sm font-semibold">Genres</h2>
            {genres.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <li
                    key={genre.toLowerCase()}
                    className="rounded-full bg-secondary px-2.5 py-1 text-sm font-medium text-secondary-foreground"
                  >
                    {genre}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Genres not listed</p>
            )}
          </div>
        </CardContent>
      </Card>
    </article>
  )
}

function MovieNotFound() {
  return (
    <section className="grid max-w-2xl gap-4" aria-labelledby="not-found-title">
      <p className="text-sm font-semibold tracking-widest text-primary uppercase">
        Movie not found
      </p>
      <h1
        id="not-found-title"
        className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        This movie is not in the catalog
      </h1>
      <p className="leading-7 text-muted-foreground">
        It may have been removed, or the link may contain an incorrect movie ID.
      </p>
      <CatalogLink />
    </section>
  )
}

function CatalogLink() {
  return (
    <Link
      to="/movies"
      search={{ offset: 0, limit: 20 }}
      className={buttonVariants({ className: 'w-fit', variant: 'ghost' })}
    >
      <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
      Back to catalog
    </Link>
  )
}
