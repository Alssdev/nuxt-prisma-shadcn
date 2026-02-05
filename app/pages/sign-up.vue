<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8">
      <div class="space-y-2 text-center">
        <h1 class="text-2xl font-bold tracking-tight">Create an Account</h1>
        <p class="text-sm text-muted-foreground">
          Enter your details to get started
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label for="name" class="text-sm font-medium leading-none">
            Name
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            placeholder="Your name"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
        </div>

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
            placeholder="At least 8 characters"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
        </div>

        <div class="space-y-2">
          <label for="confirmPassword" class="text-sm font-medium leading-none">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="Repeat your password"
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
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <div class="text-center text-sm">
        <span class="text-muted-foreground">Already have an account? </span>
        <NuxtLink to="/sign-in" class="font-medium text-primary hover:underline">
          Sign in
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authClient } from '~/lib/auth-client';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const loading = ref(false);

async function handleSubmit() {
  error.value = '';

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters';
    return;
  }

  loading.value = true;

  try {
    const { error: signUpError } = await authClient.signUp.email({
      email: email.value,
      password: password.value,
      name: name.value,
    });
    if (signUpError) {
      error.value = signUpError.message || 'Sign up failed';
    } else {
      await navigateTo('/');
    }
  } catch {
    error.value = 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
}
</script>
