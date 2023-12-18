<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
console.log(route.params.id);
</script>

<template>
  actress/actor detail page
  <router-link to="/actor">actor</router-link>
</template>
