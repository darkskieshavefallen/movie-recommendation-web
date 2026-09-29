import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/shared/ui/button'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

export function NotFoundPage() {
  return (
    <PlaceholderPage
      title="Page not found"
      description="The requested URL does not match any application route."
    >
      <Link
        to="/movies"
        search={{ offset: 0, limit: 20 }}
        className={buttonVariants({ className: 'w-fit' })}
      >
        Return to the movie catalog
      </Link>
    </PlaceholderPage>
  )
}
