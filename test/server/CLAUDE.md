# Server Integration Tests

## Writing tests

- `setup()` must be called at **module level** with top-level `await` — never inside `beforeAll`
- `setup()` registers a `beforeAll` internally — the server is **not** running until the first test executes
- **Do not call `fetch`-based helpers (e.g. `signUp`, `getSessionCookie`) at module level** — they will fail because the server isn't up yet. Put them in a `beforeAll` block instead
- Use `fetch` from `@nuxt/test-utils/e2e` — not global `fetch`
- Tests run sequentially within a file — later tests can depend on state from earlier ones
- **Test files run in parallel** — do not rely on execution order between files
- One `describe` per endpoint or feature group
- Place files in `test/server/` with the pattern `<feature>.test.ts`

## Auth

- All test files share a single `TEST_USER` (`test@example.com`)
- Call `signUp()` then `getSessionCookie()` in `beforeAll`, reuse the cookie across all tests
- `signUp()` tolerates duplicate emails (422) — safe to call from every test file
- Better Auth has rate limiting — do not sign in multiple times
- Do **not** call auth endpoints directly — use helpers from `./utils`

### Auth utilities (`./utils.ts`)

| Export | Returns | Purpose |
|---|---|---|
| `TEST_USER` | `{ name, email, password }` | Shared test user credentials |
| `signUp()` | `{ res, body }` | Register test user (tolerates 422) |
| `getSessionCookie()` | `string` | Sign in and extract session cookie |

## Cleanup

- `global-setup.ts` truncates all tables before the test suite runs — no per-file `afterAll` needed
- Do **not** add `afterAll` cleanup or Prisma imports in test files
- When adding new Prisma models, update `global-setup.ts` to truncate the new table (dependents before parents)

## Response gotchas

- Zod validation errors return **400**, not 422 — only explicit `createError({ statusCode: 422 })` returns 422
- Prisma `Decimal` fields are serialized as strings with fixed decimals (e.g. `'1000.00'`, not `'1000'`)
- Use `readValidatedBody` in server endpoints for Zod validation — raw `readBody` + `.parse()` returns 500 instead of 400

## Template

```ts
import { describe, it, expect, beforeAll } from 'vitest';
import { setup, fetch } from '@nuxt/test-utils/e2e';
import { signUp, getSessionCookie } from './utils';

await setup({
  server: true,
  dotenv: { fileName: '.env.test' },
  setupTimeout: 60_000,
});

let sessionCookie = '';

const headers = (extra: Record<string, string> = {}) => ({
  'Content-Type': 'application/json',
  cookie: sessionCookie,
  ...extra,
});

beforeAll(async () => {
  await signUp();
  sessionCookie = await getSessionCookie();
});

describe('Feature Name', () => {
  it('does something with auth', async () => {
    const res = await fetch('/api/your-endpoint', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ key: 'value' }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toBeDefined();
  });

  it('rejects unauthenticated requests', async () => {
    const res = await fetch('/api/your-endpoint');
    expect(res.status).toBe(401);
  });
});
```

## Prerequisites

1. `.env.test` exists at project root with `DATABASE_URL`, `NUXT_PUBLIC_APP_URL`, `BETTER_AUTH_SECRET`
2. Test database has migrations applied: `DATABASE_URL="..." npx prisma migrate deploy`

## Running

```bash
npm run test:server           # watch mode
npm run test:server -- --run  # single run
```
