import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Movie } from '@/entities/movie/model/types'
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
    onSuccess: (_, movieId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.movies.detail(movieId),
      })
      queryClient.setQueriesData<Movie[]>(
        { queryKey: queryKeys.movies.lists() },
        (movies) => movies?.filter((movie) => movie.id !== movieId),
      )
      void queryClient.invalidateQueries({
        queryKey: queryKeys.movies.lists(),
      })
    },
  })
}
