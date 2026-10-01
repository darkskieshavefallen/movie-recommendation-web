import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { buttonVariants } from '@/shared/ui/button'
import { getCatalogPagination } from '../model/catalogPagination'

type CatalogPaginationProps = {
  limit: number
  offset: number
  resultCount: number
}

const disabledActionClassName = buttonVariants({
  className: 'pointer-events-none opacity-50',
  variant: 'outline',
})

export function CatalogPagination({
  limit,
  offset,
  resultCount,
}: CatalogPaginationProps) {
  const pagination = getCatalogPagination({ limit, offset, resultCount })

  if (!pagination.canGoPrevious && !pagination.canGoNext) {
    return null
  }

  return (
    <nav
      aria-label="Catalog pagination"
      className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-muted-foreground">
        {pagination.startItem === null
          ? 'No movies on this page'
          : `Showing movies ${pagination.startItem}–${pagination.endItem}`}
      </p>
      <div className="flex gap-2">
        {pagination.canGoPrevious ? (
          <Link
            to="/movies"
            search={{ offset: pagination.previousOffset, limit }}
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
            Previous
          </Link>
        ) : (
          <span aria-disabled="true" className={disabledActionClassName}>
            <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
            Previous
          </span>
        )}
        {pagination.canGoNext ? (
          <Link
            to="/movies"
            search={{ offset: pagination.nextOffset, limit }}
            className={buttonVariants({ variant: 'outline' })}
          >
            Next
            <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
          </Link>
        ) : (
          <span aria-disabled="true" className={disabledActionClassName}>
            Next
            <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  )
}
