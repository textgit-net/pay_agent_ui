<script setup lang="ts">

import {MediationSiteNetwork} from "~/api/mediatonSiteNetwork.ts";
import IconAdSet from "~/components/icons/icon_ad_set.vue";
import IconAdBaidu from "~/components/icons/icon_ad_baidu.vue";
import IconAdSigMob from "~/components/icons/icon-ad-sigmob.vue";
import { NetworkType } from "@vueuse/core";
import { vNodeType } from "ant-design-vue/es/_util/type";
import { MediationNetworkType } from "~@/utils/constant";
import {PropType} from "vue";

const emits = defineEmits(["onNetworkChange"])

const props = defineProps({
  networksList:{
    type: Array as PropType<MediationSiteNetwork[]>,
    required:true,
    default: () => []
  },
})

const isEnableNetwork=(type:MediationNetworkType)=>{
  return props.networksList.filter(v=>type===v.network.type).length>0
}
const selectNetWork=ref<MediationNetworkType>(props.networksList.length>0?props.networksList[0].type:null)
const onNetItemClick=(type:MediationNetworkType)=>{
  selectNetWork.value=type
  emits("onNetworkChange", props.networksList.find(v=>type===v.network.type).id)
}





</script>

<template>
<div class="me-code-create-network-container">
  <div @click="onNetItemClick(MediationNetworkType.SIG_MOB)" class="me-code-create-network-item" :class="{'item-select':MediationNetworkType.SIG_MOB==selectNetWork}">
    <div class="me-code-create-network-item-container">
      <IconAdSigMob :width="53" :height="38"/>
      <span>Sigmob</span>
      <div class="me-code-create-network-item-configCover" v-if="!isEnableNetwork(MediationNetworkType.SIG_MOB)">
        <span>配制</span>
      </div>
    </div>
  </div>
  <div @click="onNetItemClick(MediationNetworkType.CSJ)"  class="me-code-create-network-item " :class="{'item-select':MediationNetworkType.CSJ==selectNetWork}">
    <div class="me-code-create-network-item-container">
      <IconAdCsj :height="38"/>
      <span>穿山甲</span>
      <div class="me-code-create-network-item-configCover" v-if="!isEnableNetwork(MediationNetworkType.CSJ)">
        <span>配制</span>
      </div>
    </div>
  </div>
  <div  @click="onNetItemClick(MediationNetworkType.GDT)"  class="me-code-create-network-item "  :class="{'item-select':MediationNetworkType.GDT==selectNetWork}">
    <div class="me-code-create-network-item-container">
      <IconAdSet :height="38"/>
      <span>优量汇</span>
      <div class="me-code-create-network-item-configCover" v-if="!isEnableNetwork(MediationNetworkType.GDT)" >
        <span>配制</span>
      </div>
    </div>
  </div>
  <div @click="onNetItemClick(MediationNetworkType.KS)"  class="me-code-create-network-item " :class="{'item-select':MediationNetworkType.KS==selectNetWork}">
    <div class="me-code-create-network-item-container">
      <IconAdKuaishou :height="38" :width="38"/>
      <span>快手</span>
      <div class="me-code-create-network-item-configCover" v-if="!isEnableNetwork(MediationNetworkType.KS)">
        <span>配制</span>
      </div>
    </div>
  </div>
  <div @click="onNetItemClick(MediationNetworkType.BAIDU_MOB)"  class="me-code-create-network-item " :class="{'item-select':MediationNetworkType.BAIDU_MOB==selectNetWork}">
    <div class="me-code-create-network-item-container">
      <IconAdBaidu :height="38" />
      <span>百度</span>
      <div class="me-code-create-network-item-configCover" v-if="!isEnableNetwork(MediationNetworkType.BAIDU_MOB)">
        <span>配制</span>
      </div>
    </div>
  </div>
  <div @click="onNetItemClick(MediationNetworkType.AD_MOB)"  class="me-code-create-network-item " :class="{'item-select':MediationNetworkType.AD_MOB==selectNetWork}">
    <div class="me-code-create-network-item-container">
      <IconAdMob :height="38" />
      <span>Admob</span>
      <div class="me-code-create-network-item-configCover" v-if="!isEnableNetwork(MediationNetworkType.AD_MOB)">
        <span>配制</span>
      </div>
    </div>
  </div>
  <div @click="onNetItemClick(MediationNetworkType.UNITY)"  class="me-code-create-network-item " :class="{'item-select':MediationNetworkType.UNITY==selectNetWork}">
    <div class="me-code-create-network-item-container">
      <IconAdUnity :height="38" />
      <span>Unity</span>
      <div class="me-code-create-network-item-configCover"  v-if="!isEnableNetwork(MediationNetworkType.UNITY)">
        <span>配制</span>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped lang="less">
.me-code-create-network-container{
  box-sizing: border-box;
  color: #333;
  display: flex;
  font-size: 14px;
  line-height: 22px;
  position: relative;
  vertical-align: top;
  .me-code-create-network-item{
    border-radius: 4px;
    cursor: pointer;
    height: 88px;
    margin: 0 10px 10px 0;
    overflow: hidden;
    padding: 0;
    width: 110px;
    .me-code-create-network-item-container{
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      position: relative;
      width: 100%;
      .me-code-create-network-item-configCover{
        align-items: center;
        background: rgba(0, 0, 0, .5);
        color: #fff;
        display: flex;
        font-size: 16px;
        height: 100%;
        justify-content: center;
        left: 0;
        line-height: 24px;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 3;
      }
    }
    &.item-select{
      background-color: #ebf3ff;
      border-color: #338aff;
      color: #338aff;
    }
    &:hover {
      background-color: #fff;
      border-color: #58a0ff;
      color: #58a0ff;
    }
  }
}

</style>