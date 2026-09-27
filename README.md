# Movie Recommendation Web

Frontend application for Movie Recommendation API.

## Requirements

- Node.js 24
- pnpm 12.5.1

## Installation

Install dependencies:

```bash
pnpm install --frozen-lockfile
```

Create a local environment file:

```bash
cp .env.example .env.local
```

## Development

Start the development server:

```bash
pnpm dev
```

Open http://localhost:5173 in the browser.

## Application structure

The frontend uses feature-based layers:

- `app` configures application-wide providers and the router.
- `routes` maps URLs to pages and contains no business logic.
- `pages` composes complete screens.
- `features` contains user actions and flows.
- `entities` contains domain models and entity-level UI.
- `shared` contains reusable infrastructure and UI.
- `mocks` contains test fixtures and API mocks.

TanStack Router generates the type-safe route tree from files in `src/routes`.
The generated `src/routeTree.gen.ts` file is committed but must not be edited manually.

| URL | Screen |
| --- | --- |
| `/movies` | Local movie catalog |
| `/movies/new` | Create movie |
| `/movies/:movieId` | Movie details |
| `/movies/:movieId/edit` | Edit movie |
| `/external-search?query=...` | External movie search |

## Checks

Run formatting, linting, and import organization checks:

```bash
pnpm check
```

Apply safe fixes and formatting:

```bash
pnpm check:fix
```

Run TypeScript type checking:

```bash
pnpm typecheck
```

Create a production build:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

Open http://localhost:4173 in the browser.
