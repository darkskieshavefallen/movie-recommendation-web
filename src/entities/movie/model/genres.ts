export function normalizeGenres(genres: string[] | undefined): string[] {
  const normalizedGenres: string[] = []
  const seenGenres = new Set<string>()

  for (const genre of genres ?? []) {
    const normalizedGenre = genre.trim().replace(/\s+/g, ' ')
    const comparisonKey = normalizedGenre.toLowerCase()

    if (!normalizedGenre || seenGenres.has(comparisonKey)) {
      continue
    }

    seenGenres.add(comparisonKey)
    normalizedGenres.push(
      normalizedGenre[0]?.toUpperCase() + normalizedGenre.slice(1),
    )
  }

  return normalizedGenres
}
