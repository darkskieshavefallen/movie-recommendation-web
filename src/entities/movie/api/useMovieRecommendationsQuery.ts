import { useQuery } from '@tanstack/react-query'
import { DEFAULT_RECOMMENDATIONS_LIMIT } from '@/entities/movie/model/recommendations'
import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/queryKeys'

type MovieRecommendationsQueryParams = {
  limit?: number
  movieId: number | null
}

export function useMovieRecommendationsQuery({
  limit = DEFAULT_RECOMMENDATIONS_LIMIT,
  movieId,
}: MovieRecommendationsQueryParams) {
  return useQuery({
    queryKey: queryKeys.movies.recommendation({
      limit,
      movieId: movieId ?? 0,
    }),
    enabled: movieId !== null,
    queryFn: async ({ signal }) => {
      if (movieId === null) {
        throw new Error('A valid movie ID is required.')
      }

      const { data } = await apiClient.GET(
        '/movies/{movie_id}/recommendations',
        {
          params: {
            path: { movie_id: movieId },
            query: { limit },
          },
          signal,
        },
      )

      if (!data) {
        throw new Error('The recommendations response did not contain data.')
      }

      return data
    },
  })
}
