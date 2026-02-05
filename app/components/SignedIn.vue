<script setup lang="ts">
const { useSession } = useAuth();
const { data: session } = await useSession();
</script>

<template>
  <slot v-if="session?.user" :user="session.user" />
</template>
