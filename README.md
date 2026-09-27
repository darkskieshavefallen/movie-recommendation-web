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

## Checks

Run TypeScript type checking:

```bash
pnpm typecheck
```

Run ESLint:

```bash
pnpm lint
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