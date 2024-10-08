<script setup lang="ts">
const props = defineProps<{
  items: { key: string; label: string | number }[];
  title: string;
}>();
</script>

<template>
  <a-flex vertical align="center">
    <p class="title">{{ props.title }}</p>
    <ul>
      <li v-for="item in props.items" :key="item.key" class="list-item">
        <span class="content">{{ item.label }}</span>
      </li>
    </ul>
  </a-flex>
</template>

<style scoped>
.title {
  font-size: 1.5rem;
}
</style>
