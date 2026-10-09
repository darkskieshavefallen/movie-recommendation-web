import { Skeleton } from '@/shared/ui/skeleton'

const skeletonCardIds = [
  'recommendation-skeleton-one',
  'recommendation-skeleton-two',
  'recommendation-skeleton-three',
]

export function RecommendationsSkeleton() {
  return (
    <div className="grid gap-4" role="status" aria-live="polite">
      <span className="sr-only">Loading recommendations…</span>
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-hidden="true"
      >
        {skeletonCardIds.map((cardId) => (
          <div
            key={cardId}
            className="grid min-h-40 gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
          >
            <div className="grid content-start gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="mt-auto grid gap-3">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
