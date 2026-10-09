# Real backend smoke verification

## ANT-66 verification record

Verified on 2026-10-09 against disposable local data.

| Component | Version |
| --- | --- |
| Frontend repository | `0ae90a3143e76559ca5bcf9cba254a5b4f0da1ec` |
| Backend repository | `a363de6506384a94bbb52e9d1a04524ace6b9f4d` |
| Node.js | `24.21.0` |
| pnpm | `12.5.1` |
| Docker Compose | `5.5.1` |
| PostgreSQL | `16.15` |

The existing development stack and its saved movies were left untouched. A
separate Compose project named `movie-recommendation-ant66` created a fresh
PostgreSQL volume, exposed its API at `http://127.0.0.1:8001`, and ran with
`TMDB_ENABLED=false`. The frontend ran at `http://localhost:5173` with
`VITE_API_BASE_URL=http://127.0.0.1:8001`.

## Setup evidence

- The fresh catalog returned an empty array before seeding.
- The API entrypoint applied all three Alembic migrations through
  `c3d9a6f4b2e1`.
- `GET /health` and `GET /health/db` both returned `{"status":"ok"}`.
- The explicit `app.cli.seed_demo` command reported `created=12, skipped=0`.
- The seeded catalog contained exactly the 12 fictional demo movies.
- A browser-origin `GET` and CRUD preflight returned
  `access-control-allow-origin: http://localhost:5173`; the preflight allowed
  `GET`, `POST`, `PUT`, `DELETE`, and `OPTIONS`.

## Browser flows

The browser used the real FastAPI and PostgreSQL stack without MSW.

- The catalog rendered all 12 seeded movies.
- A disposable movie was created and its detail route opened.
- Every field was edited and the detail page showed the updated values.
- Recommendations rendered in backend order with matching-genre badges, and a
  recommendation opened the correct movie detail route.
- The disposable movie was deleted, disappeared from the catalog, and its
  direct detail URL rendered the not-found state.
- External search with TMDB disabled rendered the non-retryable
  “External catalog is turned off” state and kept the local-catalog link
  available.
- The final catalog again contained only the 12 seeded demo movies.

The optional live TMDB query was not run because no provider credential was
needed for this compatibility check. No frontend/backend incompatibility was
found.
