export function parseMovieId(value: string): number | null {
  if (value.trim() === '') {
    return null
  }

  const movieId = Number(value)

  return Number.isSafeInteger(movieId) && movieId > 0 ? movieId : null
}
