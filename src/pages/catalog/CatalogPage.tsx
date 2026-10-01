import { Link } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useMoviesQuery } from '@/entities/movie/api/useMoviesQuery'
import { MovieList } from '@/entities/movie/ui/MovieList'
import { CatalogPagination } from '@/features/catalog-pagination/ui/CatalogPagination'
import { toApiErrorViewModel } from '@/shared/api/errors'
import { buttonVariants } from '@/shared/ui/button'
import type { CatalogSearch } from '../../shared/lib/router/searchParams'
import { CatalogEmptyState } from './ui/CatalogEmptyState'
import { CatalogErrorState } from './ui/CatalogErrorState'
import { CatalogSkeleton } from './ui/CatalogSkeleton'

export function CatalogPage({ offset, limit }: CatalogSearch) {
  const moviesQuery = useMoviesQuery({ offset, limit })

  let content: ReactNode

  if (moviesQuery.isPending) {
    content = <CatalogSkeleton />
  } else if (moviesQuery.isError) {
    const error = toApiErrorViewModel(moviesQuery.error)

    content = (
      <CatalogErrorState
        error={error}
        isRetrying={moviesQuery.isFetching}
        onRetry={() => void moviesQuery.refetch()}
      />
    )
  } else if (moviesQuery.data.length === 0) {
    content = <CatalogEmptyState />
  } else {
    content = <MovieList movies={moviesQuery.data} />
  }

  return (
    <section className="grid gap-8" aria-labelledby="catalog-title">
      <header className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div className="grid max-w-3xl gap-3">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            Local collection
          </p>
          <h1
            id="catalog-title"
            className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Movie catalog
          </h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            Browse movies saved in your local recommendation catalog.
          </p>
        </div>
        <Link to="/movies/new" className={buttonVariants({ size: 'lg' })}>
          <PlusIcon data-icon="inline-start" aria-hidden="true" />
          Create movie
        </Link>
      </header>
      {content}
      {moviesQuery.isSuccess ? (
        <CatalogPagination
          limit={limit}
          offset={offset}
          resultCount={moviesQuery.data.length}
        />
      ) : null}
    </section>
  )
}
