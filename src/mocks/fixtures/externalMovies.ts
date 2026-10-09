import type { ExternalMovieSearchResponse } from '@/entities/external-movie/model/types'

export const externalMovieSearchFixture: ExternalMovieSearchResponse = {
  query: 'Alien',
  results: [
    {
      external_id: 'external-alien-1979',
      title: 'Alien',
      release_year: 1979,
      description:
        'A space crew encounters a dangerous life-form after answering a mysterious transmission.',
    },
    {
      external_id: 'external-alien-unknown',
      title: 'Alien: Unknown Archive',
      release_year: null,
      description: null,
    },
  ],
}
