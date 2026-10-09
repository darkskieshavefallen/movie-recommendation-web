import { Skeleton } from '@/shared/ui/skeleton'

const skeletonIds = [
  'external-result-one',
  'external-result-two',
  'external-result-three',
]

export function ExternalSearchSkeleton() {
  return (
    <div className="grid gap-4" role="status" aria-live="polite">
      <span className="sr-only">Searching the external catalog…</span>
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-hidden="true"
      >
        {skeletonIds.map((id) => (
          <div
            key={id}
            className="grid min-h-52 gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
          >
            <Skeleton className="h-4 w-28" />
            <div className="grid content-start gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="mt-auto grid gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
