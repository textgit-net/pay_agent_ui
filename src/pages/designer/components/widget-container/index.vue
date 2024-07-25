<script setup lang="ts">
import LayoutWidget from "./layout-widget.vue";
import BasicWidget from "./basic-widget.vue";
</script>

<template>
  <div class="widgets-container">
    <div>
      <BasicWidget/>
      <div class="top-tab-nav operate-navs">
      <span>
        <span class="active">布局</span>
      </span>
       <span>
        <span >功能</span>
      </span>
      <span>
        <span >营销</span>
      </span>
      <span>
        <span >辅助</span>
      </span>
      </div>
      <div class="tab-content">
        <LayoutWidget/>
      </div>

    </div>
  </div>
</template>

<style scoped lang="less">
.widgets-container{
  height: 100%;
}

</style>
<style  lang="less">

.widgets-container .operate-navs {
  display: flex;
  text-align: center;
  border: none;
  background-color: #F6F6F6;
  height: 50px;
  clear: both;
  span {
    flex: 1;
    width: auto;
    box-sizing: border-box;
    /* font-size: 14px; */
    line-height: 51px;
    /* height: 51px; */
    /* color: #C7C7CD; */
    /* vertical-align: top; */
    background-color: #fff;
    border: 1px solid transparent;
    border-bottom: solid 1px #cccc;
    border-top: 1px solid #cccccc;
    text-align: center;
    span {
      border: none;
      display: inline-block;
      height: 100%;
      padding: 0 5px;
      &.active {
        color: #3091f2;
        /* height: 51px; */
        border-bottom: 1px solid #3091f2;
        background-color: #fff;
        position: relative;
        &:after {
          content: '';
          position: absolute;
          display: inline-block;
          left: 14px;
          bottom: 0;
          border-right: 4px solid transparent;
          border-left: 4px solid transparent;
          border-bottom: 4px solid #3091f2;
        }
      }
    }
  }
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
.widget, .widget-popup-window, .widget-sidebar, .widget-dynamic-classify, .widget-sliding-panel, .widget-groupCenter, .widget-suspension {
  position: relative;
  display: inline-block;
  width: 33.33%;
  text-align: center;
  cursor: pointer;
  border-right: 1px solid #DCDCDC;
  border-bottom: 1px solid #DCDCDC;
  overflow: hidden;
  background-color: #fff;
}
.widget .icon-container, .widget-popup-window .icon-container, .widget-sidebar .icon-container, .widget-dynamic-classify .icon-container, .widget-sliding-panel .icon-container, .widget-groupCenter .icon-container, .widget-suspension .icon-container {
  padding-top: 10px;
  height: 48px;
  width: 100%;
  font-size: 24px;
  line-height: 58px;
  color: #666;
  box-sizing: content-box;
}
.widgets-container .cover-widget, .widgets-container .widget {
  height: 90px;
  font-size: 12px;
}

</style>