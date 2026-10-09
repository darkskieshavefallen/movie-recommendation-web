import type { components } from '@/shared/api/generated/schema'

export type MovieFixture = components['schemas']['MovieRead']
export type MovieRecommendationsFixture =
  components['schemas']['MovieRecommendations']

export const movieFixtures: MovieFixture[] = [
  {
    id: 1,
    title: 'Alien',
    release_year: 1979,
    description: 'A space crew encounters a dangerous life-form.',
    genres: ['Horror', 'Science Fiction'],
  },
  {
    id: 2,
    title: 'Arrival',
    release_year: 2016,
    description: 'A linguist works to communicate with alien visitors.',
    genres: ['Drama', 'Science Fiction'],
  },
]

export const movieRecommendationsFixtures: Record<
  number,
  MovieRecommendationsFixture
> = {
  1: {
    source_movie_id: 1,
    recommendations: [
      {
        movie_id: 2,
        title: 'Arrival',
        release_year: 2016,
        matching_genres: ['Science Fiction'],
      },
      {
        movie_id: 3,
        title: 'Blade Runner',
        release_year: 1982,
        matching_genres: ['Science Fiction', 'Thriller'],
      },
    ],
  },
  2: {
    source_movie_id: 2,
    recommendations: [
      {
        movie_id: 1,
        title: 'Alien',
        release_year: 1979,
        matching_genres: ['Science Fiction'],
      },
    ],
  },
}
