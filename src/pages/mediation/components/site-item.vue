<script setup lang="ts">
import {AndroidOutlined, VerticalAlignTopOutlined,AppleOutlined} from '@ant-design/icons-vue'
import {ClientPlatform} from "~/utils/constant.ts";
import { MediationSite} from "~/api/mediationSite.ts";
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
  <div  @click="  emits('onItemClick',props.value)">
    <a-flex  align="center" justify="space-between" class="list-item " :class="{'select':isSelect}" >
      <a-flex :gap="10" align="center">
        <a-avatar shape="square" :src="(value as MediationSite).applicationInfo.icon"/>
        <a-flex vertical>
          <span class="list-item-title">
            <span>{{(value as MediationSite).applicationInfo?.name}}</span>
          </span>
          <div class="list-item-sub-title" style="margin-top: 5px">
            <AndroidOutlined v-if="value.clientPlatform==ClientPlatform.ANDROID"/>
            <AppleOutlined v-else/>
            <span style="margin-left: 10px">{{(value as MediationSite).applicationInfo?.id}}</span>
          </div>

        </a-flex>
      </a-flex>
      <a-flex :gap="10">
        <VerticalAlignTopOutlined  class="list-item-button"/>
        <div class="badge success"/>
      </a-flex>


    </a-flex>
  </div>

</template>

<style scoped lang="less">
.list-item{
  display: flex;
  padding: 10px;
  border-radius: 8px;
  box-sizing: border-box;
  cursor: pointer;

  .list-item-sub-title{
    font-size: 12px;
    color: #969aa0;
  }
  .list-item-title{
    font-weight: bold;color: #333;height: 18px;
  }
  .list-item-button{
    visibility: hidden;
  }
  &:hover{
    background-color: #fafafa;
    .list-item-button{
      visibility: visible;
    }
  }
  &.select{
    background: #e5f5ff;
    .list-item-sub-title{
      color: #2a55e5;
    }
    .list-item-title{
      color:  #2a55e5;
    }
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
</style>