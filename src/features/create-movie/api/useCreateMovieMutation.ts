import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { MovieFormData } from '@/features/movie-form/model/movieFormSchema'
import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/queryKeys'

export function useCreateMovieMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (movie: MovieFormData) => {
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
