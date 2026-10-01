import type { Movie } from '../model/types'
import { MovieCard } from './MovieCard'

type MovieListProps = {
  movies: Movie[]
}

export function MovieList({ movies }: MovieListProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {movies.map((movie) => (
        <li key={movie.id} className="min-w-0">
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  )
}
