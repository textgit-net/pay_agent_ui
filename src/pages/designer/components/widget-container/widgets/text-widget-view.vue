<script setup lang="ts">
import {CSSProperties, PropType} from "vue";
import {StyleAlignment, TextComponent} from "~/pages/designer/types/types.ts";

const props = defineProps({
  value:{
    type:Object as PropType<TextComponent>,
    required:true
  },
})

const style=computed(()=>{
  let textAlign="left";
  switch (props.value.style.textAlignment){
    case StyleAlignment.CENTER:
          textAlign="center"
          break
    case StyleAlignment.CENTER_LEFT:
          textAlign="left"
          break
    case StyleAlignment.CENTER_RIGHT:
          textAlign="right"
          break
  }
  return{
    "color":props.value.fontColor,
    "line-height":`${props.value.style.height}px`,
    "font-size":`${props.value.style.fontSize}px`,
    "text-align":textAlign
  }
})
</script>

<template>
  <div class="ele-content element text" style="margin-top: 0px; margin-left: auto; margin-right: auto; background-color: rgb(255, 255, 255); border-style: none; border-color: rgb(34, 34, 34); border-width: 2px;">
    <div class="inner-content " :style="style">
      {{ value.content }}
    </div>
  </div>
</template>

<style scoped lang="less">

</style>