<script setup lang="ts">
import AppFooter from "./components/AppFooter.vue";
import AppHeader from "./components/AppHeader.vue";
import useGlobalStore from "@/stores/global";

const route = useRoute();

const { setIsMinWidth768Px } = useGlobalStore();

const minWidth768PxMedia = matchMedia("(min-width: 768px)");

function onMinWidthMediaChange(this: MediaQueryList, e: MediaQueryListEvent) {
  setIsMinWidth768Px(e.matches);
}

onMounted(() => {
  minWidth768PxMedia.addEventListener("change", onMinWidthMediaChange);
});

onUnmounted(() => {
  minWidth768PxMedia.removeEventListener("change", onMinWidthMediaChange);
});
</script>

<template>
  <div>
    <AppHeader :show-nav-bar="'home' !== route.name" />
    <main style="margin-inline: 0.5rem">
      <RouterView />
    </main>
  </div>
  <AppFooter />
</template>

<style scoped></style>

<style src="@/App.css" />
