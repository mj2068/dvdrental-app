<script setup lang="ts">
import { RouterView } from "vue-router";
import AppFooter from "./components/AppFooter.vue";
import AppHeader from "./components/AppHeader.vue";
</script>

<template>
  <div>
    <AppHeader />
    <main style="margin-inline: 0.5rem">
      <RouterView />
    </main>
  </div>
  <AppFooter />
</template>

<style scoped></style>

<style src="@/App.css" />
