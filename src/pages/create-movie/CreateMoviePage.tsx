import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

export function CreateMoviePage() {
  return (
    <PlaceholderPage
      title="Create movie"
      description="The create form will be added after the shared movie form is ready."
    >
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Form route is ready</CardTitle>
          <CardDescription>
            The shared form will be connected in Web Sprint 3.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Navigation and responsive layout already work for direct links and
          client transitions.
        </CardContent>
      </Card>
    </PlaceholderPage>
  )
}
