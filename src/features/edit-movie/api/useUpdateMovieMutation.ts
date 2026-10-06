import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { components } from '@/shared/api/generated/schema'
import { queryKeys } from '@/shared/api/queryKeys'

type Movie = components['schemas']['MovieRead']
type MovieUpdate = components['schemas']['MovieUpdate']

type UpdateMovieVariables = {
  movie: MovieUpdate
  movieId: number
}

export function useUpdateMovieMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ movie, movieId }: UpdateMovieVariables) => {
      const { data } = await apiClient.PUT('/movies/{movie_id}', {
        body: movie,
        params: { path: { movie_id: movieId } },
      })

      if (!data) {
        throw new Error('The update movie response did not contain data.')
      }

      return data
    },
    onSuccess: (movie) => {
      queryClient.setQueryData(queryKeys.movies.detail(movie.id), movie)
      queryClient.setQueriesData<Movie[]>(
        { queryKey: queryKeys.movies.lists() },
        (movies) =>
          movies?.map((cachedMovie) =>
            cachedMovie.id === movie.id ? movie : cachedMovie,
          ),
      )
      void queryClient.invalidateQueries({
        queryKey: queryKeys.movies.lists(),
      })
    },
  })
}
