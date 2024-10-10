<script>
import IconCrystalBall from "~icons/mdi/crystal-ball";
export default {
  components: {
    IconCrystalBall,
  },
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
        height: 4.8rem;
        background-color: #edf9fb;
        margin-bottom: 0.5rem;
        padding-inline-start: 1rem;
      "
      align="center"
    >
      <router-link :to="{ name: 'home' }">
        <a-flex align="end" gap="8" style="font-size: 2rem; font-weight: 600; color: darkblue">
          <IconCrystalBall />
            Rental Manager (Demo)
          </a-flex>
      </router-link>
    </a-flex>
    <NavBar v-if="showNavBar" />
  </header>
</template>

<style scoped>
header {
  margin-bottom: 1rem;
}
</style>
