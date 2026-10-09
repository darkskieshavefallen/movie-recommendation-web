# Project Context

## Product boundary

Movie Recommendation Web is a React SPA for the FastAPI service in the sibling
`movie-recommendation-api` repository. The browser communicates only with that
API. PostgreSQL, TMDB credentials, persistence rules, and provider error details
remain backend responsibilities.

The frontend HTTP contract is generated from
`openapi/movie-recommendation-api.json`. Generated types are committed in
`src/shared/api/generated/schema.d.ts`; do not maintain parallel request or
response DTOs by hand.

## Current implementation

Web Sprints 1–5 provide:

- application shell, responsive design tokens, dark mode, and typed routes;
- shared OpenAPI client, TanStack Query cache, safe API error mapping, and MSW
  fixtures;
- paginated local catalog and direct movie detail pages;
- a shared React Hook Form and Zod 4 movie form;
- complete create, read, full-replacement update, and delete flows;
- field-level FastAPI 422 feedback and safe CRUD toast notifications;
- explicit loading, empty, offline, not-found, conflict, and server-error
  states;
- explainable local-movie recommendations with backend-ranked ordering,
  matching-genre badges, and a URL-backed limit;
- direct and cyclic recommendation navigation without retaining the previous
  source response;
- recommendation loading, successful empty, safe error, retry, responsive, and
  reduced-motion states;
- URL-backed, submit-only external movie search through the FastAPI boundary;
- provider-independent external result cards that cannot mutate the local
  catalog;
- explicit empty, disabled, authentication, rate-limit, timeout, unavailable,
  and safe fallback states with user-controlled retry;
- persistent TMDB attribution and a clear read-only, not-saved notice.

Layering follows `app/routes/pages -> features -> entities -> shared`. Server
state belongs to TanStack Query, route state belongs to TanStack Router, and
form state belongs to React Hook Form.

## CRUD cache behavior

- Create stores the returned movie in its detail cache and invalidates movie
  lists before navigating to the new detail route.
- Update replaces the detail cache, updates matching entries in cached lists,
  and invalidates lists for server reconciliation.
- Delete removes the detail cache, removes matching entries from cached lists,
  invalidates lists, and navigates to the catalog after a successful `204`.

Mutation controls are disabled while requests are pending and use an additional
in-flight guard. Failed requests keep form values or the delete dialog intact.
No raw backend body or exception detail is rendered to users.

## Verification strategy

Vitest and React Testing Library exercise user-visible behavior. MSW intercepts
requests at the HTTP boundary, so tests use the real router, query client, form,
and API middleware instead of mocking hooks.

The CRUD MVP suite covers:

- create, detail navigation, edit, catalog synchronization, and delete in one
  browser-like journey;
- client and FastAPI validation;
- duplicate-submit protection and delete cancellation;
- cache invalidation and mutation navigation;
- `404`, `409`, network, service, and server failures.

The recommendation suite additionally covers:

- exact backend ordering and matching genres;
- limit requests and URL persistence;
- loading, empty, error, and retry behavior;
- direct route refresh and cyclic source navigation;
- cache invalidation after catalog mutations.

The external-search suite additionally covers:

- submitted URL state, direct refresh, and back/forward restoration;
- successful results, missing optional fields, long content, and empty results;
- disabled `503`, rate-limited `429`, timeout `504`, authentication, unavailable,
  and unexpected provider failures;
- manual retry after transient failure and suppression of raw response details;
- the TMDB credit and the external-results-not-saved boundary.

The Sprint 6 accessibility baseline additionally covers:

- automated axe-core audits of the catalog, create form, movie details and
  recommendations, and external search routes;
- keyboard route navigation with focus moved to updated main content;
- delete-dialog focus containment and restoration after `Escape`;
- current-page navigation semantics, ordered headings, long-content wrapping,
  and reduced-motion behavior for overlays and notifications;
- browser layout checks at 320, 768, and 1440 CSS pixels with no horizontal
  overflow on the key routes.

Contrast remains a real-browser/manual check because jsdom does not provide the
layout and canvas color engine axe needs for that rule. Both theme palettes use
WCAG AA text pairs for foreground, muted, primary, and destructive content.

Playwright provides the browser-level E2E harness for Sprint 6. It starts an
isolated Vite server, runs required Chromium tests, and intercepts the complete
frontend API boundary with fresh in-memory state per test. Tests use accessible
role and label locators, run independently, and never require the real backend,
database, provider, or secrets. On failure, CI retains screenshots, video,
trace, error context, and the HTML report for diagnosis.

The critical-flow suite covers catalog pagination at a mobile viewport, the
complete create/edit/delete journey, movie details and recommendation
navigation, successful external search without importing results, and the
disabled-provider state. The flows use only web-first assertions and can run in
parallel against isolated state.

All provider scenarios in the automated suite are intercepted by MSW at the
FastAPI route. Tests and CI never call TMDB or load a real credential. A single
bounded real-provider query is reserved for the local manual smoke documented
in `README.md`, with the credential stored only in the backend's ignored
environment file.

Before completing a sprint, run:

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

The manual smoke checklist lives in `README.md` and must use the real FastAPI
and PostgreSQL stack at the documented localhost origins.

The completed ANT-66 compatibility run is recorded in
`docs/REAL_BACKEND_SMOKE.md` with the exact frontend and backend revisions,
fresh migration and seed evidence, real CORS headers, and browser CRUD and
recommendation results.

Sprint 6 also verifies the production bundle and automatic route code
splitting. `pnpm build:manifest` emits a source-to-chunk manifest for release
inspection, while `pnpm release:check` runs the complete local quality gate.
The shadcn package is classified as a development dependency because its
Tailwind stylesheet is consumed only while building CSS.

## Known API limitations

- `GET /movies/` exposes `offset` and `limit` but no total count.
- `PUT /movies/{movie_id}` requires the full movie payload; `PATCH` is absent.
- Movie records have no image fields.
- External search does not import results into the local catalog.
- Authentication and authorization are outside the current MVP.
- Concurrent edits have no version token; the UI can explain a `409` if the
  backend reports one, but cannot merge competing edits.

External search remains optional and read-only; importing a result into the
local catalog is a future capability rather than an implicit side effect.

The current result is a local release baseline. Hosting, server deployment,
production CORS and TLS, observability, backups, and secret management remain a
separate future delivery decision.
