<script setup lang="ts">

import IconTextWidget from "~/pages/designer/components/widget-container/icons/icon-text-widget.vue";
import IconImageWidget from "~/pages/designer/components/widget-container/icons/icon-image-widget.vue";
import IconButtonWidget from "~/pages/designer/components/widget-container/icons/icon-button-widget.vue";
import IconTitleWidget from "~/pages/designer/components/widget-container/icons/icon-title-widget.vue";
import IconProductListWidget from "~/pages/designer/components/widget-container/icons/icon-product-list-widget.vue";
import IconVideoWidget from "~/pages/designer/components/widget-container/icons/icon-video-widget.vue";
import IconSwiperWidget from "~/pages/designer/components/widget-container/icons/icon-swiper-widget.vue";
import IconNoticeWidget from "~/pages/designer/components/widget-container/icons/icon-notice-widget.vue";
import IconComboWidget from "~/pages/designer/components/widget-container/icons/icon-combo-widget.vue";
import {getWidgetName, WidgetType} from "~/pages/designer/types/types.ts";
const props = defineProps({
  widgetType: {
    type: Number ,
    required: false,
    default:null
  }
})



</script>

<template>
  <div  class="widget fl "  >
    <span  class="icon-container" >
      <IconTextWidget :height="25" :width="24" v-if="WidgetType.TEXT==widgetType" color="#666"/>
      <IconImageWidget :height="25" :width="24" v-if="WidgetType.IMAGE==widgetType" color="#666"/>
      <IconButtonWidget :height="25" :width="24" v-if="WidgetType.BUTTON==widgetType" color="#666"/>
      <IconTitleWidget :height="25" :width="24" v-if="WidgetType.TITLE==widgetType" color="#666"/>
      <IconProductListWidget :height="25" :width="24" v-if="WidgetType.PRODUCT_LIST==widgetType" color="#666"/>
      <IconVideoWidget :height="25" :width="24" v-if="WidgetType.VIDEO==widgetType" color="#666"/>
      <IconSwiperWidget :height="25" :width="24" v-if="WidgetType.SWIPER==widgetType" color="#666"/>
      <IconNoticeWidget :height="25" :width="24"  v-if="WidgetType.NOTICE==widgetType" color="#666"/>
      <IconComboWidget :height="25" :width="24" v-if="WidgetType.COMBO==widgetType" color="#3091f2"/>
    </span>
      <label>
        {{getWidgetName(widgetType)}}
      </label>
      <a class="help-wrap">
        <span class="help-text">?</span>
        <span class="help"></span>
      </a>
    </div>
</template>

<style scoped lang="less">
label,span{
  user-select: none;
}
.widget:hover{
  background: #e9eefa;
  .help-wrap{
    display: block;
  }
}
.help-wrap{
  display: none;
  &:hover{
    color: #49a9ee;
    .help {
      background-color: #2cb9fe;
    }
  }
  .help-text {
    position: absolute;
    top: 2px;
    right: 5px;
    z-index: 1;
    color: #fff;
    font-size: 16px;
  }
}
.help{
  position: absolute;
  right: -28px;
  top: -29px;
  width: 55px;
  height: 55px;
  line-height: 18px;
  background-color: #B3B3B3;
  color: #858585;
  transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  -o-transform: rotate(45deg);
}
</style>