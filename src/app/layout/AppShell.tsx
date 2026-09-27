import { Link, Outlet } from '@tanstack/react-router'
import { ClapperboardIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { RouteLinks } from '@/features/navigation/ui/RouteLinks'
import { ThemeToggle } from '@/features/theme/ui/ThemeToggle'

export function AppShell({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-background px-3 py-2 font-medium shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-3 px-page py-3">
          <Link
            to="/movies"
            search={{ offset: 0, limit: 20 }}
            className="mr-auto inline-flex items-center gap-2 rounded-lg font-heading font-semibold tracking-tight focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ClapperboardIcon className="size-5" aria-hidden="true" />
            </span>
            <span className="hidden sm:inline">Movie Recommendation</span>
            <span className="sm:hidden">Movies</span>
          </Link>
          <RouteLinks />
          <ThemeToggle />
        </div>
      </header>
      <main
        id="main-content"
        className="mx-auto w-full max-w-6xl px-page py-section"
      >
        {children ?? <Outlet />}
      </main>
    </div>
  )
}
