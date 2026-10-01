import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { type MovieListParams, queryKeys } from '@/shared/api/queryKeys'

export function useMoviesQuery(params: MovieListParams) {
  return useQuery({
    queryKey: queryKeys.movies.list(params),
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.GET('/movies/', {
        params: { query: params },
        signal,
      })

      if (!data) {
        throw new Error('The movies response did not contain data.')
      }

      return data
    },
  })
}
