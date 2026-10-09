# Mocks

`handlers.ts` describes deterministic success and error responses at the HTTP
boundary. Tests can start these handlers with `setupServer` from `msw/node` and
override an individual request with `movieErrorHandlers`.

Fixtures use the generated OpenAPI schema types, so contract drift is caught by
TypeScript instead of being duplicated in handwritten test DTOs.

Browser E2E tests use Playwright's native routing rather than a service worker.
`e2e/fixtures/testApi.ts` provides a fresh in-memory API for each test, covers
the committed CRUD, recommendations, and external-search contract, and returns
`501` for an unhandled backend route. No E2E request reaches FastAPI or TMDB.
