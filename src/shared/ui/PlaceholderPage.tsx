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
    <main className="page">
      <p className="eyebrow">Movie Recommendation</p>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </main>
  )
}
