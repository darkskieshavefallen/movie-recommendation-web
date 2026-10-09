import type { components } from '@/shared/api/generated/schema'

export type Movie = components['schemas']['MovieRead']
export type MovieRecommendation = components['schemas']['MovieRecommendation']
export type MovieRecommendations = components['schemas']['MovieRecommendations']
export type MovieId = string
