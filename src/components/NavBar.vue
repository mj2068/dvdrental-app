<script setup lang="ts"></script>

<template>
  <a-space>
    <template v-slot:split>
      <a-divider type="vertical" />
    </template>
    <router-link to="/film">Film</router-link>
    <router-link to="/actor">Actor</router-link>
    <router-link to="/rental">Rental</router-link>
  </a-space>
</template>
