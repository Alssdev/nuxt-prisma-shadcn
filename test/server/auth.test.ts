import { describe, it, expect, afterAll } from 'vitest';
import { setup, fetch } from '@nuxt/test-utils/e2e';
import { PrismaClient } from '../../generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!',
};

let sessionCookie = '';

await setup({
  server: true,
  dotenv: { fileName: '.env.test' },
  setupTimeout: 60_000,
});

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

afterAll(async () => {
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Auth API', () => {
  describe('POST /api/auth/sign-up/email', () => {
    it('creates a new user and returns user data', async () => {
      const res = await fetch('/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_USER),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe(TEST_USER.email);
      expect(body.user.name).toBe(TEST_USER.name);
    });

    it('returns error for duplicate email', async () => {
      const res = await fetch('/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_USER),
      });

      expect(res.status).not.toBe(200);
    });

    it('returns error for missing required fields', async () => {
      const res = await fetch('/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'incomplete@example.com' }),
      });

      expect(res.status).not.toBe(200);
    });
  });

  describe('POST /api/auth/sign-in/email', () => {
    it('signs in with valid credentials and returns session cookie', async () => {
      const res = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USER.email,
          password: TEST_USER.password,
        }),
      });

      expect(res.status).toBe(200);
      const cookies = res.headers.get('set-cookie');
      expect(cookies).toBeTruthy();
      sessionCookie = cookies!;
      const body = await res.json();
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe(TEST_USER.email);
    });

    it('returns error for wrong password', async () => {
      const res = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USER.email,
          password: 'WrongPassword!',
        }),
      });

      expect(res.status).not.toBe(200);
    });

    it('returns error for non-existent email', async () => {
      const res = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        }),
      });

      expect(res.status).not.toBe(200);
    });
  });

  describe('GET /api/auth/get-session', () => {
    it('returns user session when valid cookie is provided', async () => {
      const res = await fetch('/api/auth/get-session', {
        headers: { cookie: sessionCookie },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe(TEST_USER.email);
    });

    it('returns null when no cookie is provided', async () => {
      const res = await fetch('/api/auth/get-session');

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toBeNull();
    });
  });
});
