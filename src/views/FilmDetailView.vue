<template>
  <div></div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { useRequest } from 'vue-request';

/** ************ types ************ */

// props from route(props: true)
const props = defineProps<{
  id: string;
}>();

console.log(props.id);
</script>
