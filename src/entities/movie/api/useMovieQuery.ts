import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/queryKeys'

export function useMovieQuery(movieId: number | null) {
  return useQuery({
    queryKey: queryKeys.movies.detail(movieId ?? 0),
    enabled: movieId !== null,
    queryFn: async ({ signal }) => {
      if (movieId === null) {
        throw new Error('A valid movie ID is required.')
      }

      const { data } = await apiClient.GET('/movies/{movie_id}', {
        params: { path: { movie_id: movieId } },
        signal,
      })

      if (!data) {
        throw new Error('The movie response did not contain data.')
      }

      return data
    },
  })
}
