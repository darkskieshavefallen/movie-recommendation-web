import { SparklesIcon } from 'lucide-react'

export function RecommendationsEmptyState() {
  return (
    <div
      className="grid justify-items-start gap-3 rounded-xl border border-dashed bg-card/50 p-5 sm:p-6"
      role="status"
      aria-labelledby="recommendations-empty-title"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground">
        <SparklesIcon className="size-5" aria-hidden="true" />
      </span>
      <div className="grid max-w-xl gap-1.5">
        <h3
          id="recommendations-empty-title"
          className="font-heading text-lg font-semibold"
        >
          No similar movies yet
        </h3>
        <p className="leading-6 text-muted-foreground">
          Add more local movies with overlapping genres to get recommendations.
        </p>
      </div>
    </div>
  )
}
