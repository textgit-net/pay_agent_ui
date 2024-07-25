<script setup lang="ts">

import IconTextWidget from "~/pages/designer/components/widget-container/icons/icon-text-widget.vue";
</script>

<template>
<div class="layout-widget">
  <span class="widget fl ">
        <span  class="icon-container" >
          <IconTextWidget :height="25" :width="24" color="#666"/>
        </span>
    <label>文本</label>
  </span>
  <span class="widget fl ">
        <span  class="icon-container" >
          <IconTextWidget :height="25" :width="24" color="#666"/>
        </span>
    <label>文本</label>
  </span>
  <span class="widget fl ">
        <span  class="icon-container" >
          <IconTextWidget :height="25" :width="24" color="#666"/>
        </span>
    <label>文本</label>
  </span>
  <span class="widget fl ">
        <span  class="icon-container" >
          <IconTextWidget :height="25" :width="24" color="#666"/>
        </span>
    <label>文本</label>
  </span>
  <span class="widget fl ">
        <span  class="icon-container" >
          <IconTextWidget :height="25" :width="24" color="#666"/>
        </span>
    <label>文本</label>
  </span>
  <span class="widget fl ">
        <span  class="icon-container" >
          <IconTextWidget :height="25" :width="24" color="#666"/>
        </span>
    <label>文本</label>
  </span>
</div>
</template>

<style scoped lang="less">
label,span{
  user-select: none;
}
.layout-widget{
  display: flex;
  flex-wrap: wrap;
}
.layout-widget .widget{
  height: 90px;
  font-size: 12px;
}
</style>