export const DEFAULT_RECOMMENDATIONS_LIMIT = 5
export const MIN_RECOMMENDATIONS_LIMIT = 1
export const MAX_RECOMMENDATIONS_LIMIT = 20

export type MovieDetailsSearch = {
  limit?: number
}

export function parseMovieDetailsSearch(
  search: Record<string, unknown>,
): MovieDetailsSearch {
  const value = search.limit

  if (
    (typeof value !== 'number' && typeof value !== 'string') ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    return {}
  }

  const limit = typeof value === 'number' ? value : Number(value)

  return Number.isSafeInteger(limit) &&
    limit >= MIN_RECOMMENDATIONS_LIMIT &&
    limit <= MAX_RECOMMENDATIONS_LIMIT
    ? { limit }
    : {}
}
