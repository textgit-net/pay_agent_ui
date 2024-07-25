<script setup lang="ts">
import {CloseOutlined,BorderOutlined, VerticalAlignTopOutlined,AppleOutlined} from '@ant-design/icons-vue'
import {Application} from "~/api/application.ts";
const emits = defineEmits(["onSelect","onDel"])
const props = defineProps({
  value:{
    type:Object,
    required:true
  },
  isSelectStyle: {
    type: Boolean,
    required: false
  }
})


</script>

<template>

    <a-flex  class="application-item-warp" :class="{'select':isSelectStyle}" align="center" justify="space-between" style="padding: 10px">
      <a-flex align="center" justify="center" :gap="10">

        <BorderOutlined style="color: rgba(0, 0, 0, 0.45)" v-if="!isSelectStyle" @click="emits('onSelect',value)"/>
        <a-avatar shape="square" :src="value.icon"></a-avatar>
        <a-flex vertical>
          <a-typography-text strong>{{value["name"]}}</a-typography-text>
          <a-typography-text type="secondary" style="font-size: 12px">{{value["id"]}}</a-typography-text>
        </a-flex>
      </a-flex>
      <a-flex :gap="10">
        <span class="application-item-status online">测式</span>
        <CloseOutlined @click="emits('onDel',value)" v-if="isSelectStyle" style="color: #999;font-size: 12px;cursor: pointer;"/>
      </a-flex>
    </a-flex>

</template>

<style scoped lang="less">
.application-item-warp{
  margin-top: 10px;
  cursor: pointer;
  border-radius: 7.5px;
  &:hover{
    background: #f0f0f0
  }
  &.select{
    background: #f0f0f0
  }
  &:first-child{
    margin-top: 0;
  }
  .application-item-status{
    padding: 1px 10px;
    border-radius: 4px;
    font-size: 12px;
    &.test{
      background-color: #fff5d0;
      border: 1px solid #eca20f;
      color: #eca20f;
    }
    &.online{
      background-color: #7ef5b0;
      border: 1px solid #00943e;
      color: #00943e;
    }

  }
}
</style>