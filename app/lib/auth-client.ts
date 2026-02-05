import { createAuthClient } from 'better-auth/vue';

export const authClient = createAuthClient({
  baseURL: import.meta.env.NUXT_PUBLIC_APP_URL || '',
});
