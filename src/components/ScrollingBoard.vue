<template>
  <a-flex vertical align="center" class="container">
    <span v-if="title" class="title">{{ title }}</span>
    <div class="marquee-container">
      <a-flex vertical gap="16" class="marquee">
        <a-flex v-for="i in 2" :key="i" vertical gap="16">
          <div v-for="(item, index) in texts" :key="index">
            <slot name="item" :item="item" :index="index">{{ item }}</slot>
          </div>
        </a-flex>
      </a-flex>
    </div>
  </a-flex>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    texts: string[];
    speed?: number;
    title?: string;
  }>(),
  { speed: 40 },
);
</script>

<style scoped>
.container {
  width: 100%;
}
.marquee-container {
  overflow: hidden;
  /* border: 1px solid #ccc; */
  padding-inline: 0.5rem;
  width: 100%;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  width: 100%;
  text-align: center;
  box-shadow: 0px 4px 4px -4px #bbb;
  padding-bottom: 0.5rem;
  z-index: 0;
}

.marquee {
  animation: scroll v-bind("speed+'s'") linear infinite;
}

.marquee:hover {
  animation-play-state: paused; /* Pause the animation on hover */
}

@keyframes scroll {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(calc(-50% - 8px));
  }
}
</style>
