<script setup lang="ts">

import {NetworkFrom, saveNetwork} from "~/api/network.ts";
import NetworkSelect from "~/pages/mediation/components/network-select.vue";

const props = defineProps({
  value: {
    type: Object,
    required: false
  }
})
const emits = defineEmits(["onClose"])
const state=reactive({
  saveLoading:false
})
const fromData=reactive<NetworkFrom>(<NetworkFrom>{
  isEnableReportApi: true,
  accountConfig: {
    userId: "",
    roleId: "",
    securityKey: "",
    accessKey: "",
    privateKey: "",
    organizationCoreId: "",
    apiKey: "",
    publicKey: "",
    userName: "",
  }
})


const onNetWorkTypeChange=()=>{
  Object.assign(fromData.accountConfig,{
    userId:"",
    roleId:"",
    securityKey:"",
    accessKey:"",
    privateKey:"",
    organizationCoreId:"",
    apiKey:"",
    publicKey:"",
    userName:"",
  })
  fromData.isEnableReportApi=true
}
const formRef=ref()
function close(isSuccess:boolean){
  emits("onClose",isSuccess)
}


const save=async ()=>{
  try {
    await  formRef.value.validate()
    state.saveLoading=true
    try {
      await saveNetwork(unref(fromData))
      close(true)
    }catch (e){
    }
    state.saveLoading=false
  }catch (e) {
    
  }
}

onMounted(()=>{
  if(props.value){
    Object.assign(fromData,props.value)
    fromData.companyId=props.value.company?.id
  }else{
    Object.assign(fromData,{
      isEnableReportApi: true,
      accountConfig: {
        userId: "",
        roleId: "",
        securityKey: "",
        accessKey: "",
        privateKey: "",
        organizationCoreId: "",
        apiKey: "",
        publicKey: "",
        userName: "",
      }
    })
  }
})
</script>

<template>
  <a-form ref="formRef" :model="fromData" layout="vertical">
    <a-form-item label="企业" class="mt-5" name="companyId" :rules="[{required:true,message:'请选择企业'}]">
      <RemoteSelect :disabled="fromData.id!=null" placeholder="请选择企业" v-model:value="fromData.companyId" data-source-url="/company/selectOption"/>
    </a-form-item>
    <a-form-item name="type"  label="广告平台" :rules="[{required:true,message:'请选择广告平台'}]">
      <NetworkSelect @onChange="onNetWorkTypeChange" v-model:value="fromData.type"></NetworkSelect>
    </a-form-item>
    <a-form-item name="name"  label="账户名称" :rules="[{required:true,message:'请输入账户名称'}]">
      <a-input v-model:value="fromData.name" placeholder="请输入账户名称"/>
    </a-form-item>
    <a-flex :gap="10"  class="mb-4">
      <a-typography-text>是否启用报表api</a-typography-text>
      <a-switch v-model:checked="fromData.isEnableReportApi" :checked-value="true" :un-checked-value="false"></a-switch>
    </a-flex>
    <a-button v-if="fromData.isEnableReportApi&&fromData.type==4"  style="width: 100%">
      <a-flex justify="center" align="center">
        <IconGoogle class="mr-2" :width="18" :height="18"/>使用Google账户登录
      </a-flex>
    </a-button>
    <a-form-item   label="User ID" v-if="fromData.isEnableReportApi&&(fromData.type==1 || fromData.type==2|| fromData.type==3)" :rules="[{required:true,message:'请输入User ID'}]">
      <a-input v-model:value="fromData.accountConfig.userId" placeholder="请输入User ID"/>
    </a-form-item>
    <a-form-item   label="Role ID" v-if="fromData.isEnableReportApi&&fromData.type==1" :rules="{required:true,message:'请输入Role ID'}">
      <a-input v-model:value="fromData.accountConfig.roleId" placeholder="请输入Role ID"/>
    </a-form-item>
    <a-form-item   label="Security Key" v-if="fromData.isEnableReportApi&&(fromData.type==1 || fromData.type==2|| fromData.type==3 || fromData.type==9)" :rules="[{required:true,message:'请输入Security Key'}]">
      <a-input v-model:value="fromData.accountConfig.securityKey" placeholder="请输入Security Key"/>
    </a-form-item>
    <a-form-item   label="Public Key" v-if="fromData.isEnableReportApi&&(fromData.type==9)" :rules="{required:true,message:'请输入Public Key'}">
      <a-input v-model:value="fromData.accountConfig.publicKey" placeholder="请输入Public Key"/>
    </a-form-item>
    <a-form-item   label="Access Key" v-if="fromData.isEnableReportApi&&fromData.type==7|| fromData.type==3" :rules="[{required:true,message:'请输入Access Key'}]">
      <a-input v-model:value="fromData.accountConfig.accessKey" placeholder="请输入Access Key"/>
    </a-form-item>
    <a-form-item   label="私钥" v-if="fromData.isEnableReportApi&&fromData.type==7" :rules="[{required:true,message:'请输入私钥'}]">
      <a-input v-model:value="fromData.accountConfig.privateKey" placeholder="请输入私钥"/>
    </a-form-item>
    <a-form-item   label="Api Key" v-if="fromData.isEnableReportApi&&fromData.type==10" :rules="[{required:true,message:'请输入Api Key'}]">
      <a-input v-model:value="fromData.accountConfig.apiKey" placeholder="请输入Api Key"/>
    </a-form-item>
    <a-form-item   label="Organization Core ID" v-if="fromData.isEnableReportApi&&fromData.type==10" :rules="[{required:true,message:'请输入Organization Core ID'}]">
      <a-input v-model:value="fromData.accountConfig.organizationCoreId" placeholder="请输入Organization Core ID"/>
    </a-form-item>

    <a-form-item   label="User Name" v-if="fromData.isEnableReportApi&&(fromData.type==9)" >
      <a-flex vertical :gap="5">
        <a-input v-model:value="fromData.accountConfig.userName" placeholder="请输入User Name"/>
        <a-typography-text style="font-size: 12px" type="secondary">如需使用自动创建Sigmob代码位功能，可在此填写用户名信息</a-typography-text>
      </a-flex>
    </a-form-item>
    <a-flex justify="space-between" align="center"  class="mt-4">
        <a-button type="link">如何获取参数？</a-button>
        <a-flex :gap="10">
          <a-button style="width: 90px;" @click="close(false)">取消</a-button>
          <a-button type="primary" :loading="state.saveLoading" @click="save"  style="width:  90px;">确认</a-button>
        </a-flex>
    </a-flex>
  </a-form>
</template>

<style scoped lang="less">

</style>