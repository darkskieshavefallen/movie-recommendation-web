import { Skeleton } from '@/shared/ui/skeleton'

const skeletonCardIds = [
  'skeleton-one',
  'skeleton-two',
  'skeleton-three',
  'skeleton-four',
  'skeleton-five',
  'skeleton-six',
]

export function CatalogSkeleton() {
  return (
    <div className="grid gap-4" role="status" aria-live="polite">
      <span className="sr-only">Loading movie catalog…</span>
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-hidden="true"
      >
        {skeletonCardIds.map((cardId) => (
          <div
            key={cardId}
            className="grid min-h-36 gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
          >
            <div className="grid content-start gap-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="mt-auto flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
