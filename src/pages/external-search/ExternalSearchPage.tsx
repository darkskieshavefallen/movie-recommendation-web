import { ExternalSearchForm } from '@/features/external-search/ui/ExternalSearchForm'
import type { ExternalSearch } from '@/shared/lib/router/searchParams'
import { PlaceholderPage } from '@/shared/ui/PlaceholderPage'

type ExternalSearchPageProps = ExternalSearch & {
  onSearch: (query: string) => void
}

export function ExternalSearchPage({
  query,
  onSearch,
}: ExternalSearchPageProps) {
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
        <p className="text-sm text-muted-foreground" role="status">
          {query
            ? `Confirmed search: ${query}`
            : 'Enter a movie title to start an external search.'}
        </p>
      </div>
    </PlaceholderPage>
  )
}
