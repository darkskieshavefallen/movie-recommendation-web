import { SearchXIcon } from 'lucide-react'

type ExternalSearchEmptyStateProps = {
  query: string
}

export function ExternalSearchEmptyState({
  query,
}: ExternalSearchEmptyStateProps) {
  return (
    <section
      className="grid justify-items-start gap-4 rounded-xl border border-dashed bg-card/50 p-6 sm:p-8"
      aria-labelledby="external-search-empty-title"
      role="status"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground">
        <SearchXIcon className="size-5" aria-hidden="true" />
      </span>
      <div className="grid max-w-xl gap-2">
        <h2
          id="external-search-empty-title"
          className="font-heading text-xl font-semibold"
        >
          No external matches
        </h2>
        <p className="leading-7 text-muted-foreground">
          The external catalog returned no movies for “{query}”. Try another
          title or spelling.
        </p>
      </div>
    </section>
  )
}
