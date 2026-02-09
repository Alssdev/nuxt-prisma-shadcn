import { fetch } from '@nuxt/test-utils/e2e';

export const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!',
};

export async function signUp(user = TEST_USER) {
  const res = await fetch('/api/auth/sign-up/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return { res, body: await res.json() };
}

export async function signIn(email = TEST_USER.email, password = TEST_USER.password) {
  const res = await fetch('/api/auth/sign-in/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return { res, body: await res.json() };
}

export async function getSessionCookie(email = TEST_USER.email, password = TEST_USER.password) {
  const { res } = await signIn(email, password);
  if (res.status !== 200) {
    throw new Error(`Sign-in failed with status ${res.status}`);
  }
  return res.headers.get('set-cookie') ?? '';
}

export async function getSession(cookie: string) {
  const res = await fetch('/api/auth/get-session', {
    headers: { cookie },
  });
  return { res, body: await res.json() };
}
