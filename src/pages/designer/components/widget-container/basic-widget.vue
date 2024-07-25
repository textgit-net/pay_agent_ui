<script setup lang="ts">
import {basicWidgets, ImageComponent, TextComponent, WidgetType} from "../../types/types.ts";
import WidgetDraggable from "./widgets/widget-draggable.vue";
import draggable from 'vuedraggable'


const onClone=(e:WidgetType)=>{
  switch (e){
    case WidgetType.TEXT:
      return new TextComponent("我是文本")
    case WidgetType.IMAGE:
      return new ImageComponent()
  }
}
const itemKey=(e)=>{
  return e
}

</script>

<template>
  <draggable tag="div" :item-key="itemKey" :clone="onClone" drag-class="drag-handle" :fallbackClass="true" :force-fallback="true"  :sort="false"  :group="{name:'phone',put:false,pull:'clone'}" :list="basicWidgets" class="basic-widget">
      <template #item="{element}">
        <WidgetDraggable :widget-type="element" />
      </template>
  </draggable>
</template>


<style scoped lang="less">
.basic-widget{
  display: flex;
  flex-wrap: wrap;
}
.basic-widget .widget{
  height: 90px;
  font-size: 12px;
}
.ghost{
  background: red;
  height:20px;
}
.drag-handle{
  opacity: 1 !important;
  background: white !important;
  border-radius: 8px;
  border: 1px solid #DCDCDC !important;
  cursor: pointer !important;
  width: 100px !important;
  height: 60px !important;
  label{
    display: none !important;
  }
}
</style>