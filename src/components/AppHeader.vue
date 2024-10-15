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
    <a-flex class="header-container" align="center" justify="space-between">
      <router-link :to="{ name: 'home' }">
        <a-flex align="end" gap="8" class="header-title">
          <IconCrystalBall />
          Rental Manager (Demo)
        </a-flex>
      </router-link>
      <a-flex gap="8" class="placeholder-buttons">
        <div class="placeholder-button"></div>
        <div class="placeholder-button"></div>
        <div class="placeholder-button"></div>
      </a-flex>
    </a-flex>
    <NavBar v-if="showNavBar" />
  </header>
</template>

<style scoped>
header {
  margin-bottom: 1rem;
}

.header-container {
  height: 4.5rem;
  background-color: #213855; /* A modern, professional dark blue */
  margin-bottom: 1rem;
  padding-inline: 1rem;
  border-radius: 0 0 16px 16px;
}

.header-title {
  font-size: 2rem;
  font-weight: 600;
  color: #ecf0f1;
}

.placeholder-button {
  width: 2.5rem;
  height: 2.5rem;
  background-color: #3a4c5e;
  border-radius: 0.25rem;
}
</style>
