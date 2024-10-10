<script setup lang="ts">
import wechatQr from "@/assets/wechat_qr.png";

// const wechatQr = new URL("@/assets/wechat_qr.png", import.meta.url).href;
</script>

<template lang="pug">
footer(
  :style="{ 'margin-top': '6rem', 'padding-top': '4rem', 'padding-bottom': '4px', 'background-color': 'lightgray' }"
)
  a-flex(vertical, align="center")
    p.gray-text 示例项目，仅作页面功能性展示。来源数据库为模拟数据，不完全保证数据逻辑准确性。
    div(style="padding: 2px; background-color: white; border-radius: 4px")
      a-image(:src="wechatQr", style="width: 96px")
    span 邮箱：
      a.gray-text(href="mailto:yuelianghushenfu@sina.com").
        yuelianghushenfu@sina.com
    span(style="margin-block: 0.5rem")
      a.gray-text(href="https://zizaimai.space/demo", target="_blank").
        zizaimai.space
    span
      a.gray-text(href="http://beian.miit.gov.cn/", target="_blank").
        鲁ICP备2022041953号-1
</template>

<!-- <template> -->
<!--   <a-divider></a-divider> -->
<!--   <a-image :src="wechatQrImageUrl" style="width: 96px"></a-image> -->
<!-- </template> -->
