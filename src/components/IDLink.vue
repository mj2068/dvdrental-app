<script setup lang="ts">
const props = defineProps<{ to: string }>();

console.log(props);
</script>

<template lang="pug">
router-link(:to="`${props.to}`")
  slot
</template>
