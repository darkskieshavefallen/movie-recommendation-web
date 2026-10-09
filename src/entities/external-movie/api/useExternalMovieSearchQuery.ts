import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/queryKeys'

export function useExternalMovieSearchQuery(query: string | null) {
  return useQuery({
    queryKey: queryKeys.externalSearch.results(query ?? ''),
    enabled: query !== null,
    retry: false,
    queryFn: async ({ signal }) => {
      if (query === null) {
        throw new Error('A confirmed external search query is required.')
      }

      const { data } = await apiClient.GET('/external/movies/search', {
        params: { query: { query } },
        signal,
      })

      if (!data) {
        throw new Error('The external search response did not contain data.')
      }

      return data
    },
  })
}
