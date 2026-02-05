<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8 text-center">
      <SignedOut>
        <div class="space-y-4">
          <h1 class="text-2xl font-bold tracking-tight">Welcome</h1>
          <p class="text-sm text-muted-foreground">
            Sign in to your account or create a new one
          </p>
          <div class="flex gap-4">
            <NuxtLink
              to="/sign-in"
              class="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/sign-up"
              class="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Sign Up
            </NuxtLink>
          </div>
        </div>
      </SignedOut>

      <SignedIn v-slot="{ user }">
        <div class="space-y-4">
          <h1 class="text-2xl font-bold tracking-tight">
            Hello, {{ user.name }}!
          </h1>
          <p class="text-sm text-muted-foreground">
            {{ user.email }}
          </p>
          <button
            :disabled="loading"
            class="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            @click="handleSignOut"
          >
            {{ loading ? 'Signing out...' : 'Sign Out' }}
          </button>
        </div>
      </SignedIn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authClient } from '~/lib/auth-client';

const loading = ref(false);

async function handleSignOut() {
  loading.value = true;
  try {
    await authClient.signOut();
  } finally {
    loading.value = false;
  }
}
</script>
