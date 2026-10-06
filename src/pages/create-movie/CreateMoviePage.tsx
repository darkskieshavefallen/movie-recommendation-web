import { useNavigate } from '@tanstack/react-router'
import { useRef } from 'react'
import {
  getMovieCrudErrorToast,
  getMovieCrudSuccessToast,
} from '@/entities/movie/model/movieCrudFeedback'
import { useCreateMovieMutation } from '@/features/create-movie/api/useCreateMovieMutation'
import type { MovieFormData } from '@/features/movie-form/model/movieFormSchema'
import { MovieForm } from '@/features/movie-form/ui/MovieForm'
import { Card, CardContent } from '@/shared/ui/card'
import { toast } from '@/shared/ui/toast'

export function CreateMoviePage() {
  const createMovie = useCreateMovieMutation()
  const navigate = useNavigate()
  const submissionRef = useRef<ReturnType<typeof createMovie.mutateAsync>>(null)

  async function handleSubmit(movieData: MovieFormData) {
    if (submissionRef.current) {
      return
    }

    const submission = createMovie.mutateAsync(movieData)
    submissionRef.current = submission

    try {
      const movie = await submission

      await navigate({
        to: '/movies/$movieId',
        params: { movieId: String(movie.id) },
        replace: true,
      })
      toast.add(getMovieCrudSuccessToast('create', movie.title))
    } catch (error) {
      toast.add(getMovieCrudErrorToast('create', error))
    } finally {
      if (submissionRef.current === submission) {
        submissionRef.current = null
      }
    }
  }

  function handleCancel() {
    void navigate({
      to: '/movies',
      search: { offset: 0, limit: 20 },
    })
  }

  return (
    <section
      className="grid max-w-3xl gap-8"
      aria-labelledby="create-movie-title"
    >
      <header className="grid gap-3">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">
          Local collection
        </p>
        <h1
          id="create-movie-title"
          className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          Create movie
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Add a movie to your local catalog. You can edit these details later.
        </p>
      </header>
      <Card>
        <CardContent>
          <MovieForm
            submitLabel="Create movie"
            isSubmitting={createMovie.isPending}
            submissionError={createMovie.error}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </section>
  )
}
