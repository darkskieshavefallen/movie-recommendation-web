import {
  CircleCheckIcon,
  InfoIcon,
  MessageSquareIcon,
  SparklesIcon,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import { Input } from '@/shared/ui/input'
import { Skeleton } from '@/shared/ui/skeleton'
import { toast } from '@/shared/ui/toast'

export function DesignSystemPreview() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Foundation preview</h2>
          </CardTitle>
          <CardDescription>
            Accessible controls that future movie forms and screens will reuse.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="preview-title" className="text-sm font-medium">
              Movie title
            </label>
            <Input
              id="preview-title"
              name="preview-title"
              placeholder="For example, Arrival"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                <MessageSquareIcon
                  data-icon="inline-start"
                  aria-hidden="true"
                />
                Open dialog
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Accessible dialog</DialogTitle>
                  <DialogDescription>
                    Focus stays inside this window until it is closed. Press
                    Escape or use a close button.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button />}>Got it</DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              type="button"
              onClick={() =>
                toast.add({
                  title: 'Design system ready',
                  description:
                    'The toast is announced and can be reached with the keyboard.',
                  type: 'success',
                })
              }
            >
              <SparklesIcon data-icon="inline-start" aria-hidden="true" />
              Show toast
            </Button>
          </div>
        </CardContent>
        <CardFooter className="gap-2 text-sm text-muted-foreground">
          <CircleCheckIcon className="size-4 text-primary" aria-hidden="true" />
          Base UI manages keyboard and focus behavior.
        </CardFooter>
      </Card>

      <div className="grid gap-4">
        <Alert>
          <InfoIcon aria-hidden="true" />
          <AlertTitle>Shared visual language</AlertTitle>
          <AlertDescription>
            Colors, spacing, typography, and radius come from reusable design
            tokens.
          </AlertDescription>
        </Alert>
        <Card size="sm" aria-label="Loading state preview">
          <CardHeader>
            <CardTitle>Loading state</CardTitle>
            <CardDescription>
              Skeletons preserve layout while data is loading.
            </CardDescription>
          </CardHeader>
          <CardContent
            className="grid gap-3"
            role="status"
            aria-label="Loading movie preview"
          >
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <span className="sr-only">Loading movie preview</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
