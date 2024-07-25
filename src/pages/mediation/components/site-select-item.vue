<script setup lang="ts">

import {MediationSite} from "~/api/mediationSite.ts";
import {ClientPlatform} from "~/utils/constant.ts";
import {AndroidOutlined, AppleOutlined, VerticalAlignTopOutlined} from "@ant-design/icons-vue";
const emits = defineEmits(["onItemClick"])
const props = defineProps({
  value: {
    type: Object,
    required: true
  },
  isSelect:{
    type:Boolean,
    required:false,
    default:false
  }
})
</script>

<template>
  <a-flex   @click="  emits('onItemClick',props.value)" style="cursor: pointer" align="center" justify="space-between" class="list-item " :class="{'select':isSelect}" >
    <a-flex :gap="10" align="center">
      <a-avatar shape="square" :src="(value as MediationSite).applicationInfo.icon"/>
      <a-flex vertical>
        <span class="list-item-title">{{(value as MediationSite).applicationInfo?.name}}</span>
        <div class="list-item-sub-title" style="margin-top: 5px">
          <AndroidOutlined v-if="value.clientPlatform==ClientPlatform.ANDROID"/>
          <AppleOutlined v-else/>
          <span style="margin-left: 10px">{{(value as MediationSite).id}}</span>
        </div>

      </a-flex>
    </a-flex>
  </a-flex>
</template>

<style scoped lang="less">
.list-item{
  display: flex;
  padding: 4px;
  border-radius: 0;
  box-sizing: border-box;
  cursor: pointer;
  color: #333;
  .list-item-sub-title{
    font-size: 12px;
    color: #999;
  }
  .list-item-title{
    font-weight: bold;height: 18px;
  }
  .list-item-button{
    visibility: hidden;
  }
  &:hover{
    background-color: #f4f4f5;
    .list-item-button{
      visibility: visible;
    }
  }
  &.select{
    background: #f4f4f5;
  }
  .badge{
    display: inline-block;
    width: 6px;
    height: 6px;
    vertical-align: middle;
    border-radius: 50%;
    &.success{
      background: rgb(0, 148, 62);
    }
  }

}
.list-item:last-child{
  margin-bottom: 0;
}
</style>