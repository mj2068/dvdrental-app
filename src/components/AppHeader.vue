<script>
export default {
  props: {
    showNavBar: { default: true },
  },
  data: () => ({}),
  setup: () => {
    return {};
  },
};
</script>

<template>
  <header>
    <a-flex
      style="
        height: 64px;
        background-color: #edf9fb;
        margin-bottom: 0.5rem;
        padding-inline-start: 1rem;
      "
      align="center"
    >
      <h1 style="margin-block: 0">
        <router-link :to="{ name: 'home' }" style="color: darkblue">
          Rental Manager (Demo)
        </router-link>
      </h1>
    </a-flex>
    <NavBar v-if="showNavBar" />
  </header>
</template>

<style scoped>
header {
  margin-bottom: 1rem;
}
</style>
