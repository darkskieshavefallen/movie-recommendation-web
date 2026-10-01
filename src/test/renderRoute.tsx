import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { routeTree } from '@/routeTree.gen'
import { Toaster } from '@/shared/ui/toast'

export async function renderRoute(initialEntry: string) {
  const history = createMemoryHistory({ initialEntries: [initialEntry] })
  const router = createRouter({
    history,
    routeTree,
    defaultPreload: false,
  })
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { gcTime: Number.POSITIVE_INFINITY, retry: false },
    },
  })
  const user = userEvent.setup()

  await router.load()

  const view = render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster>
          <RouterProvider router={router} />
        </Toaster>
      </QueryClientProvider>
    </ThemeProvider>,
  )

  return { history, queryClient, router, user, ...view }
}
