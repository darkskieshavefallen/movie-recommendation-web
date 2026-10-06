import { z } from 'zod'
import type { components } from '@/shared/api/generated/schema'

export const MOVIE_TITLE_MAX_LENGTH = 255
export const MOVIE_RELEASE_YEAR_MIN = 1888
export const MOVIE_RELEASE_YEAR_MAX = 2100
export const MOVIE_GENRE_MAX_LENGTH = 50
export const MOVIE_GENRES_MAX_COUNT = 10

const genreListSchema = z
  .string()
  .transform((value) =>
    value
      .split(',')
      .map((genre) => genre.trim())
      .filter(Boolean),
  )
  .pipe(
    z
      .array(
        z
          .string()
          .max(
            MOVIE_GENRE_MAX_LENGTH,
            `Each genre must be ${MOVIE_GENRE_MAX_LENGTH} characters or fewer.`,
          ),
      )
      .max(
        MOVIE_GENRES_MAX_COUNT,
        `Add no more than ${MOVIE_GENRES_MAX_COUNT} genres.`,
      )
      .refine(
        (genres) =>
          new Set(genres.map((genre) => genre.toLowerCase())).size ===
          genres.length,
        'Genres must be unique.',
      ),
  )

type MovieWritePayload = components['schemas']['MovieCreate'] &
  components['schemas']['MovieUpdate']

export const movieFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Enter a title.')
    .max(
      MOVIE_TITLE_MAX_LENGTH,
      `Title must be ${MOVIE_TITLE_MAX_LENGTH} characters or fewer.`,
    ),
  release_year: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.coerce
      .number({ error: 'Enter a release year.' })
      .int('Release year must be a whole number.')
      .min(
        MOVIE_RELEASE_YEAR_MIN,
        `Release year must be ${MOVIE_RELEASE_YEAR_MIN} or later.`,
      )
      .max(
        MOVIE_RELEASE_YEAR_MAX,
        `Release year must be ${MOVIE_RELEASE_YEAR_MAX} or earlier.`,
      ),
  ),
  description: z.string().transform((value) => value.trim() || null),
  genres: genreListSchema,
}) satisfies z.ZodType<MovieWritePayload>

export type MovieFormInput = z.input<typeof movieFormSchema>
export type MovieFormData = z.output<typeof movieFormSchema>

export function toMovieFormInput(
  movie?: Partial<MovieFormData>,
): MovieFormInput {
  return {
    title: movie?.title ?? '',
    release_year: movie?.release_year ?? '',
    description: movie?.description ?? '',
    genres: movie?.genres?.join(', ') ?? '',
  }
}
