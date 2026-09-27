import { SearchIcon } from 'lucide-react'
import { Input } from '@/shared/ui/input'
import type { ExternalSearch } from '../../shared/lib/router/searchParams'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

export function ExternalSearchPage({ query }: ExternalSearch) {
  return (
    <PlaceholderPage
      title="External movie search"
      description="External provider results will be implemented in a later sprint."
    >
      <div className="grid max-w-2xl gap-2">
        <label htmlFor="external-query" className="text-sm font-medium">
          Search query
        </label>
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="external-query"
            name="query"
            defaultValue={query}
            placeholder="Search an external movie catalog"
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Typed search param: query={query ?? 'not set'}
        </p>
      </div>
    </PlaceholderPage>
  )
}
