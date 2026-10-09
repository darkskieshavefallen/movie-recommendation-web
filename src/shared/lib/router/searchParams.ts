export type CatalogSearch = {
  offset: number
  limit: number
}

export type ExternalSearch = {
  query?: string
}

const DEFAULT_OFFSET = 0
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100
export const MIN_EXTERNAL_SEARCH_QUERY_LENGTH = 1
export const MAX_EXTERNAL_SEARCH_QUERY_LENGTH = 200

function readInteger(value: unknown, fallback: number) {
  if (
    (typeof value !== 'number' && typeof value !== 'string') ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    return fallback
  }

  const parsed = typeof value === 'number' ? value : Number(value)

  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : fallback
}

export function parseCatalogSearch(
  search: Record<string, unknown>,
): CatalogSearch {
  const offset = readInteger(search.offset, DEFAULT_OFFSET)
  const limit = readInteger(search.limit, DEFAULT_LIMIT)

  return {
    offset,
    limit: limit > 0 && limit <= MAX_LIMIT ? limit : DEFAULT_LIMIT,
  }
}

export function parseExternalSearch(
  search: Record<string, unknown>,
): ExternalSearch {
  if (typeof search.query !== 'string') {
    return {}
  }

  const query = search.query.trim()

  return query.length >= MIN_EXTERNAL_SEARCH_QUERY_LENGTH &&
    query.length <= MAX_EXTERNAL_SEARCH_QUERY_LENGTH
    ? { query }
    : {}
}
