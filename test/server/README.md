# Server Integration Tests

## Rules

- Environment: `node` (not `nuxt`) in vitest config
- Call `setup()` at **module level** using top-level `await` — never inside `beforeAll`
- Use `fetch` from `@nuxt/test-utils/e2e` (not global `fetch`) — it prepends the server URL automatically
- Import Prisma with relative path `../../generated/prisma/client.js` — the `~~` alias does not resolve in node environment
- Tests run sequentially within a file — later tests can depend on state from earlier ones
- One `describe` per endpoint or feature group
- Use auth helpers from `./utils` — never call auth endpoints directly in test files

## Auth Utilities (`./utils.ts`)

| Function | Returns | Purpose |
|---|---|---|
| `signUp(user?)` | `{ res, body }` | Register a new user |
| `signIn(email?, password?)` | `{ res, body }` | Sign in, returns raw response |
| `getSessionCookie(email?, password?)` | `string` | Sign in and extract cookie (throws on failure) |
| `getSession(cookie)` | `{ res, body }` | Fetch session data with cookie |
| `TEST_USER` | `{ name, email, password }` | Default test user credentials |

## Constraints

- Better Auth enforces **rate limiting** on `/api/auth/sign-in/email`
- Sign in **once** at module level via `getSessionCookie()`, reuse across all tests
- `GET /api/auth/get-session` returns `null` (not `{}`) when no session cookie is provided
- All auth providers (email, OAuth) produce the same session cookie format

## Template

```ts
import { describe, it, expect, afterAll } from 'vitest';
import { setup, fetch } from '@nuxt/test-utils/e2e';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { TEST_USER, signUp, getSessionCookie } from './utils';

// 1. Setup server (must be top-level await)
await setup({
  server: true,
  dotenv: { fileName: '.env.test' },
  setupTimeout: 60_000,
});

// 2. Create Prisma client for cleanup
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

// 3. Ensure test user exists and get session cookie
await signUp();
const sessionCookie = await getSessionCookie();

// 4. Cleanup after all tests
afterAll(async () => {
  // Delete in order: dependents first, then parents
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  // Add cleanup for feature-specific tables here
  await prisma.$disconnect();
});

// 5. Tests
describe('Feature Name', () => {
  it('does something with auth', async () => {
    const res = await fetch('/api/your-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: sessionCookie,
      },
      body: JSON.stringify({ key: 'value' }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toBeDefined();
  });

  it('rejects unauthenticated requests', async () => {
    const res = await fetch('/api/your-endpoint');
    expect(res.status).not.toBe(200);
  });
});
```

## Prerequisites

Before running tests, ensure:

1. `.env.test` exists at project root with `DATABASE_URL`, `NUXT_PUBLIC_APP_URL`, `BETTER_AUTH_SECRET`
2. Test database has migrations applied: `DATABASE_URL="..." npx prisma migrate deploy`

## Commands

```bash
npm run test:server        # run all server tests
npm run test:server -- --run  # run once (no watch)
```

## File naming

Place files in `test/server/` with the pattern `<feature>.test.ts`. They are auto-discovered by the `server` vitest project.
