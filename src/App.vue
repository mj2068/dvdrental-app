<script setup lang="ts">
import AppFooter from "./components/AppFooter.vue";
import AppHeader from "./components/AppHeader.vue";
import useGlobalStore from "@/stores/global";

const route = useRoute();

const { setIsMinWidth768Px, setIsMinWidth425Px } = useGlobalStore();

const minWidth768PxMedia = matchMedia("(min-width: 768px)");
const minWidth425PxMedia = matchMedia("(min-width: 425px)");

function onMinWidthMediaChange(this: MediaQueryList, e: MediaQueryListEvent) {
  if (this === minWidth768PxMedia) setIsMinWidth768Px(e.matches);
  if (this === minWidth425PxMedia) setIsMinWidth425Px(e.matches);
}

onMounted(() => {
  minWidth768PxMedia.addEventListener("change", onMinWidthMediaChange);
  minWidth425PxMedia.addEventListener("change", onMinWidthMediaChange);
});

onUnmounted(() => {
  minWidth768PxMedia.removeEventListener("change", onMinWidthMediaChange);
  minWidth425PxMedia.removeEventListener("change", onMinWidthMediaChange);
});
</script>

<template>
  <div style="width: 100%">
    <AppHeader :show-nav-bar="'home' !== route.name" />
    <main style="margin-inline: 0.5rem">
      <RouterView />
    </main>
  </div>
  <AppFooter />
</template>

<style scoped></style>

<style src="@/App.css" />
