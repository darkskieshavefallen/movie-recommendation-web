import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { components } from '@/shared/api/generated/schema'
import { queryKeys } from '@/shared/api/queryKeys'

type MovieCreate = components['schemas']['MovieCreate']

export function useCreateMovieMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (movie: MovieCreate) => {
      const { data } = await apiClient.POST('/movies/', {
        body: movie,
      })

      if (!data) {
        throw new Error('The create movie response did not contain data.')
      }

      return data
    },
    onSuccess: (movie) => {
      queryClient.setQueryData(queryKeys.movies.detail(movie.id), movie)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.movies.lists(),
      })
    },
  })
}
