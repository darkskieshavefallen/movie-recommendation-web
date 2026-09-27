import type { ErrorComponentProps } from '@tanstack/react-router'
import { AppShell } from '@/app/layout/AppShell'
import { Button } from '@/shared/ui/button'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

export function RootErrorPage({ error, reset }: ErrorComponentProps) {
  const message =
    error instanceof Error
      ? error.message
      : 'An unexpected application error occurred.'

  return (
    <AppShell>
      <PlaceholderPage title="Something went wrong" description={message}>
        <Button type="button" className="w-fit" onClick={reset}>
          Try again
        </Button>
      </PlaceholderPage>
    </AppShell>
  )
}
