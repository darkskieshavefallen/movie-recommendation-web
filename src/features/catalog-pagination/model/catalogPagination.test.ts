import { describe, expect, it } from 'vitest'
import { getCatalogPagination } from './catalogPagination'

describe('getCatalogPagination', () => {
  it('enables only next for a full first response', () => {
    expect(
      getCatalogPagination({ limit: 20, offset: 0, resultCount: 20 }),
    ).toEqual({
      canGoNext: true,
      canGoPrevious: false,
      endItem: 20,
      nextOffset: 20,
      previousOffset: 0,
      startItem: 1,
    })
  })

  it('enables only previous for a partial later response', () => {
    expect(
      getCatalogPagination({ limit: 20, offset: 20, resultCount: 7 }),
    ).toEqual({
      canGoNext: false,
      canGoPrevious: true,
      endItem: 27,
      nextOffset: 40,
      previousOffset: 0,
      startItem: 21,
    })
  })

  it('does not claim an item range for an empty response', () => {
    expect(
      getCatalogPagination({ limit: 20, offset: 40, resultCount: 0 }),
    ).toMatchObject({
      canGoNext: false,
      canGoPrevious: true,
      endItem: 40,
      previousOffset: 20,
      startItem: null,
    })
  })
})
