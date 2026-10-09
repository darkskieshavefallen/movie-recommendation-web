import { RotateCcwIcon, TriangleAlertIcon, WifiOffIcon } from 'lucide-react'
import type { ApiErrorViewModel } from '@/shared/api/errors'
import { Button } from '@/shared/ui/button'

type RecommendationsErrorStateProps = {
  error: ApiErrorViewModel
  isRetrying: boolean
  onRetry: () => void
}

export function RecommendationsErrorState({
  error,
  isRetrying,
  onRetry,
}: RecommendationsErrorStateProps) {
  const isOffline = error.code === 'network'
  const ErrorIcon = isOffline ? WifiOffIcon : TriangleAlertIcon

  return (
    <div
      className="grid justify-items-start gap-3 rounded-xl border bg-card p-5 sm:p-6"
      role="alert"
      aria-labelledby="recommendations-error-title"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-destructive/10 text-destructive">
        <ErrorIcon className="size-5" aria-hidden="true" />
      </span>
      <div className="grid max-w-xl gap-1.5">
        <h3
          id="recommendations-error-title"
          className="font-heading text-lg font-semibold"
        >
          {isOffline ? 'Recommendations unavailable' : error.title}
        </h3>
        <p className="leading-6 text-muted-foreground">
          {isOffline
            ? 'The recommendation service could not be reached. Check the connection and try again.'
            : error.message}
        </p>
      </div>
      {error.retryable ? (
        <Button type="button" onClick={onRetry} disabled={isRetrying}>
          <RotateCcwIcon
            data-icon="inline-start"
            className={
              isRetrying ? 'animate-spin motion-reduce:animate-none' : undefined
            }
            aria-hidden="true"
          />
          {isRetrying ? 'Trying again…' : 'Try again'}
        </Button>
      ) : null}
    </div>
  )
}
