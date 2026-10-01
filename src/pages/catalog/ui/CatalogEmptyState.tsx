import { Link } from '@tanstack/react-router'
import { ClapperboardIcon, PlusIcon } from 'lucide-react'
import { buttonVariants } from '@/shared/ui/button'

export function CatalogEmptyState() {
  return (
    <section
      className="grid justify-items-start gap-4 rounded-xl border border-dashed bg-card/50 p-6 sm:p-8"
      aria-labelledby="empty-catalog-title"
    >
      <span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground">
        <ClapperboardIcon className="size-5" aria-hidden="true" />
      </span>
      <div className="grid max-w-xl gap-2">
        <h2
          id="empty-catalog-title"
          className="font-heading text-xl font-semibold"
        >
          Your catalog is empty
        </h2>
        <p className="leading-7 text-muted-foreground">
          Add the first local movie to start building recommendations.
        </p>
      </div>
      <Link to="/movies/new" className={buttonVariants()}>
        <PlusIcon data-icon="inline-start" aria-hidden="true" />
        Create the first movie
      </Link>
    </section>
  )
}
