<template>
  <ClientOnly>
    <slot v-if="!isPending && user" :user="user" />
  </ClientOnly>
</template>

<script setup lang="ts">
const { user, isPending } = await useSession();
</script>
