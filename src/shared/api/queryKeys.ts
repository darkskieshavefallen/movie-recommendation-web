export type MovieListParams = {
  limit: number
  offset: number
}

export type MovieRecommendationsParams = {
  limit: number
  movieId: number
}

export const queryKeys = {
  movies: {
    all: ['movies'] as const,
    lists: () => [...queryKeys.movies.all, 'list'] as const,
    list: ({ limit, offset }: MovieListParams) =>
      [...queryKeys.movies.lists(), { limit, offset }] as const,
    details: () => [...queryKeys.movies.all, 'detail'] as const,
    detail: (movieId: number) =>
      [...queryKeys.movies.details(), movieId] as const,
    recommendations: () =>
      [...queryKeys.movies.all, 'recommendations'] as const,
    recommendationsFor: (movieId: number) =>
      [...queryKeys.movies.recommendations(), movieId] as const,
    recommendation: ({ limit, movieId }: MovieRecommendationsParams) =>
      [...queryKeys.movies.recommendationsFor(movieId), { limit }] as const,
  },
  externalSearch: {
    all: ['external-search'] as const,
    results: (query: string) =>
      [...queryKeys.externalSearch.all, { query }] as const,
  },
} as const
