<script setup lang="ts">
const props = defineProps<{ to: string }>();
</script>

<template>
  <router-link :to="props.to">
    <slot />
  </router-link>
</template>
