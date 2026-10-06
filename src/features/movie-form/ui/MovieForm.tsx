import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toApiErrorViewModel } from '@/shared/api/errors'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { getMovieFormFieldErrors } from '../model/movieFormApiErrors'
import {
  MOVIE_GENRES_MAX_COUNT,
  MOVIE_RELEASE_YEAR_MAX,
  MOVIE_RELEASE_YEAR_MIN,
  MOVIE_TITLE_MAX_LENGTH,
  type MovieFormData,
  type MovieFormInput,
  movieFormSchema,
  toMovieFormInput,
} from '../model/movieFormSchema'

type MovieFormProps = {
  defaultValues?: Partial<MovieFormData>
  isSubmitting?: boolean
  onCancel?: () => void
  onSubmit: (data: MovieFormData) => Promise<void> | void
  submitLabel: string
  submissionError?: unknown
}

const fieldNames = ['title', 'release_year', 'description', 'genres'] as const

export function MovieForm({
  defaultValues,
  isSubmitting = false,
  onCancel,
  onSubmit,
  submitLabel,
  submissionError,
}: MovieFormProps) {
  const {
    clearErrors,
    formState: { errors },
    handleSubmit,
    register,
    setError,
  } = useForm<MovieFormInput, unknown, MovieFormData>({
    defaultValues: toMovieFormInput(defaultValues),
    resolver: zodResolver(movieFormSchema),
  })

  const hasBackendFieldErrors =
    Object.keys(getMovieFormFieldErrors(submissionError)).length > 0
  const generalError =
    submissionError && !hasBackendFieldErrors
      ? toApiErrorViewModel(submissionError)
      : null

  useEffect(() => {
    if (!submissionError) {
      return
    }

    const backendFieldErrors = getMovieFormFieldErrors(submissionError)

    for (const fieldName of fieldNames) {
      const message = backendFieldErrors[fieldName]

      if (message) {
        setError(fieldName, { message, type: 'server' })
      }
    }
  }, [setError, submissionError])

  function fieldRegistration(fieldName: (typeof fieldNames)[number]) {
    return register(fieldName, {
      onChange: () => clearErrors(fieldName),
    })
  }

  return (
    <form
      className="grid max-w-2xl gap-6"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      {generalError ? (
        <Alert variant="destructive">
          <AlertTitle>{generalError.title}</AlertTitle>
          <AlertDescription>{generalError.message}</AlertDescription>
        </Alert>
      ) : null}

      <FormField id="movie-title" label="Title" error={errors.title?.message}>
        <Input
          id="movie-title"
          autoComplete="off"
          maxLength={MOVIE_TITLE_MAX_LENGTH}
          aria-invalid={Boolean(errors.title)}
          aria-errormessage={errors.title ? 'movie-title-error' : undefined}
          aria-describedby={errors.title ? 'movie-title-error' : undefined}
          {...fieldRegistration('title')}
        />
      </FormField>

      <FormField
        id="movie-release-year"
        label="Release year"
        error={errors.release_year?.message}
        hint={`${MOVIE_RELEASE_YEAR_MIN}–${MOVIE_RELEASE_YEAR_MAX}`}
      >
        <Input
          id="movie-release-year"
          type="number"
          inputMode="numeric"
          min={MOVIE_RELEASE_YEAR_MIN}
          max={MOVIE_RELEASE_YEAR_MAX}
          aria-invalid={Boolean(errors.release_year)}
          aria-errormessage={
            errors.release_year ? 'movie-release-year-error' : undefined
          }
          aria-describedby={
            errors.release_year
              ? 'movie-release-year-hint movie-release-year-error'
              : 'movie-release-year-hint'
          }
          {...fieldRegistration('release_year')}
        />
      </FormField>

      <FormField
        id="movie-description"
        label="Description"
        error={errors.description?.message}
        optional
      >
        <textarea
          id="movie-description"
          rows={6}
          aria-invalid={Boolean(errors.description)}
          aria-errormessage={
            errors.description ? 'movie-description-error' : undefined
          }
          aria-describedby={
            errors.description ? 'movie-description-error' : undefined
          }
          className="w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30"
          {...fieldRegistration('description')}
        />
      </FormField>

      <FormField
        id="movie-genres"
        label="Genres"
        error={errors.genres?.message}
        hint={`Separate genres with commas. Up to ${MOVIE_GENRES_MAX_COUNT} unique genres.`}
        optional
      >
        <Input
          id="movie-genres"
          autoComplete="off"
          placeholder="Drama, Science Fiction"
          aria-invalid={Boolean(errors.genres)}
          aria-errormessage={errors.genres ? 'movie-genres-error' : undefined}
          aria-describedby={
            errors.genres
              ? 'movie-genres-hint movie-genres-error'
              : 'movie-genres-hint'
          }
          {...fieldRegistration('genres')}
        />
      </FormField>

      <div className="flex flex-wrap gap-2 border-t pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}

type FormFieldProps = {
  children: React.ReactNode
  error?: string
  hint?: string
  id: string
  label: string
  optional?: boolean
}

function FormField({
  children,
  error,
  hint,
  id,
  label,
  optional = false,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-muted-foreground">
            (optional)
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
