import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/queryKeys'

export function useDeleteMovieMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (movieId: number) => {
      await apiClient.DELETE('/movies/{movie_id}', {
        params: { path: { movie_id: movieId } },
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.movies.lists(),
      })
    },
  })
}
