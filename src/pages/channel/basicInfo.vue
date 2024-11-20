<script setup lang="ts">
import { reactive} from 'vue';
import { message } from 'ant-design-vue';
import {AlipaySquareFilled } from "@ant-design/icons-vue"
import {ContactWay, ContactWaySelectOption,getContactWayText} from "~/utils/constant.ts";
import { getChannelInfo, ChannelInfo, saveChannel,ChannelFormData } from '~/api/channel/ChannelInterface'
import {getPayChannelTypeText, PayChannelType, PayModeType, getPayModeTypeText} from "~/utils/constant.ts";
// import {MerchantInfo, modifyMerchant, getMerchantInfo, resetMerchantPwd,MerchantResetPwdRequset } from '~/api/merchant'
const route = useRoute()
const router = useRouter()
const state = reactive<{
  showBaseInfoDialog: boolean;
  showConcatDialog: boolean;
  dialogBtnLoading: boolean;
  ShowSettingPwdDialog: boolean;
  isLoading:boolean;
  isOnEditPay:boolean;
  isOnEditChildAgent: boolean;
}>({
  showBaseInfoDialog: false,
  showConcatDialog: false,
  dialogBtnLoading: false,
  ShowSettingPwdDialog: false,
  isLoading: false,
  isOnEditPay: false,
  isOnEditChildAgent: false

})
const formRef = ref();
const resetPwdForm = ref<ChannelInfo>({});


interface FormState {
  username: string;
  password: string;
  remember: boolean;
  contactWay: ContactWay;
}


const ininForm = ():ChannelFormData => {
    return {
      
    }
}
const formData=ref<ChannelFormData>(ininForm())
const info = ref<ChannelInfo>({})

const handleShowBaseInfo = () => {
  formData.value = JSON.parse(JSON.stringify(formData))
  setTimeout(() => {
    formRef.value.resetFields();
  })
  state.showBaseInfoDialog = true;
}

const handleShowConcatInfo = () => {
  formData.value = JSON.parse(JSON.stringify(formData))
  setTimeout(() => {
    formRef.value.resetFields();
  })
  state.showConcatDialog = true;
}
const handleShowSettingPwd = () => {
  state.ShowSettingPwdDialog = true;
}

const handleBaseInfoOk = async () => {


  submit()
  
}


const submit = async () => {
    state.dialogBtnLoading = true
    try {
      let data:ChannelFormData= JSON.parse(JSON.stringify(formData));
      let res = await saveChannel(data)
      message.success('操作成功')
      await getInfo(id as string)
      // initPayChannelConfig()
    } catch (error) {
        // message.error(`${error}`)
    } finally {
      state.dialogBtnLoading = false
      state.showBaseInfoDialog = false
      state.showConcatDialog = false
    }
}

const getInfo=async (id:string)=>{
  state.isLoading=true
  const {data} =await getChannelInfo(id)
  info.value = data
  getPayModelName(data.payModes)
  state.isLoading=false
}

const payModelNames = ref<string[]>([])
const getPayModelName = (payModes: string[]) => {
  if (payModes.length) {
    payModes.map((item: PayModeType, index: number) => {
      payModelNames.value.push(`${index + 1}、${ useOptsStore().getPayModesText(item)}`)
    })
  }
}

const {id}= route.query
onMounted(async ()=>{
  if(id){
    
    await getInfo(id as string)
    
  }
  
})
</script>

<template>
  <div>

    <a-modal v-model:open="state.showBaseInfoDialog" title="设置基础信息">
      <template #footer>
        <a-button key="back" @click="state.showBaseInfoDialog = false">取 消</a-button>
        <a-button key="submit" type="primary" :loading="state.dialogBtnLoading" @click="handleBaseInfoOk">保 存</a-button>
      </template>
      <a-form
         ref="formRef"
        style="padding: 30px 0;"
        :model="formData"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
      >
        <a-form-item
          label="商户名称"
          name="username"
          :rules="[{ required: false, message: '商户名称!' }]"
        >
          <a-input v-model:value="formData.name" disabled   />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-card :body-style="{padding: '15px'}">
      <a-descriptions :column="4" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>基础信息</a-typography-text>
            <!-- <a-button @click="handleShowBaseInfo" type="link">编辑</a-button> -->
          </a-flex>

        </template>

       
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="渠道名称">{{ info.name }}</a-descriptions-item>

        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="渠道类型">
          <a-flex :gap="5" >
            <AlipaySquareFilled v-if="[PayChannelType.ALI,PayChannelType.ALI_USER].includes(info.channelType)" style="color: dodgerblue;font-size: 18px"/>
            <a-typography-text strong  style="font-size: 12px">{{getPayChannelTypeText(info.channelType)}}</a-typography-text >
          </a-flex>
        </a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="创建日期">{{ info.createTime }}</a-descriptions-item>

      </a-descriptions>
    </a-card>

    <a-card :body-style="{padding: '15px'}" :loading="state.isLoading">
      <a-descriptions :column="4" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>所属渠道组</a-typography-text>
            <!-- <a-button @click="handleShowBaseInfo" type="link">编辑</a-button> -->
          </a-flex>

        </template>
       
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="渠道组名称">
          
          <a-typography-link v-if="info.group" @click="router.push({path:'/channel/group-info',query:{groupCode:info.group.groupCode}})">{{info.group.name}}</a-typography-link>
          <a-typography-text v-else type="secondary">/</a-typography-text>
        </a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="渠道组编码">{{  info.group ? info.group.groupCode : '/'  }}</a-descriptions-item>
        

      </a-descriptions>
    </a-card>

    <a-card :body-style="{padding: '15px'}" :loading="state.isLoading">
      <a-descriptions :column="1" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>支付方式</a-typography-text>
            <!-- <a-button @click="handleShowBaseInfo" type="link">编辑</a-button> -->
          </a-flex>

        </template>
       
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="支持的支付方式">
          <a-space>
            <a-typography-text v-for="i in payModelNames" style="padding-right: 20px;">{{ i }}</a-typography-text>
          </a-space>
        </a-descriptions-item>
        

      </a-descriptions>
    </a-card>

    <a-card :body-style="{padding: '15px'}" :loading="state.isLoading">


      <a-descriptions :column="4" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>统计信息</a-typography-text>
          </a-flex>

        </template>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="订单支付成功条数">{{ info.successCount }}</a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="订单支付累计条数">{{ info.totalCount }}</a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="订单支付成功金额">{{ info.successAmount }}</a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="订单支付累计金额">{{ info.totalAmount }}</a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<style scoped lang="less">

</style>