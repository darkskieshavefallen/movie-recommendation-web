import type { ReactNode } from 'react'

type PlaceholderPageProps = {
  title: string
  description: string
  children?: ReactNode
}

export function PlaceholderPage({
  title,
  description,
  children,
}: PlaceholderPageProps) {
  return (
    <section className="grid gap-8" aria-labelledby="page-title">
      <header className="grid max-w-3xl gap-3">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">
          Movie Recommendation
        </p>
        <h1
          id="page-title"
          className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          {title}
        </h1>
        <p className="text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      </header>
      {children}
    </section>
  )
}
