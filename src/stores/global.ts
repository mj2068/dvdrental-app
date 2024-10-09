export default defineStore("globalStore", () => {
  const isMinWidth768Px = ref(matchMedia("(min-width: 768px)").matches);
  const isMinWidth425Px = ref(matchMedia("(min-width: 425px)").matches);

  function setIsMinWidth768Px(value: boolean) {
    isMinWidth768Px.value = value;
  }

  function setIsMinWidth425Px(value: boolean) {
    isMinWidth425Px.value = value;
  }

  return {
    isMinWidth768Px,
    isMinWidth425Px,
    setIsMinWidth768Px,
    setIsMinWidth425Px,
  };
});
