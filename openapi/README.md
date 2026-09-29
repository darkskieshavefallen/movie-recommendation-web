# Backend OpenAPI snapshot

`movie-recommendation-api.json` is the committed HTTP contract used to generate
the frontend API types.

- Backend repository: `darkskieshavefallen/movie-recommendation-api`
- Source commit: `07287477c5b6809c4924796ac93d4da0bc835163`
- OpenAPI version: `3.1.0`

The snapshot was exported from `app.main:app` with FastAPI's `app.openapi()`.
The export used deterministic public settings (`APP_TITLE`, `APP_VERSION`, and
a placeholder `DATABASE_URL`); it did not start the application lifespan,
connect to PostgreSQL, or include credentials.

From the backend repository at the source commit, reproduce the snapshot with:

```bash
APP_TITLE='Movie Recommendation API' \
APP_VERSION='0.1.0' \
DATABASE_URL='postgresql+asyncpg://openapi:openapi@127.0.0.1:5432/openapi' \
.venv/bin/python -c \
'import json; from app.main import app; print(json.dumps(app.openapi(), ensure_ascii=False, indent=2, sort_keys=True))' \
> ../movie-recommendation-web/openapi/movie-recommendation-api.json
```

After replacing the snapshot from a newer backend commit, regenerate and check
the TypeScript contract:

```bash
pnpm openapi:generate
pnpm openapi:check
```

`pnpm check` also runs the OpenAPI drift check, so a changed snapshot cannot be
committed without updating `src/shared/api/generated/schema.d.ts`.
