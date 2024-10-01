<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["min", "max"],
  data: () => ({}),
  emits: ["update:min", "update:max"],
});
</script>

<template>
  <a-input-group compact style="display: flex">
    <a-input :value="min" @update:value="$emit('update:min', $event)" />
    <a-input
      placeholder="~"
      disabled
      style="pointer-events: none; text-align: center; width: 2rem"
      class="no-shrink"
    />
    <a-input :value="max" @update:value="$emit('update:max', $event)" />
  </a-input-group>
</template>
