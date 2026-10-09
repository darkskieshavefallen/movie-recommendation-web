import { SearchIcon } from 'lucide-react'
import { type SyntheticEvent, useState } from 'react'
import {
  MAX_EXTERNAL_SEARCH_QUERY_LENGTH,
  MIN_EXTERNAL_SEARCH_QUERY_LENGTH,
} from '@/shared/lib/router/searchParams'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

type ExternalSearchFormProps = {
  initialQuery?: string
  onSearch: (query: string) => void
}

export function ExternalSearchForm({
  initialQuery,
  onSearch,
}: ExternalSearchFormProps) {
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const value = formData.get('query')
    const query = typeof value === 'string' ? value.trim() : ''

    if (query.length < MIN_EXTERNAL_SEARCH_QUERY_LENGTH) {
      setError('Enter a movie title before searching.')
      return
    }

    if (query.length > MAX_EXTERNAL_SEARCH_QUERY_LENGTH) {
      setError(
        `Keep the search query to ${MAX_EXTERNAL_SEARCH_QUERY_LENGTH} characters or fewer.`,
      )
      return
    }

    setError(null)
    onSearch(query)
  }

  return (
    <form
      className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
      aria-label="External movie search"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <label htmlFor="external-query" className="text-sm font-medium">
          Movie title
        </label>
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="external-query"
            name="query"
            defaultValue={initialQuery}
            placeholder="Search an external movie catalog"
            minLength={MIN_EXTERNAL_SEARCH_QUERY_LENGTH}
            maxLength={MAX_EXTERNAL_SEARCH_QUERY_LENGTH}
            aria-describedby={
              error
                ? 'external-query-help external-query-error'
                : 'external-query-help'
            }
            aria-invalid={Boolean(error)}
            className="pl-9"
            onChange={() => {
              if (error) {
                setError(null)
              }
            }}
          />
        </div>
        <p id="external-query-help" className="text-sm text-muted-foreground">
          Enter between 1 and 200 characters. Search starts only after submit.
        </p>
        {error ? (
          <p
            id="external-query-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
      <Button type="submit" className="sm:mt-7">
        Search
      </Button>
    </form>
  )
}
