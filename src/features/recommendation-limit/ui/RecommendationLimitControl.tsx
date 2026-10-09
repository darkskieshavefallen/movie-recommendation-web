import {
  MAX_RECOMMENDATIONS_LIMIT,
  MIN_RECOMMENDATIONS_LIMIT,
} from '@/entities/movie/model/recommendations'

type RecommendationLimitControlProps = {
  limit: number
  onLimitChange: (limit: number) => void
}

const limitOptions = Array.from(
  {
    length: MAX_RECOMMENDATIONS_LIMIT - MIN_RECOMMENDATIONS_LIMIT + 1,
  },
  (_, index) => MIN_RECOMMENDATIONS_LIMIT + index,
)

export function RecommendationLimitControl({
  limit,
  onLimitChange,
}: RecommendationLimitControlProps) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      Show
      <select
        aria-label="Number of recommendations"
        value={limit}
        onChange={(event) => onLimitChange(Number(event.target.value))}
        className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {limitOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      recommendations
    </label>
  )
}
