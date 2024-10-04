<script>
export default {
  props: [],
  data: () => ({}),
  setup: () => {
    return {};
  },
};
</script>

<template>
  <header>
    <h1><router-link :to="{ name: 'home' }">Rental Manager</router-link></h1>
    <NavBar />
  </header>
</template>

<style scoped>
header {
  margin-bottom: 1rem;
}
</style>
