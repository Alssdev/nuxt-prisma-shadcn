<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>

  <!-- To use custom colors, remove `richColors` prop -->
  <Toaster position="top-right" :closeButton="true" richColors />
</template>
<script setup lang="ts">
import { Toaster } from './components/ui/sonner';
</script>
