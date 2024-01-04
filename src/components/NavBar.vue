<script setup lang="ts"></script>

<template>
  <a-space>
    <template v-slot:split>
      <a-divider type="vertical" />
    </template>
    <router-link to="/film">film</router-link>
    <router-link to="/actor">actor</router-link>
    <router-link to="/rental">rental</router-link>
  </a-space>
</template>
