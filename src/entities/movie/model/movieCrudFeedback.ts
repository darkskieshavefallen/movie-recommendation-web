import { toApiErrorViewModel } from '@/shared/api/errors'

export type MovieCrudAction = 'create' | 'delete' | 'update'

type MovieCrudToast = {
  description: string
  title: string
  type: 'error' | 'success'
}

const errorTitles: Record<MovieCrudAction, string> = {
  create: 'Movie not created',
  delete: 'Movie not deleted',
  update: 'Changes not saved',
}

export function getMovieCrudErrorToast(
  action: MovieCrudAction,
  error: unknown,
): MovieCrudToast {
  return {
    title: errorTitles[action],
    description: toApiErrorViewModel(error).message,
    type: 'error',
  }
}

export function getMovieCrudSuccessToast(
  action: MovieCrudAction,
  movieTitle: string,
): MovieCrudToast {
  if (action === 'create') {
    return {
      title: 'Movie created',
      description: `${movieTitle} was added to the local catalog.`,
      type: 'success',
    }
  }

  if (action === 'update') {
    return {
      title: 'Movie updated',
      description: `${movieTitle} now has your latest changes.`,
      type: 'success',
    }
  }

  return {
    title: 'Movie deleted',
    description: `${movieTitle} was removed from the local catalog.`,
    type: 'success',
  }
}
