<script setup lang="ts">
export interface ListItem {
  key: string;
  label: string;
  content: string | number;
}

const props = defineProps<{
  items: ListItem[];
  title?: string;
}>();
</script>

<template>
  <a-flex class="aligned-list" vertical align="center">
    <a-flex class="title" gap="small" align="center">
      <slot name="icon"></slot>
      {{ props.title }}
    </a-flex>
    <a-flex vertical justify="center" style="flex-grow: 1; width: 100%">
      <ul style="width: 100%; padding: 0; margin-bottom: 0">
        <li v-for="item in props.items" :key="item.key" class="list-item">
          <span class="label">
            <slot name="label" :item="item">{{ item.label }}</slot>
          </span>
          <span class="separator" style="min-width: 1rem"></span>
          <span class="content">{{ item.content }}</span>
        </li>
      </ul>
    </a-flex>
  </a-flex>
</template>

<style scoped>
.aligned-list {
  width: 100%;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
}

.list-item {
  display: flex;
  justify-content: space-between; /* Aligns label to the left and content to the right */
  padding: 8px 0; /* Adds some vertical spacing */
  border-bottom: 1px solid #ccc; /* Optional: adds a bottom border for separation */
  width: 100%;
}

.label {
  text-align: left; /* Ensures label is left-aligned */
}

.content {
  text-align: right; /* Ensures content is right-aligned */
}
</style>
