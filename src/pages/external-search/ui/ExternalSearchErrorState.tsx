import { Link } from '@tanstack/react-router'
import { CloudOffIcon, RotateCcwIcon, TriangleAlertIcon } from 'lucide-react'
import type { ExternalSearchErrorViewModel } from '@/entities/external-movie/model/errors'
import { Button, buttonVariants } from '@/shared/ui/button'

type ExternalSearchErrorStateProps = {
  error: ExternalSearchErrorViewModel
  isRetrying: boolean
  onRetry: () => void
}

export function ExternalSearchErrorState({
  error,
  isRetrying,
  onRetry,
}: ExternalSearchErrorStateProps) {
  const Icon = error.code === 'disabled' ? CloudOffIcon : TriangleAlertIcon

  return (
    <section
      className="grid justify-items-start gap-4 rounded-xl border border-destructive/30 bg-card p-6 sm:p-8"
      aria-labelledby="external-search-error-title"
      role="alert"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-destructive/10 text-destructive">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="grid max-w-2xl gap-2">
        <p className="text-sm font-medium text-muted-foreground">
          External catalog only
        </p>
        <h2
          id="external-search-error-title"
          className="font-heading text-xl font-semibold"
        >
          {error.title}
        </h2>
        <p className="leading-7 text-muted-foreground">{error.message}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {error.retryable ? (
          <Button type="button" disabled={isRetrying} onClick={onRetry}>
            <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
            {isRetrying ? 'Trying again…' : 'Try external search again'}
          </Button>
        ) : null}
        <Link
          to="/movies"
          search={{ limit: 20, offset: 0 }}
          className={buttonVariants({ variant: 'outline' })}
        >
          Open local catalog
        </Link>
      </div>
    </section>
  )
}
