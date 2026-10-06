import { ApiError } from '@/shared/api/errors'

export type MovieFormField = 'title' | 'release_year' | 'description' | 'genres'

export type MovieFormFieldErrors = Partial<Record<MovieFormField, string>>

type ValidationIssue = {
  loc: (string | number)[]
  msg: string
}

const movieFormFields = new Set<MovieFormField>([
  'title',
  'release_year',
  'description',
  'genres',
])

function isValidationIssue(value: unknown): value is ValidationIssue {
  if (!value || typeof value !== 'object') {
    return false
  }

  const issue = value as Partial<ValidationIssue>

  return (
    Array.isArray(issue.loc) &&
    issue.loc.every(
      (part) => typeof part === 'string' || typeof part === 'number',
    ) &&
    typeof issue.msg === 'string'
  )
}

function getValidationIssues(body: unknown): ValidationIssue[] {
  if (!body || typeof body !== 'object' || !('detail' in body)) {
    return []
  }

  const { detail } = body as { detail?: unknown }

  return Array.isArray(detail) ? detail.filter(isValidationIssue) : []
}

export function getMovieFormFieldErrors(error: unknown): MovieFormFieldErrors {
  if (!(error instanceof ApiError) || error.status !== 422) {
    return {}
  }

  const fieldErrors: MovieFormFieldErrors = {}

  for (const issue of getValidationIssues(error.body)) {
    const field = issue.loc.find(
      (part): part is MovieFormField =>
        typeof part === 'string' && movieFormFields.has(part as MovieFormField),
    )

    if (field && fieldErrors[field] === undefined) {
      fieldErrors[field] = issue.msg
    }
  }

  return fieldErrors
}
