<script setup lang="ts">
import {CloseCircleOutlined, DoubleRightOutlined} from '@ant-design/icons-vue'
import {getPayChannelTypeText, PayChannelType, PayModeType, getPayModeTypeText, PayModeTypeSelectOption, SelectOption} from "~/utils/constant.ts";
import {channelTest, ChannelTestRequest, getALLChannelList,ChannelListResponse, ALLChannelListRequest, } from "~/api/channel/ChannelInterface.ts";
import type { PayModesItem, ChannelTypeAndPayModeOptItem } from '~@/api/common/opts'
import {AlipaySquareFilled,ArrowLeftOutlined } from "@ant-design/icons-vue"
import QrcodeVue from 'qrcode.vue'
import type { Level, RenderAs, ImageSettings } from 'qrcode.vue'

const qrLevel = ref<Level>('H')
const renderAs = ref<RenderAs>('svg')

const items = ref([
  {
    title: '创建订单'
  },
  {
    title: '扫码支付'
  },
  {
    title: '支付结果'
  }
]);

const isExtend=ref(false)
const router=useRouter()
const route = useRoute()
const formRef=ref()
var channels = [];
const PayModeOptions = useOptsStore().payModesOpts

let originPayModes:PayModesItem[] = PayModeOptions
const payModes=ref<PayModesItem[]>([])

const channelOpts = ref<ChannelListResponse[]>([])
const state=reactive({
  isCreateLoading:false,
  isCheckOrderStatus:false,
  orderIsPaySuccess:false,
  orderStatusCheckInterval:null,
  current:0,
})
const fromData=reactive<ChannelTestRequest>({
  //  isWebCashier:true,
   amount:0.1,
   channelId: null,
  //  payMode: null
})
const orderInfo=reactive<any>({})

const allChannelListRequest = ref<ALLChannelListRequest>({
  isIgnoreDisable: true
})


const onChannelChange=()=>{
  payModes.value = []
  // if(fromData.channelId){
  //   let payModesArr = channelOpts.value.find(v=>v.id==fromData.channelId).payModes
  //   originPayModes.map((item:PayModesItem) => {
  //     if (payModesArr.includes(item.payMode)) {
  //       payModes.value.push(item)
  //     }
  //   })
   
  //   fromData.payMode = payModes.value[0].payMode
  // }else {
  //   payModes.value=[]
  // }
}

const createOrder=()=>{
  formRef.value
      .validate()
      .then(() => {
        state.isCreateLoading=true
        channelTest(unref(fromData)).then(res=>{
          state.isCreateLoading=false
          Object.assign(orderInfo,res.data??{})
          state.current=1
        }).catch(err=>{
          state.isCreateLoading=false
        })
      })
}

const fetchALLChannelList = async () => {
  let res = await getALLChannelList(allChannelListRequest.value)
  channelOpts.value = res.data
  fromData['channelId']=id?parseInt(id):null
  onChannelChange()
}


const filterOption = (input: string, option: any) => {
  console.log('option', option)
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};


const doCheckPayOrderStatus=()=>{
  state.isCheckOrderStatus=true
  state.orderIsPaySuccess=false
  state.current=2
  state.orderStatusCheckInterval=setInterval(()=>{
    useGet<Boolean>(`/channel/payTest/orderStatus?orderNo=${orderInfo["orderNo"]}`).then(res=>{
      if(res.data){
        state.isCheckOrderStatus=false
        state.orderIsPaySuccess=true
        clearInterval(state.orderStatusCheckInterval)
      }
    })
  },1000)
  setTimeout(()=>{
    state.isCheckOrderStatus=false
    state.orderIsPaySuccess=false
    clearInterval(state.orderStatusCheckInterval)
  },30*1000)
}

const id=<string>route.query['id'] ?? ""
const isShowBackIcon = computed(()=> {
  console.log('!!id', !!id)
  return !!id
})
onMounted(()=>{
  fetchALLChannelList()
  // useGet("/channel/groupList").then(res=>{
  //   channelGroups.value=res.data??[]
  //   for(const item of channelGroups.value){
  //     channels=[...channels,...item['channels']]
  //   }
   
    
  // })
})
</script>

