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
      class="header-container"
      align="center"
      justify="space-between"
    >
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
  height: 3.8rem;
  background-color: #2c3e50; /* A modern, professional dark blue */
  margin-bottom: 0.5rem;
  padding-inline: 1rem;
}

.header-title {
  font-size: 2rem;
  font-weight: 600;
  color: #ecf0f1;
}

.placeholder-buttons {
  
}

.placeholder-button {
  width: 2.5rem;
  height: 2.5rem;
  background-color: #34495e;
  border-radius: 0.25rem;
}
</style>
