import type { Middleware } from 'openapi-fetch'

export type ApiErrorKind = 'http' | 'network' | 'validation'

export type ApiErrorCode =
  | 'network'
  | 'not_found'
  | 'conflict'
  | 'validation'
  | 'rate_limited'
  | 'service_unavailable'
  | 'server'
  | 'unknown'

export type ApiErrorViewModel = {
  code: ApiErrorCode
  message: string
  retryable: boolean
  status?: number
  technicalCause: unknown
  title: string
}

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

const errorMessages: Record<
  ApiErrorCode,
  Pick<ApiErrorViewModel, 'message' | 'title'>
> = {
  network: {
    title: 'Connection problem',
    message:
      "We couldn't reach the server. Check your connection and try again.",
  },
  not_found: {
    title: 'Not found',
    message: 'The requested resource could not be found.',
  },
  conflict: {
    title: 'Update conflict',
    message:
      'The movie changed while you were editing it. Review the current data and try again.',
  },
  validation: {
    title: 'Check the entered data',
    message: 'Some data is invalid. Review it and try again.',
  },
  rate_limited: {
    title: 'Too many requests',
    message: 'Please wait a moment before trying again.',
  },
  service_unavailable: {
    title: 'Service unavailable',
    message: 'The service is temporarily unavailable. Try again later.',
  },
  server: {
    title: 'Server error',
    message: 'The server could not complete the request. Try again later.',
  },
  unknown: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Try again.',
  },
}

function getApiErrorCode(error: unknown): ApiErrorCode {
  if (!(error instanceof ApiError)) {
    return 'unknown'
  }

  if (error.kind === 'network') {
    return 'network'
  }

  if (error.kind === 'validation' || error.status === 422) {
    return 'validation'
  }

  if (error.status === 404) {
    return 'not_found'
  }

  if (error.status === 409) {
    return 'conflict'
  }

  if (error.status === 429) {
    return 'rate_limited'
  }

  if (error.status === 503) {
    return 'service_unavailable'
  }

  if (error.status !== undefined && error.status >= 500) {
    return 'server'
  }

  return 'unknown'
}

export function isRetryableApiError(error: unknown): boolean {
  const code = getApiErrorCode(error)

  return (
    code === 'network' || code === 'service_unavailable' || code === 'server'
  )
}

export function toApiErrorViewModel(error: unknown): ApiErrorViewModel {
  const code = getApiErrorCode(error)
  const status = error instanceof ApiError ? error.status : undefined

  return {
    code,
    ...errorMessages[code],
    retryable: isRetryableApiError(error),
    ...(status === undefined ? {} : { status }),
    technicalCause: error,
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
