<script setup lang="ts">
import {CloseOutlined} from '@ant-design/icons-vue'
import {PropType} from "vue";
import {BaseComponent, BaseComponentStyleAttribute, WidgetType} from "~/pages/designer/types/types.ts";
import TextWidgetView from "~/pages/designer/components/widget-container/widgets/text-widget-view.vue";
import ImageWidgetView from "~/pages/designer/components/widget-container/widgets/image-widget-view.vue";

const emits = defineEmits(["onWidgetClick"])
const props = defineProps({
  value:{
    type:Object as PropType<BaseComponent<BaseComponentStyleAttribute>>,
    required:true
  }
})

const style=computed(()=>{
  return{
    "margin-top":`${props.value.style.margin.top}px`,
    "margin-left":props.value.style.margin.left?`${props.value.style.margin.left}px`:'auto',
    "margin-bottom":`${props.value.style.margin.bottom}px`,
    "margin-right":props.value.style.margin.right?`${props.value.style.margin.right}px`:'auto',
    "background-color":props.value.style.backgroundColor,
    "border-style":props.value.style.border.borderStyle,
    "border-color":props.value.style.border.borderColor,
    "border-right-width":`${props.value.style.border.borderSize.right}px`,
    "border-left-width":`${props.value.style.border.borderSize.left}px`,
    "border-bottom-width":`${props.value.style.border.borderSize.bottom}px`,
    "border-top-width":`${props.value.style.border.borderSize.top}px`,
  }
})
const widgetClass=computed(()=>{
  return{
    text:WidgetType.TEXT==props.value.type,
    picture:WidgetType.IMAGE==props.value.type
  }
})
</script>

<template>
  <div class="ele-container" @click="emits('onWidgetClick',value)">
    <div class="control-wrap">
      <span class="move-handle">
       <i></i>
       <i></i>
       <i></i>
      </span>
      <CloseOutlined class="ele-hide-icon"/>
    </div>
    <div class="ele-content element " :class="widgetClass" :style="style">
      <TextWidgetView :value="value as TextWidgetView" v-if="value.type==WidgetType.TEXT"/>
      <ImageWidgetView :value="value as ImageWidgetView" v-if="value.type==WidgetType.IMAGE"/>
    </div>

  </div>
</template>

<style scoped lang="less">
.ele-content, .ele-container {
  background-size: 100%;
}
.ele-container {
  position: relative;
  display: block;
  max-width: 100%;
  z-index: 1;
  clear: both;
  &:hover{
    border: 1px solid #3091f2;

    .control-wrap{
      display: block;
    }
  }
}
.over-ele-container {
  border: 1px solid #3091f2;

}
.control-wrap{
  display: none;
  position: absolute;
  width: 100%;
  height: 0;
  left: 0;
  top: 0;
  font-size: 0;
  font-style: normal;
  font-weight: normal;
  z-index: 100;
  .move-handle {
    position: absolute;
    left: 50%;
    top: 0;
    width: 55px;
    height: 18px;
    padding-top: 4px;
    font-size: 16px;
    margin-left: -28px;
    border-left: 1px solid #37a1ec;
    border-right: 1px solid #37a1ec;
    border-bottom: 1px solid #37a1ec;
    border-radius: 0 0 3px 3px;
    background-color: #fff;
    cursor: move;
    i {
      display: block;
      width: 15px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 2px;
      border-top: 1px solid #37a1ec;
    }
  }
  .ele-hide-icon {
    position: absolute;
    right: -1px;
    top: -1px;
    width: 18px;
    height: 18px;
    line-height: 16px;
    font-size: 20px;
    border: 1px solid #37a1ec;
    border-radius: 2px;
    background-color: #fff;
    color: #37a1ec;
    cursor: pointer;
    text-align: center;
    z-index: 999;
  }
}
</style>