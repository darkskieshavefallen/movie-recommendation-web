import { Link } from '@tanstack/react-router'
import { CalendarDaysIcon, SparklesIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import type { MovieRecommendation } from '../model/types'

type RecommendationCardProps = {
  limit: number
  recommendation: MovieRecommendation
}

export function RecommendationCard({
  limit,
  recommendation,
}: RecommendationCardProps) {
  const titleId = `recommendation-${recommendation.movie_id}-title`

  return (
    <article aria-labelledby={titleId} className="h-full">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(recommendation.movie_id) }}
        search={{ limit }}
        viewTransition
        className="group block h-full min-w-0 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Card className="h-full transition-[transform,box-shadow] duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
          <CardHeader>
            <CardTitle>
              <h3 id={titleId} className="break-words">
                {recommendation.title}
              </h3>
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <CalendarDaysIcon className="size-4" aria-hidden="true" />
              <span>{recommendation.release_year}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto grid gap-3">
            <p className="flex items-center gap-2 text-sm font-medium">
              <SparklesIcon
                className="size-4 text-primary"
                aria-hidden="true"
              />
              Matching genres
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Matching genres">
              {recommendation.matching_genres.map((genre) => (
                <li
                  key={genre.toLowerCase()}
                  className="max-w-full rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium break-words whitespace-normal text-primary"
                >
                  {genre}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Link>
    </article>
  )
}
