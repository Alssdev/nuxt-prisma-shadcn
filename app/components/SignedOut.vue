<template>
  <ClientOnly>
    <slot v-if="!isPending && !user" />
  </ClientOnly>
</template>

<script setup lang="ts">
const { user, isPending } = await useSession();
</script>
