<template>
  <client-only>
    <slot v-if="!session?.user" />
  </client-only>
</template>

<script setup lang="ts">
const session = await useSession();
</script>
