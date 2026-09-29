import { createRootRoute } from '@tanstack/react-router'
import { AppShell } from '@/app/layout/AppShell'
import { NotFoundPage } from '../pages/not-found/NotFoundPage'
import { RootErrorPage } from '../pages/root-error/RootErrorPage'

export const Route = createRootRoute({
  component: RootRoute,
  errorComponent: RootErrorPage,
  notFoundComponent: NotFoundPage,
})

function RootRoute() {
  return <AppShell />
}
