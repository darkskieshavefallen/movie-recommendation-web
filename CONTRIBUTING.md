# Contributing

Thanks for helping improve Movie Recommendation Web.

## Before starting

This repository uses Linear as its only task tracker and does not use GitHub
Issues. Please work from a Linear issue agreed with the maintainer. If you do
not have access to the workspace, coordinate the scope with the maintainer
before opening a pull request.

Report security concerns privately by following [SECURITY.md](SECURITY.md).

## Local setup

Use Node.js 24 and the pnpm version declared in `package.json`:

```bash
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
```

The complete frontend and backend setup is documented in [README.md](README.md).

## Development workflow

1. Create a focused branch from the latest `main`.
2. Keep generated `src/routeTree.gen.ts` and OpenAPI types in sync with their
   source files; do not edit them manually.
3. Add or update tests for behavior changes.
4. Run the complete local gate:

   ```bash
   pnpm release:check
   ```

5. Open a pull request, include the Linear issue identifier, and describe the
   user-visible impact and verification performed.

Pull requests are squash-merged after the required `Quality` check passes.
