import createFetchClient from 'openapi-fetch'
import createQueryClient from 'openapi-react-query'
import { apiErrorMiddleware } from './errors'
import type { paths } from './generated/schema'

function getApiBaseUrl(): string {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL

  if (!configuredUrl) {
    throw new Error('VITE_API_BASE_URL is required')
  }

  const url = new URL(configuredUrl)

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('VITE_API_BASE_URL must use HTTP or HTTPS')
  }

  return url.toString().replace(/\/$/, '')
}

export const apiClient = createFetchClient<paths>({
  baseUrl: getApiBaseUrl(),
})

apiClient.use(apiErrorMiddleware)

export const api = createQueryClient(apiClient)
