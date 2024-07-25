<script setup lang="ts">

import AppPhone from "~/pages/designer/components/app-phone.vue";
import AppRuler from "~/pages/designer/components/app-ruler.vue";
import AppHeader from "~/pages/designer/components/app-header.vue";
import AppPageMange from "~/pages/designer/components/app-page-mange.vue";
import WidgetContainer from './components/widget-container/index.vue'
const state=reactive({
  navComponentKey:'page'
})
</script>

<template>
<div class="designer-container">
  <app-header/>
  <app-ruler/>
  <div class="body-component" style="top: calc(50% - 320px); left: calc(50% - 312.5px);">
    <div class="left-contents ">
      <div class="operate-navs top-navs">
        <span  @click="state.navComponentKey='page'" :class="{active:state.navComponentKey=='page'}">页面管理</span>
        <span @click="state.navComponentKey='component'" :class="{active:state.navComponentKey=='component'}" >组件库</span>
      </div>
      <div class="nav-component">
        <app-page-mange v-show="state.navComponentKey=='page'"/>
        <WidgetContainer v-show="state.navComponentKey=='component'"/>
      </div>
    </div>
    <app-phone></app-phone>
  </div>

</div>
</template>
<style scoped  lang="less">
label,span{
  user-select: none;
}
</style>
<style  lang="less">
@import "./styles/index.less";
.designer-container{
  height: 100%;
  margin: 0 auto;
  .left-contents{
    vertical-align: top;
    text-align: left;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    width: 270px;
    z-index: 99;
    .operate-navs{
      border-bottom: 1px solid #dcdcdc;
    }
  }
  *:before, *:after {
    box-sizing: border-box;
  }
  .body-component{
    position: absolute;
    top: calc((100% - 560px) / 2 + 30px);
    left: calc((100% - 500px) / 2);
     width: 500px;
    vertical-align: middle;
    margin: 0 auto;
    text-align: center;
    -webkit-transform-origin: center top;
    -moz-transform-origin: center top;
    -ms-transform-origin: center top;
    transform-origin: center top;
  }
}
.operate-navs{
  position: relative;
  font-size: 0;
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  color: #59607b;
  border-bottom: 1px solid #c6c6c6;
  border-right: 1px solid #c6c6c6;
  span{
    height: 100%;
    display: inline-block;
    width: 50%;
    box-sizing: border-box;
    cursor: pointer;
    letter-spacing: normal;
    font-size: 14px;
    text-align: center;
    vertical-align: top;
  }
}

.top-navs{
  span{
    &.active {
      color: #3091f2;
      border-bottom: 2px solid #3091f2;
      height: 100%;
      &:before{
        content: '';
        display: block;
        position: absolute;
        border-style: solid;
        border-width: 10px;
        border-color: transparent;
        bottom: 0;
        left: 65px;
        border-bottom-color: #3091f2;
      }
    }
  }
  span + span.active:before {
    left: calc(75% - 7px);
  }
}
.nav-component{
  position: relative;
  height: calc(100% - 60px);
  background-color: #F6F6FB;
  z-index: 100;
  border-top: none;
  vertical-align: top;
  border-right: 1px solid #c6c6c6;
  overflow: auto;
  &.active{
    display: block;
  }
}
</style>