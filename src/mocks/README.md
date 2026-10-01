# Mocks

`handlers.ts` describes deterministic success and error responses at the HTTP
boundary. Tests can start these handlers with `setupServer` from `msw/node` and
override an individual request with `movieErrorHandlers`.

Fixtures use the generated OpenAPI schema types, so contract drift is caught by
TypeScript instead of being duplicated in handwritten test DTOs.
