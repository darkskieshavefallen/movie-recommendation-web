import type { ErrorComponentProps } from '@tanstack/react-router'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

export function RootErrorPage({ error, reset }: ErrorComponentProps) {
  const message =
    error instanceof Error
      ? error.message
      : 'An unexpected application error occurred.'

  return (
    <PlaceholderPage title="Something went wrong" description={message}>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </PlaceholderPage>
  )
}
