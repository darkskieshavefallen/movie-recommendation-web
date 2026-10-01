type CatalogPaginationInput = {
  limit: number
  offset: number
  resultCount: number
}

export type CatalogPagination = {
  canGoNext: boolean
  canGoPrevious: boolean
  endItem: number
  nextOffset: number
  previousOffset: number
  startItem: number | null
}

export function getCatalogPagination({
  limit,
  offset,
  resultCount,
}: CatalogPaginationInput): CatalogPagination {
  return {
    canGoNext: resultCount === limit,
    canGoPrevious: offset > 0,
    endItem: offset + resultCount,
    nextOffset: offset + limit,
    previousOffset: Math.max(0, offset - limit),
    startItem: resultCount > 0 ? offset + 1 : null,
  }
}
