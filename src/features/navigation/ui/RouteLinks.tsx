import { Link } from '@tanstack/react-router'
import { PlusIcon, SearchIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const linkClassName =
  'inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring'

export function RouteLinks() {
  return (
    <nav aria-label="Primary navigation">
      <ul className="flex items-center gap-1">
        <li>
          <Link
            to="/movies"
            search={{ offset: 0, limit: 20 }}
            className={linkClassName}
            activeProps={{
              className: cn(linkClassName, 'bg-muted text-foreground'),
            }}
          >
            Catalog
          </Link>
        </li>
        <li>
          <Link
            to="/movies/new"
            className={linkClassName}
            activeProps={{
              className: cn(linkClassName, 'bg-muted text-foreground'),
            }}
          >
            <PlusIcon aria-hidden="true" />
            <span className="hidden md:inline">Create</span>
          </Link>
        </li>
        <li>
          <Link
            to="/external-search"
            search={{}}
            className={linkClassName}
            activeProps={{
              className: cn(linkClassName, 'bg-muted text-foreground'),
            }}
          >
            <SearchIcon aria-hidden="true" />
            <span className="hidden md:inline">Search</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
