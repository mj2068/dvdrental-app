<script setup lang="ts">
import wechatQr from "@/assets/wechat_qr.png";
import IconEmail from "~icons/mdi/email";

// const wechatQr = new URL("@/assets/wechat_qr.png", import.meta.url).href;
</script>

<template lang="pug">
footer
  a-flex(vertical, align="center")
    p.gray-text 示例项目，仅作页面功能性展示。来源数据库为模拟数据，不完全保证数据逻辑准确性。
    div(style="padding: 2px; background-color: white; border-radius: 4px")
      a-image(:src="wechatQr", style="width: 96px")
    a-flex.gray-text(align="center", gap="2")
      IconEmail
      a.gray-text(href="mailto:yuelianghushenfu@sina.com").
        yuelianghushenfu@sina.com
    span(style="margin-block: 0.5rem")
      a.gray-text(href="https://zizaimai.space/demo", target="_blank").
        zizaimai.space
    span
      a.gray-text(href="http://beian.miit.gov.cn/", target="_blank").
        鲁ICP备2022041953号-1
</template>

<style scoped>
footer {
  margin-top: 8rem;
  padding-top: 4rem;
  padding-bottom: 4px;
  padding-inline: 2rem;
  background-color: rgb(236, 236, 236);
  border-radius: 16px 16px 0 0;
  max-width: 800px;
  width: 100%;
}
</style>
<!-- <template> -->
<!--   <a-divider></a-divider> -->
<!--   <a-image :src="wechatQrImageUrl" style="width: 96px"></a-image> -->
<!-- </template> -->
