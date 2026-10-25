# E2E tests (Playwright)

Two modes, two Playwright projects:

| Command         | Project | Backend                         | Runs in CI |
| --------------- | ------- | ------------------------------- | ---------- |
| `pnpm e2e`      | `mock`  | `page.route()` mocks in `mock/` | yes        |
| `pnpm e2e:real` | `real`  | a local `english-service`       | no         |

`pnpm e2e:ui` opens the Playwright UI and starts the mock server. For the real project, run
`E2E_REAL=1 pnpm e2e:ui` so it skips the mock server.

## Mock mode

`pnpm e2e` starts its own dev server on `http://localhost:5174` with `E2E=1` (plain HTTP, every
dependency pre-bundled) and `VITE_API_URL` pointing at the same origin. Every `/api/*` call goes
through the `api` fixture in `fixtures/api.ts`:

- `api.loginAs(permissions)` serves a valid refresh and a profile whose role has `permissions`.
  Without it the visitor is logged out (refresh and profile return 401).
- `api.on('GET', '/users/:id', handler)` adds or overrides a route. Later calls win.
- `api.calls('POST', '/users')` returns the captured requests, to assert on query and body.

An unmocked call returns 404 and logs `[e2e] unmocked request: ...`.

## Real mode

Needs the real stack running and a CMS user with a password:

1. In `../english-service`: `docker compose up -d` (Postgres), then start the API.
2. Here: `pnpm dev` (HTTPS on `https://backoffice.myenglish.com:5173`).
3. Run:

   ```sh
   E2E_EMAIL=admin@example.com E2E_PASSWORD=... pnpm e2e:real
   ```

| Variable       | Default                                 |
| -------------- | --------------------------------------- |
| `E2E_EMAIL`    | none: real tests skip without it        |
| `E2E_PASSWORD` | none: real tests skip without it        |
| `E2E_API_URL`  | `https://api.myenglish.com:8080`        |
| `E2E_BASE_URL` | `https://backoffice.myenglish.com:5173` |

The user's role must have `canAccessCms` and permission to manage users.

Each test logs in with its own session (`fixtures/real.ts`). The backend rotates refresh tokens
and revokes every session of a user that replays a stale one, so tests must not share a saved
`storageState`. The login endpoint is throttled to 10 calls per minute, so keep the real suite
small and navigate in-app instead of reloading.

`smoke.spec.ts` only reads. `users-crud.spec.ts` creates `e2e+<timestamp>@example.com`, edits it,
and deletes it through the API in `afterEach`, even when the test fails.
