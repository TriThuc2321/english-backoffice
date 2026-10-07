# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start the React Router dev server (HTTPS on `backoffice.myenglish.com:5173` if the `.pem` files are present at the repo root, otherwise plain HTTP).
- `pnpm build` — production build via `react-router build` (output in `build/`).
- `pnpm preview` — preview the built client.
- `pnpm typecheck` — runs `react-router typegen` then `tsc -b`. Always run after route file changes (typegen produces types consumed by `tsconfig`).
- `pnpm lint` — `oxlint && oxfmt && typecheck`. Use `pnpm lint:check` (non-mutating) and `pnpm fmt` / `pnpm fmt:check` for formatting only.
- Husky + lint-staged + commitlint (`@commitlint/config-conventional`) are wired via `pnpm prepare`. Commit messages must follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:` …).

Package manager is **pnpm** (see `pnpm-lock.yaml`).

## Architecture

This is a **client-only SPA** (`ssr: false` in `react-router.config.ts`) for the MyEnglish back-office, built on React Router v7 in framework mode with Vite.

### Routing — file-based via `flatRoutes`

`src/routes.ts` delegates to `@react-router/fs-routes`'s `flatRoutes({ rootDirectory: 'pages' })`, so **every route lives in `src/pages/` and uses flat-route filename conventions**:

- `_auth.*` and `_main.*` are pathless layout segments (`_auth.tsx`, `_main.tsx` are the layouts; `_auth.login.tsx` renders inside `_auth`).
- `$id` is a dynamic param; `_index` is the index route under a parent.
- A resource module typically has 5 files: list (`_main.foo._index.tsx`), wrapper (`_main.foo.tsx`), create (`_main.foo.create.tsx`), and detail/edit nested under `_main.foo.$id.*`.

Whenever route files change, regenerate types with `pnpm typegen` (or just `pnpm typecheck`).

### Data layer

- **HTTP**: a single `axios` instance in `src/services/axios-instance.ts` with `baseURL = ${ENV.API_URL}/api`, `withCredentials: true`, and a response interceptor that unwraps `response.data` and rejects with `error.response.data`.
- **API modules**: per-resource files in `src/services/apis/` (e.g. `user.ts`, `role.ts`, `passage.ts`).
- **React Query** is the cache/server-state layer; hooks for each resource live in `src/hooks/apis/<resource>/`. `ReactQueryProvider` is mounted in `src/root.tsx`.
- **Forms**: `react-hook-form` + `yup` (via `@hookform/resolvers`); shared form orchestration lives in `src/hooks/forms/` (e.g. `useCreateEditUser.tsx`).

### Authorization (CASL)

- `src/configs/casl/permissions.config.tsx` builds a `MongoAbility` from a list of `{ action, subject }` permissions attached to the logged-in user's role.
- `AccessProvider` (`src/providers/accessProvider.provider.tsx`) takes the current `profile` and feeds the ability into `AbilityContext`.
- Use the `<Can I="..." a="...">` component or the `useCan()` hook from `src/configs/casl/can.config.tsx` for permission gating. Permissions are typed in `src/types/role.ts`.

### UI / styling

- **HeroUI v3** (`@heroui/react`, `@heroui/styles`) is the component library, paired with **Tailwind CSS v4** via `@tailwindcss/vite`.
- `ThemeProvider` and `LocaleProvider` (i18next) wrap the app in `src/root.tsx`; toasts come from HeroUI's `Toast`.
- Shared primitives live in `src/components/shared/` (notably `table/TanstackTable.tsx`, which is the project-wide table built on `@tanstack/react-table`). Per-feature components live alongside their pages under `src/components/<feature>/`.

### Path alias

`@/*` → `src/*` (configured in both `vite.config.ts` and `tsconfig`). Always import via `@/...` rather than relative paths across feature boundaries.

### Dev server quirks

`vite.config.ts` includes a `stub-well-known` middleware that 204s any `/.well-known/*` request to silence Chrome DevTools probes. HTTPS is enabled automatically when the two `backoffice.myenglish.com*.pem` files exist at the repo root.
