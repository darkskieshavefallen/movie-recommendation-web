import { ApiError } from '@/shared/api/errors'

export type ExternalSearchErrorCode =
  | 'authentication'
  | 'disabled'
  | 'network'
  | 'provider_response'
  | 'rate_limited'
  | 'timeout'
  | 'unavailable'

export type ExternalSearchErrorViewModel = {
  code: ExternalSearchErrorCode
  message: string
  retryable: boolean
  title: string
}

const publicDetails = {
  authentication: 'External movie provider authentication failed.',
  disabled: 'External movie catalog is disabled.',
  invalidResponse: 'External movie provider returned an invalid response.',
  rateLimited: 'External movie provider rate limit exceeded.',
  requestFailed: 'External movie provider request failed.',
  timeout: 'External movie provider timed out.',
  unavailable: 'External movie provider is unavailable.',
} as const

const errorViews: Record<
  ExternalSearchErrorCode,
  ExternalSearchErrorViewModel
> = {
  authentication: {
    code: 'authentication',
    title: 'External catalog needs configuration',
    message:
      'The external catalog cannot authenticate right now. The application configuration must be fixed before searching again.',
    retryable: false,
  },
  disabled: {
    code: 'disabled',
    title: 'External catalog is turned off',
    message:
      'External movie search is not enabled for this deployment. Your local collection remains available.',
    retryable: false,
  },
  network: {
    code: 'network',
    title: 'Connection problem',
    message:
      "We couldn't reach the application server. Check your connection and try the external search again.",
    retryable: true,
  },
  provider_response: {
    code: 'provider_response',
    title: 'External catalog response failed',
    message:
      'The external provider returned a response the application cannot use. Your local collection is unaffected.',
    retryable: false,
  },
  rate_limited: {
    code: 'rate_limited',
    title: 'External catalog request limit reached',
    message:
      'The external provider is temporarily limiting requests. Wait a moment, then try again.',
    retryable: true,
  },
  timeout: {
    code: 'timeout',
    title: 'External catalog timed out',
    message:
      'The external provider took too long to respond. Try the search again.',
    retryable: true,
  },
  unavailable: {
    code: 'unavailable',
    title: 'External catalog is unavailable',
    message:
      'The external provider is temporarily unavailable. Try again later or continue with your local collection.',
    retryable: true,
  },
}

function readPublicDetail(error: ApiError): string | null {
  if (
    typeof error.body !== 'object' ||
    error.body === null ||
    !('detail' in error.body)
  ) {
    return null
  }

  return typeof error.body.detail === 'string' ? error.body.detail : null
}

export function toExternalSearchErrorViewModel(
  error: unknown,
): ExternalSearchErrorViewModel {
  if (!(error instanceof ApiError)) {
    return errorViews.provider_response
  }

  if (error.kind === 'network') {
    return errorViews.network
  }

  const detail = readPublicDetail(error)

  if (detail === publicDetails.disabled) {
    return errorViews.disabled
  }

  if (detail === publicDetails.authentication) {
    return errorViews.authentication
  }

  if (detail === publicDetails.rateLimited || error.status === 429) {
    return errorViews.rate_limited
  }

  if (detail === publicDetails.timeout || error.status === 504) {
    return errorViews.timeout
  }

  if (detail === publicDetails.unavailable || error.status === 503) {
    return errorViews.unavailable
  }

  if (
    detail === publicDetails.invalidResponse ||
    detail === publicDetails.requestFailed ||
    error.status === 502 ||
    error.status === 422
  ) {
    return errorViews.provider_response
  }

  return error.status !== undefined && error.status >= 500
    ? errorViews.unavailable
    : errorViews.provider_response
}
