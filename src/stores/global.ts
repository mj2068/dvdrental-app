export default defineStore("globalStore", () => {
  const isMinWidth768Px = ref(matchMedia("(min-width: 768px)").matches);

  function setIsMinWidth768Px(value: boolean) {
    isMinWidth768Px.value = value;
  }

  return { isMinWidth768Px, setIsMinWidth768Px };
});
