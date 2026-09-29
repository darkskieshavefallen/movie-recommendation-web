import type { Middleware } from 'openapi-fetch'

export type ApiErrorKind = 'http' | 'network' | 'validation'

type ApiErrorOptions = {
  body?: unknown
  cause?: unknown
  kind: ApiErrorKind
  message: string
  status?: number
}

export class ApiError extends Error {
  readonly body?: unknown
  readonly kind: ApiErrorKind
  readonly status?: number

  constructor({ body, cause, kind, message, status }: ApiErrorOptions) {
    super(message, { cause })
    this.name = 'ApiError'
    this.body = body
    this.kind = kind
    this.status = status
  }
}

async function readErrorBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type')?.toLowerCase()

  if (contentType?.includes('application/json')) {
    try {
      return await response.clone().json()
    } catch {
      return undefined
    }
  }

  try {
    const body = await response.clone().text()
    return body || undefined
  } catch {
    return undefined
  }
}

export const apiErrorMiddleware: Middleware = {
  async onResponse({ response }) {
    if (response.ok) {
      return undefined
    }

    const isValidationError = response.status === 422

    throw new ApiError({
      body: await readErrorBody(response),
      kind: isValidationError ? 'validation' : 'http',
      message: isValidationError
        ? 'The request could not be validated.'
        : `The API request failed with status ${response.status}.`,
      status: response.status,
    })
  },
  onError({ error }) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return error
    }

    return new ApiError({
      cause: error,
      kind: 'network',
      message: 'Unable to reach the API.',
    })
  },
}
