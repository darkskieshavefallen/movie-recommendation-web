import { createFileRoute } from '@tanstack/react-router'
import { CreateMoviePage } from '../pages/create-movie/CreateMoviePage'

export const Route = createFileRoute('/movies/new')({
  component: CreateMoviePage,
})