<template>
  
  <a-flex justify="center"  class="mt-10" >
   

    <a-flex vertical justify="center" align="center" style="width: 800px;padding: 15px;border-radius: 4px" >
      
      <a-card style="width: 100%;margin-bottom: 10px;">
        <a-flex align="center" justify="flex-start">
          <ArrowLeftOutlined v-show="isShowBackIcon"  @click="() => router.back()" style="font-size: 20px;padding-right: 10px;" />
          <a-page-header title="渠道测试" class="site-page-header" sub-title="" style="padding: 0;">

            <template #backIcon>
            
              
            </template>
          </a-page-header>
        </a-flex>
       
      </a-card>
      <a-card style="width: 100%;padding: 15px;">
        <a-steps :current="state.current" :items="items"></a-steps>
        <a-form ref="formRef"  v-show="state.current==0" class="mt-4" style="width: 80%" :model="fromData"  layout="vertical"   >
          <a-form-item  class="mt-2" label="支付渠道" name="channelId" :rules="{required:true,message:'请选择支付渠道'}">
            <a-select placeholder="选择支付渠道" :filter-option="filterOption"  show-search v-model:value="fromData.channelId" @change="onChannelChange">
              <a-select-option v-for="(item) in channelOpts" :value="item.id" :label="item.name">{{item.name}}</a-select-option>

              <!-- <a-select-opt-group v-for="(group,index) in channelGroups">
                <template #label>
                  <a-flex :gap="5" >
                    <AlipaySquareFilled v-if="[PayChannelType.ALI,PayChannelType.ALI_USER].includes(group.name)" style="color: dodgerblue;font-size: 18px"/>
                    <a-typography-text strong  style="font-size: 12px">{{getPayChannelTypeText(group.name)}}</a-typography-text >
                  </a-flex>
                
                </template>
                <a-select-option v-for="(item) in group.channels" :value="item.id">{{item.name}}</a-select-option>
              </a-select-opt-group> -->
            </a-select>
          </a-form-item>
        
          <!-- <a-form-item label="支付方式" name="payMode" :rules="{required:true,message:'请选择支付方式',trigger: 'change'}">
            <a-radio-group :disabled="fromData.channelId==null" v-model:value="fromData.payMode">
              <a-radio v-for="(item) in payModes" :value="item.payMode">{{item.payModeName}}</a-radio>
            </a-radio-group>
            <a-typography-text v-if="payModes.length == 0 && fromData.channelId==null" type="secondary">待选择支付渠道后显示</a-typography-text>
          </a-form-item> -->
          <!-- <a-form-item label="跳转方式" name="isWebCashier">
            <a-radio-group :disabled="fromData.channelId==null" v-model:value="fromData.isWebCashier">
              <a-radio :value="false">原生</a-radio>
              <a-radio :value="true">Web收银台</a-radio>
            </a-radio-group>
          </a-form-item> -->
          <a-form-item label="支付金额" name="amount" :rules="{required:true,message:'请输入订单金额'}">
            <a-input-number :disabled="fromData.channelId==null" v-model:value="fromData.amount" :step="1" placeholder="请输入订单金额" style="width: 100%;"></a-input-number>
          </a-form-item>
          <a-flex justify="end" v-show="fromData.channelId!=null">
            <a-button type="link" @click="isExtend=!isExtend" > <DoubleRightOutlined :rotate="isExtend?270:90"/>{{isExtend?'收起更多选项':"展开更多选项"}} </a-button>
          </a-flex>
          <a-flex vertical v-if="isExtend" v-show="fromData.channelId!=null">
            <a-form-item label="商品标题">
              <a-input  placeholder="请输入商品标题" v-model:value="fromData.subject" style="width: 100%;"></a-input>
            </a-form-item>
            <a-form-item label="商品描述">
              <a-input  placeholder="请输入商品描述"  v-model:value="fromData.body" style="width: 100%;"></a-input>
            </a-form-item>
          </a-flex>
        </a-form>
        <a-flex  v-if="state.current==1" vertical justify="center" align="center" style="padding: 60px" :gap="10">
          <!-- <vue-qrcode :color="{}" :quality="1" :value="orderInfo['data']" :width="200" :margin="0"></vue-qrcode> -->

          <qrcode-vue
            :value="orderInfo['redirectUrl']"
            :level="qrLevel"
            :margin="0"
            :size="200"
            :render-as="renderAs"
            background="#000000"
            foreground='#fff'
          />
          <a-typography-text type="secondary">打开手机浏览器扫一扫</a-typography-text>
        </a-flex>

        <a-flex  v-if="state.current==2" vertical justify="center" align="center" style="height: 350px" :gap="10">
          <a-flex vertical :gap="10" v-if="state.isCheckOrderStatus" >
            <a-spin />
            <a-typography-text type="secondary">正在检测订单支付状态</a-typography-text>
          </a-flex>
          <a-flex vertical :gap="10" v-else justify="center" align="center" >
            <CloseCircleOutlined style="font-size: 24px;color: red"/>
            <a-typography-text type="secondary">订单检测超时,请确是否已支付</a-typography-text>
          </a-flex>
        </a-flex>
        <a-flex class="mt-4"  justify="center" align="center" :gap="10" >
          <a-button @click="createOrder" :loading="state.isCreateLoading" v-if="state.current==0" type="primary" class="mt-0" size="large" style="width: 250px">下一步</a-button>
          <a-button @click="state.current=0" v-if="state.current==1" class="mt-0" size="large" style="width: 250px">上一步</a-button>
          <a-button @click="doCheckPayOrderStatus"  type="primary" v-if="state.current==1" class="mt-0" size="large" style="width: 250px">确认支付</a-button>
        </a-flex>
      </a-card>
      
    </a-flex>
  </a-flex>


</template>

<style scoped lang="less">

</style>