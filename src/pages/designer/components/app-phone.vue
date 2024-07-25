<script setup lang="ts">
import { LeftOutlined} from '@ant-design/icons-vue'
import IconForwardArrow from "./icon-forward-arrow.vue";
import IconBackArrow from "./icon-back-arrow.vue";
import IconTemplate from "./icon-template.vue";
import IconComponent from "./icon-component.vue";
import draggable from 'vuedraggable'
import {BaseComponent, BaseComponentStyleAttribute} from "~/pages/designer/types/types.ts";
import WidgetView from "~/pages/designer/components/widget-container/widgets/widget-view.vue";


const components=shallowRef<BaseComponent[]>([])

const currentSelectWidget=shallowRef<BaseComponent>()
const itemKey=(e)=>{
  return e.id
}

const onWidgetItemClick=(widget:BaseComponent)=>{
    currentSelectWidget.value=widget
}

</script>

<template>
<div class="app phone-component">
    <div class="phone-contents">
      <div class="top-fixed-container">
        <div class="page-title-bar" style="background-color: rgb(255, 255, 255); color: black;">
            <LeftOutlined class="icon-arrow-right"/>
            <span class="page-title">首页</span>
            <div class="top-nav-right-section">
                <div class="ellipsis-container">
                  <span class="top-nav-ellipsis"> </span>
                  <span class="top-nav-big-ellipsis top-nav-ellipsis"></span>
                  <span class="top-nav-ellipsis"></span>
                </div>
                <div class="split-line"></div>
                <div class="circle-container">
                  <div class="top-nav-circle" style="border-color: black;">
                    <span class="top-nav-round" style="background-color: black;"></span>
                  </div>
                </div>
            </div>
        </div>
      </div>
      <div class="app-wrap" style="overflow-y: auto; height: calc(100% - 42px);">
        <draggable  :itemKey="itemKey"   v-model="components" group="phone" class="page" style="background-size: 100% 100%; margin-top: -42px; padding-top: 42px; background-color: rgb(255, 202, 3);">
          <template #item="{element}">
            <WidgetView @on-widget-click="onWidgetItemClick" :value="element" :key="element.id" :class="{'over-ele-container':element.id==currentSelectWidget?.id}"/>
          </template>
        </draggable>
      </div>
    </div>
    <div class="operate-wrap operate-wrap-left">
      <span>
        <IconForwardArrow class="icon-container " :width="16" :height="16" />
      </span>
      前进
      <span>
        <IconBackArrow class="icon-container " :width="16" :height="16" />
      </span>
      后退
  </div>
    <div class="operate-wrap " style="left: 413px">
      <span style="background: #3091F2;">
         <IconTemplate class="icon-container " :width="14" :height="14" />
      </span>
      模板
      <span>
         <IconComponent class="icon-container " :width="16" :height="16" />
      </span>
      组件
  </div>
  <a-drawer :mask="false" rootClassName="widget-form-drawer" :open="true" placement="right" :get-container="true" :style="{ position: 'absolute' }" :closable="false" >
    <span>sss</span>
  </a-drawer>

</div>
</template>
<style lang="less">
.widget-form-drawer{
  height: calc( 100vh - 60px );
  margin-top: 60px;
}
.page{
  .sortable-ghost{
    background: transparent !important;
    width: 100%;
    &:after{
      content: '\653e\8fd9\91cc';
      /* content: '放这里'; */
      position: relative;
      display: block!important;
      width: 99%;
      height: 25px;
      line-height: 25px;
      background-color: #ffe5cd;
      color: #ec6941 !important;
      text-align: center;
      margin: 0;
      border: 1px dashed #ec6941;
      font-size: 14px;
      z-index: 99;
    }
    &:hover{
      background: white !important;
    }
    *{
      display: none !important;
    }
  }
}
</style>
<style scoped lang="less">
label,span{
  user-select: none;
}
.app {
  font-size: 14px;
}

.phone-component {
  position: relative;
  display: inline-block;
  margin-left: 70px;
  margin-right: 70px;
  text-align: left;
  .operate-wrap{
    position: absolute;
    right: -50px;
    top: 15px;
    width: 40px;
    text-align: center;
    font-size: 12px;
    letter-spacing: 1px;
    color: #737992;
    .disable{
      opacity: .3;
    }
    span{
      position: relative;
      margin: 15px auto 1px;
      display: block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      border-radius: 50%;
      background-color: #9fa5bb;
      color: #fff;
      letter-spacing: 0;
      &:hover{
        opacity: .8;
      }
    }
  }
  .operate-wrap-left{
    //left: -50px;
    right: auto;
  }
}
.phone-contents{
  position: relative;
  display: inline-block;
  margin-left: 70px;
  margin-right: 70px;
  text-align: left;
}
.phone-component .phone-contents {
  position: relative;
  width: 322px;
  height: 553px;
  background-color: #fff;
  border: 1px solid #aaa;
}
.phone-component .app-wrap {
  position: relative;
  left: -5px;
  width: 330px;
  background-size: 100% 100%;
  overflow-x: hidden !important;
  overflow-y: auto;
  font-size: 0;
  background-color: transparent;
}
.phone-component .page {
  box-sizing: content-box;
  position: relative;
  margin-top: -1px;
  margin-left: auto;
  margin-right: auto;
  width: 320px;
  min-height: 100%;
  padding-top: 1px;
  z-index: 1;
  background-repeat: repeat;
  overflow: visible;
  background-position-y: 42px;
}
.top-fixed-container{
  position: relative;
}
.page-title-bar{
  position: relative;
  width: 320px;
  height: 42px;
  border-bottom: 1px solid #d8d8d8;
  text-align: center;
  color: #000;
  background-color: #fff;
  cursor: pointer;
  overflow: hidden;
  .page-title{
    display: inline-block;
    line-height: 42px;
    vertical-align: middle;
    width: 50%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .icon-arrow-right{
    position: absolute;
    top: 14px;
    left: 7px;
  }
}
.top-nav-right-section{
  position: absolute;
  right: 10px;
  top: 9px;
  padding: 4px 9px;
  border-radius: 15px;
  border: 1px solid #eaeaea;
  font-size: 0;
  .ellipsis-container{
    display: inline-block;
    position: relative;
    vertical-align: middle;
    font-size: 0;
    .top-nav-ellipsis{
      margin: 5px 1px;
      display: inline-block;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      vertical-align: middle;
      background-color: #000;
    }
    .top-nav-big-ellipsis{
      width: 5px;
      height: 5px;
    }
  }
}
.circle-container, .ellipsis-container, .split-line{
  display: inline-block;
  position: relative;
  vertical-align: middle;
  font-size: 0;
}
.split-line{
  margin: 0 9px 0 8px;
  height: 15px;
  width: 0;
  border-right: 1px solid #eaeaea;
}
.top-nav-circle{
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1px solid #000;
}
.top-nav-round {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #000;
}
.icon-container {
  display: inline-block;
  width: 20px;
  height: 20px;
  font-size: 14px;
  vertical-align: middle;
  text-indent: 0;
  text-decoration: none;
  text-align: center;
}
</style>