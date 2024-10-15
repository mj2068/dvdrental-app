<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <a-space style="padding-inline-start: 1rem">
    <template v-slot:split>
      <a-divider type="vertical" />
    </template>
    <router-link to="/" :class="{ active: route.path === '/' }">
      Home
    </router-link>
    <router-link to="/film" :class="{ active: route.path.startsWith('/film') }">
      Film
    </router-link>
    <router-link
      to="/actor"
      :class="{ active: route.path.startsWith('/actor') }"
    >
      Actor / Actress
    </router-link>
    <router-link
      to="/rental"
      :class="{ active: route.path.startsWith('/rental') }"
    >
      Rental
    </router-link>
  </a-space>
</template>

<style scoped>
.active {
  color: #1890ff; /* Ant Design's primary color */
  font-weight: bold;
}
</style>
