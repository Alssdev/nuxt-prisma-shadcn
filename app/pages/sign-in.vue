<script setup lang="ts">
const { signIn, useSession } = useAuth();
const router = useRouter();
const { data: session } = await useSession();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

// Redirect if already signed in
watch(() => session.value?.user, (user) => {
  if (user) {
    router.push('/');
  }
}, { immediate: true });

async function handleSubmit() {
  error.value = '';
  loading.value = true;

  try {
    const result = await signIn(email.value, password.value);
    if (result.error) {
      error.value = result.error.message || 'Sign in failed';
    } else {
      router.push('/');
    }
  } catch {
    error.value = 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8">
      <div class="space-y-2 text-center">
        <h1 class="text-2xl font-bold tracking-tight">Sign In</h1>
        <p class="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label for="email" class="text-sm font-medium leading-none">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
        </div>

        <div class="space-y-2">
          <label for="password" class="text-sm font-medium leading-none">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
        </div>

        <div v-if="error" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="text-center text-sm">
        <span class="text-muted-foreground">Don't have an account? </span>
        <NuxtLink to="/sign-up" class="font-medium text-primary hover:underline">
          Sign up
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
