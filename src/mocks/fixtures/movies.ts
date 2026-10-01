import type { components } from '@/shared/api/generated/schema'

export type MovieFixture = components['schemas']['MovieRead']

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
