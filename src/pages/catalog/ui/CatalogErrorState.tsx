import { RotateCcwIcon, TriangleAlertIcon, WifiOffIcon } from 'lucide-react'
import type { ApiErrorViewModel } from '@/shared/api/errors'
import { Button } from '@/shared/ui/button'

type CatalogErrorStateProps = {
  error: ApiErrorViewModel
  isRetrying: boolean
  onRetry: () => void
}

export function CatalogErrorState({
  error,
  isRetrying,
  onRetry,
}: CatalogErrorStateProps) {
  const isOffline = error.code === 'network'
  const ErrorIcon = isOffline ? WifiOffIcon : TriangleAlertIcon

  return (
    <section
      className="grid justify-items-start gap-4 rounded-xl border bg-card p-6 sm:p-8"
      aria-labelledby="catalog-error-title"
      role="alert"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-destructive/10 text-destructive">
        <ErrorIcon className="size-5" aria-hidden="true" />
      </span>
      <div className="grid max-w-xl gap-2">
        <h2
          id="catalog-error-title"
          className="font-heading text-xl font-semibold"
        >
          {isOffline ? 'Catalog unavailable' : error.title}
        </h2>
        <p className="leading-7 text-muted-foreground">
          {isOffline
            ? 'You may be offline, or the API may be temporarily unreachable.'
            : error.message}
        </p>
      </div>
      {error.retryable ? (
        <Button type="button" onClick={onRetry} disabled={isRetrying}>
          <RotateCcwIcon
            data-icon="inline-start"
            className={isRetrying ? 'animate-spin' : undefined}
            aria-hidden="true"
          />
          {isRetrying ? 'Trying again…' : 'Try again'}
        </Button>
      ) : null}
    </section>
  )
}
