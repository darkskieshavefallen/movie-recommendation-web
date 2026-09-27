import { DesignSystemPreview } from '@/features/design-system-preview/ui/DesignSystemPreview'
import type { CatalogSearch } from '../../shared/lib/router/searchParams'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

export function CatalogPage({ offset, limit }: CatalogSearch) {
  return (
    <PlaceholderPage
      title="Movie catalog"
      description="The local movie catalog will be implemented in a later sprint."
    >
      <p className="w-fit rounded-lg bg-muted px-3 py-2 font-mono text-sm text-muted-foreground">
        Typed search params: offset={offset}, limit={limit}
      </p>
      <DesignSystemPreview />
    </PlaceholderPage>
  )
}
