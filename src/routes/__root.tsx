import { createRootRoute, Outlet } from '@tanstack/react-router'
import { NotFoundPage } from '../pages/not-found/NotFoundPage'
import { RootErrorPage } from '../pages/root-error/RootErrorPage'

export const Route = createRootRoute({
  component: RootRoute,
  errorComponent: RootErrorPage,
  notFoundComponent: NotFoundPage,
})

function RootRoute() {
  return <Outlet />
}
