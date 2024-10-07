<script setup lang="ts"></script>

<template>
  <a-space style="padding-inline-start: 1rem">
    <template v-slot:split>
      <a-divider type="vertical" />
    </template>
    <router-link to="/">Home</router-link>
    <router-link to="/film">Film</router-link>
    <router-link to="/actor">Actor / Actress</router-link>
    <router-link to="/rental">Rental</router-link>
  </a-space>
</template>
