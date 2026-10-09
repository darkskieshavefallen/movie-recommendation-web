import { ExternalLink } from 'lucide-react'
import tmdbLogo from '@/assets/tmdb-logo.svg'

export function ExternalSearchAttribution() {
  return (
    <aside
      aria-labelledby="external-search-attribution-title"
      className="grid gap-3 rounded-xl border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground"
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2
          id="external-search-attribution-title"
          className="font-medium text-foreground"
        >
          External catalog credits
        </h2>
        <a
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noreferrer"
          aria-label="Visit The Movie Database (opens in a new tab)"
          className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <img src={tmdbLogo} alt="TMDB" className="h-5 w-auto" />
        </a>
      </div>
      <p>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
      <p>
        External results are read-only and are not saved to your local movie
        collection.
      </p>
      <a
        href="https://www.themoviedb.org/api-terms-of-use"
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-fit items-center gap-1 font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        TMDB API terms of use
        <ExternalLink className="size-3.5" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </aside>
  )
}
