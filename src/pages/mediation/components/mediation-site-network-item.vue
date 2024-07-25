<script setup lang="ts">

import {PlusOutlined} from "@ant-design/icons-vue";
import IconAdBaidu from "~/components/icons/icon_ad_baidu.vue";
import IconAdCSJ from "~/components/icons/icon-ad-csj.vue";
import IconAdSet from "~/components/icons/icon_ad_set.vue";
import IconAdSigMob from "~/components/icons/icon-ad-sigmob.vue";
import IconAdKuAisHou from "~/components/icons/icon-ad-kuaishou.vue";
import MediationSiteNetworkItem from "~/pages/mediation/components/mediation-site-network-item.vue";
import {MediationSiteNetwork, MediationSiteNetworkFrom, saveMediationSiteNetwork} from "~/api/mediatonSiteNetwork.ts";
import * as net from "net";
import {NetworkResponse} from "~/api/network.ts";
import NetworkItem from "~/pages/mediation/components/network-item.vue";
const props = defineProps({
  value: {
    type: Object,
    required: false,
    default:null
  },
  siteId:{
    type:Number,
    required:true
  },
  networkType:{
    type:Number,
    required:true
  },
  companyId:{
    type:Number,
    required: true
  }
})
const isShowModal=ref(false)
const emits = defineEmits(["ok"])
const form=shallowRef<MediationSiteNetworkFrom>({})
const formRef=ref(null)
const networkName=computed(()=>{
  switch (props.networkType){
    case 1:
      return "穿山甲"
    case 2:
      return "优量汇"
    case 3:
      return "快手"
    case 4:
      return  "Google AdMob"
    case 7:
      return "百度"
    case 10:
      return "Unity"
    case 9:
      return "SigMob"
  }
})
const networks=shallowRef<NetworkResponse[]>([])
watch(()=>props.value,(newValue,_)=>{
  if(newValue){
    setFormValue(newValue as MediationSiteNetwork)
  }else {
    setFormValue(null)
  }
})
const setFormValue=(data?:MediationSiteNetwork)=>{
  Object.assign(form.value,{
    appId:data?.targetAppId,
    siteId:props.siteId,
    id:data?.id,
    networkId:data?.network?.id
  })
}
const loadNetwork=async ()=>{
  let  res=await useGet<NetworkResponse[]>(`/ad/network/list?companyId=${props.companyId}&networkType=${props.networkType}`)
  networks.value=res.data??[]
}

const doSaveSiteNetwork=async ()=>{
  try {
    await  formRef.value.validate()
    try {
      await saveMediationSiteNetwork(unref(form))
      emits("ok")
    }catch (e){
    }
  }catch (e) {
  }
}
onMounted(()=>{
  if(props.value){
    setFormValue(props.value as MediationSiteNetwork)
  }else {
    setFormValue(null)
  }
  loadNetwork()
})
</script>

<template>
    <div  @click="isShowModal=true"  class="AdnIcon-style-module__root " :class="{'AdnIcon-style-module__root-unactive':value==null}" style="height: 24px;border: none">
      <div :class="{'AdnIcon-style-module__unactive':value==null}">
        <IconAdCSJ v-if="networkType==1" :width="24" :height="15" />
        <IconAdSet v-if="networkType==2" :width="18" :height="18" />
        <IconAdKuAisHou v-if="networkType==3" :width="18" :height="18"/>
        <IconAdMob v-if="networkType==4" :width="18" :height="18"/>
        <IconAdBaidu v-if="networkType==7" :width="30" :height="18"/>
        <IconAdUnity v-if="networkType==10" :width="18" :height="18" />
        <IconAdSigMob v-if="networkType==9" :width="56" :height="16"/>
        <span style="font-size: 12px;color: #333;margin-left: 5px;">{{networkName}}</span>
        <PlusOutlined v-if="value==null" style="margin-left: 5px;font-size: 12px;"/>
      </div>

      <a-modal @cancel="setFormValue(props.value as MediationSiteNetwork)"  @ok="doSaveSiteNetwork" centered v-model:open="isShowModal" :width="540" :title="`配制${networkName}广告网络`" destroy-on-close>
        <a-form ref="formRef" layout="vertical" :model="form" class="mt-2">
          <a-form-item :label="`${networkName}应用ID`" name="appId" :rules="[{required:false,message:`请输入${networkName}应用ID`}]">
            <a-input v-model:value="form.appId" :placeholder="`请输入${networkName}应用ID`"/>
          </a-form-item>
          <a-form-item :label="`${networkName}账号`" name="networkId" :rules="[{required:false,message:'请选择广告网络账号'}]">
            <a-select v-model:value="form.networkId"   placeholder="请选择广告网络账号">
              <a-select-option v-for="(item) in networks" :value="item.id"><NetworkItem :value="item.type"/><span>{{item.name}}</span> </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
</template>

<style scoped lang="less">

</style>