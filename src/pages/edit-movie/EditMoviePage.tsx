import { Link, useNavigate } from '@tanstack/react-router'
import { RotateCcwIcon } from 'lucide-react'
import { useRef } from 'react'
import { useMovieQuery } from '@/entities/movie/api/useMovieQuery'
import { parseMovieId } from '@/entities/movie/model/movieId'
import { useUpdateMovieMutation } from '@/features/edit-movie/api/useUpdateMovieMutation'
import type { MovieFormData } from '@/features/movie-form/model/movieFormSchema'
import { MovieForm } from '@/features/movie-form/ui/MovieForm'
import { toApiErrorViewModel } from '@/shared/api/errors'
import { Button, buttonVariants } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { toast } from '@/shared/ui/toast'
import type { MovieId } from '../../entities/movie/model/types'

type EditMoviePageProps = {
  movieId: MovieId
}

export function EditMoviePage({ movieId }: EditMoviePageProps) {
  const parsedMovieId = parseMovieId(movieId)
  const movieQuery = useMovieQuery(parsedMovieId)
  const updateMovie = useUpdateMovieMutation()
  const navigate = useNavigate()
  const submissionRef = useRef<ReturnType<typeof updateMovie.mutateAsync>>(null)

  if (parsedMovieId === null) {
    return <MovieUnavailableState />
  }

  if (movieQuery.isPending) {
    return <EditMovieSkeleton />
  }

  if (movieQuery.isError) {
    const error = toApiErrorViewModel(movieQuery.error)

    if (error.code === 'not_found') {
      return <MovieUnavailableState />
    }

    return (
      <EditMovieLoadError
        title={error.title}
        message={error.message}
        canRetry={error.retryable}
        isRetrying={movieQuery.isFetching}
        onRetry={() => void movieQuery.refetch()}
      />
    )
  }

  const movie = movieQuery.data
  const updateError = updateMovie.isError
    ? toApiErrorViewModel(updateMovie.error)
    : null

  if (updateError?.code === 'not_found') {
    return <MovieUnavailableState disappeared />
  }

  async function handleSubmit(movieData: MovieFormData) {
    if (submissionRef.current || parsedMovieId === null) {
      return
    }

    const submission = updateMovie.mutateAsync({
      movie: movieData,
      movieId: parsedMovieId,
    })
    submissionRef.current = submission

    try {
      const updatedMovie = await submission

      await navigate({
        to: '/movies/$movieId',
        params: { movieId: String(updatedMovie.id) },
        replace: true,
      })
      toast.add({
        title: 'Movie updated',
        description: `${updatedMovie.title} now has your latest changes.`,
        type: 'success',
      })
    } catch (error) {
      const errorView = toApiErrorViewModel(error)

      toast.add({
        title: 'Changes not saved',
        description: errorView.message,
        type: 'error',
      })
    } finally {
      if (submissionRef.current === submission) {
        submissionRef.current = null
      }
    }
  }

  function handleCancel() {
    void navigate({
      to: '/movies/$movieId',
      params: { movieId: String(movie.id) },
    })
  }

  return (
    <section
      className="grid max-w-3xl gap-8"
      aria-labelledby="edit-movie-title"
    >
      <header className="grid gap-3">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">
          Local collection
        </p>
        <h1
          id="edit-movie-title"
          className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Edit {movie.title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Update every field before saving the complete movie record.
        </p>
      </header>
      <Card>
        <CardContent>
          <MovieForm
            defaultValues={movie}
            submitLabel="Save changes"
            isSubmitting={updateMovie.isPending}
            submissionError={updateMovie.error}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </section>
  )
}

function EditMovieSkeleton() {
  return (
    <div className="grid max-w-3xl gap-8" role="status">
      <span className="sr-only">Loading movie editor…</span>
      <div className="grid gap-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-6 w-xl max-w-full" />
      </div>
      <Card>
        <CardContent className="grid gap-6">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-14 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

type EditMovieLoadErrorProps = {
  canRetry: boolean
  isRetrying: boolean
  message: string
  onRetry: () => void
  title: string
}

function EditMovieLoadError({
  canRetry,
  isRetrying,
  message,
  onRetry,
  title,
}: EditMovieLoadErrorProps) {
  return (
    <section
      className="grid max-w-2xl gap-4"
      aria-labelledby="edit-error-title"
    >
      <h1
        id="edit-error-title"
        className="font-heading text-3xl font-semibold tracking-tight"
      >
        {title}
      </h1>
      <p className="leading-7 text-muted-foreground">{message}</p>
      <div className="flex flex-wrap gap-2">
        {canRetry ? (
          <Button type="button" disabled={isRetrying} onClick={onRetry}>
            <RotateCcwIcon
              data-icon="inline-start"
              className={isRetrying ? 'animate-spin' : undefined}
              aria-hidden="true"
            />
            {isRetrying ? 'Trying again…' : 'Try again'}
          </Button>
        ) : null}
        <CatalogLink />
      </div>
    </section>
  )
}

function MovieUnavailableState({
  disappeared = false,
}: {
  disappeared?: boolean
}) {
  return (
    <section
      className="grid max-w-2xl gap-4"
      aria-labelledby="movie-unavailable-title"
    >
      <p className="text-sm font-semibold tracking-widest text-primary uppercase">
        Movie unavailable
      </p>
      <h1
        id="movie-unavailable-title"
        className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        {disappeared
          ? 'This movie is no longer in the catalog'
          : 'This movie cannot be edited'}
      </h1>
      <p className="leading-7 text-muted-foreground">
        {disappeared
          ? 'It was removed before your changes could be saved.'
          : 'It may have been removed, or the link may contain an incorrect movie ID.'}
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
      className={buttonVariants({ variant: 'outline' })}
    >
      Back to catalog
    </Link>
  )
}
