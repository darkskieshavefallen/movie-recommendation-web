import type { ReactNode } from 'react'
import { useExternalMovieSearchQuery } from '@/entities/external-movie/api/useExternalMovieSearchQuery'
import { toExternalSearchErrorViewModel } from '@/entities/external-movie/model/errors'
import { ExternalMovieCard } from '@/entities/external-movie/ui/ExternalMovieCard'
import { ExternalSearchForm } from '@/features/external-search/ui/ExternalSearchForm'
import type { ExternalSearch } from '@/shared/lib/router/searchParams'
import { PlaceholderPage } from '@/shared/ui/PlaceholderPage'
import { ExternalSearchAttribution } from './ui/ExternalSearchAttribution'
import { ExternalSearchEmptyState } from './ui/ExternalSearchEmptyState'
import { ExternalSearchErrorState } from './ui/ExternalSearchErrorState'
import { ExternalSearchSkeleton } from './ui/ExternalSearchSkeleton'

type ExternalSearchPageProps = ExternalSearch & {
  onSearch: (query: string) => void
}

export function ExternalSearchPage({
  query,
  onSearch,
}: ExternalSearchPageProps) {
  const searchQuery = useExternalMovieSearchQuery(query ?? null)
  let searchContent: ReactNode

  if (!query) {
    searchContent = (
      <p className="text-sm text-muted-foreground" role="status">
        Enter a movie title to start an external search.
      </p>
    )
  } else if (searchQuery.isPending) {
    searchContent = <ExternalSearchSkeleton />
  } else if (searchQuery.isError) {
    searchContent = (
      <ExternalSearchErrorState
        error={toExternalSearchErrorViewModel(searchQuery.error)}
        isRetrying={searchQuery.isFetching}
        onRetry={() => void searchQuery.refetch()}
      />
    )
  } else if (searchQuery.data.results.length === 0) {
    searchContent = <ExternalSearchEmptyState query={query} />
  } else {
    searchContent = (
      <section className="grid gap-4" aria-labelledby="external-results-title">
        <div className="grid gap-1">
          <p className="text-sm font-medium text-primary">External results</p>
          <h2
            id="external-results-title"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Results for “{query}”
          </h2>
          <p className="text-sm text-muted-foreground">
            These movies come from an external catalog and are not part of your
            local collection.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {searchQuery.data.results.map((movie) => (
            <li key={movie.external_id} className="min-w-0">
              <ExternalMovieCard movie={movie} />
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <PlaceholderPage
      title="External movie search"
      description="Search the optional external catalog without changing your local collection."
    >
      <div className="grid max-w-2xl gap-5 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:p-6">
        <ExternalSearchForm
          key={query ?? 'empty-query'}
          initialQuery={query}
          onSearch={onSearch}
        />
      </div>
      {searchContent}
      <ExternalSearchAttribution />
    </PlaceholderPage>
  )
}
