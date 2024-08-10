<script setup lang="ts">
import {DoubleRightOutlined} from '@ant-design/icons-vue'
import {PayChannelTypeSelectOption} from "~/utils/constant.ts";
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
const current=ref(0)
interface ChannelGroup{
  name:string,
  channels:any[],
  payModes:any[]

}
const isExtend=ref(false)
const router=useRouter()
var channels = [];
const payModes=shallowRef<any[]>([])
const channelGroups=shallowRef<ChannelGroup[]>([])
const fromData=reactive<{
  channelId?:any,
  isWebCashier:boolean,
  amount:number
}>({
   channelId:null,
   isWebCashier:false,
   amount:0.1
})

const onChannelChange=()=>{
  if(fromData.channelId){
    payModes.value= channels.find(v=>v.id==fromData.channelId).payModes
  }else {
    payModes.value=[]
  }
}

const createOrder=()=>{

}
onMounted(()=>{
  useGet("/channel/groupList").then(res=>{
    channelGroups.value=res.data??[]
    for(const item of channelGroups.value){
      channels=[...channels,...item['channels']]
    }
    const id=<string>router.currentRoute.value.query['id'] ?? ""
    fromData['channelId']=id?parseInt(id):null
    onChannelChange()
  })
})
</script>

<template>

  <a-flex justify="center"   class="mt-10" >
    <a-flex vertical justify="center" align="center" style="width: 800px;background: white;padding: 15px;border-radius: 4px" >
      <a-steps :current="current" :items="items"></a-steps>
      <a-form ref="formRef"  v-show="current==0" class="mt-4" style="width: 80%" :model="fromData"  layout="vertical"   >
        <a-form-item  class="mt-2" label="支会渠道" name="channelId" :rules="{required:true,message:'请选择支付渠道'}">
          <a-select placeholder="选择支付渠道" v-model:value="fromData.channelId" @change="onChannelChange">
            <a-select-opt-group v-for="(group,index) in channelGroups">
              <template #label>
                <span> {{ group.name }} </span>
              </template>
              <a-select-option v-for="(item) in group.channels" :value="item.id">{{item.name}}</a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-item>
        <a-form-item label="跳转方式" name="isWebCashier">
          <a-radio-group v-model:value="fromData.isWebCashier">
            <a-radio :value="false">直连</a-radio>
            <a-radio :value="true">Web收银台</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="支付方式" :rules="{required:true,message:'请选择支付渠道'}">
          <a-select placeholder="请选择支付方式">
            <a-select-option v-if="fromData.isWebCashier" value="ALL">聚合支付</a-select-option>
            <a-select-option v-for="(item) in payModes"  :value="item.value">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="支付金额" name="amount" :rules="{required:true,message:'请输入订单金额'}">
          <a-input-number v-model:value="fromData.amount" :step="1" placeholder="请输入订单金额" style="width: 100%;"></a-input-number>
        </a-form-item>
        <a-flex justify="end">
          <a-button type="link" @click="isExtend=!isExtend" > <DoubleRightOutlined :rotate="isExtend?270:90"/>{{isExtend?'收起更多选项':"展开更多选项"}} </a-button>
        </a-flex>
        <a-flex vertical v-if="isExtend">
          <a-form-item label="商品标题">
            <a-input  placeholder="商品标题" style="width: 100%;"></a-input>
          </a-form-item>
          <a-form-item label="商品标题">
            <a-input  placeholder="商户内容" style="width: 100%;"></a-input>
          </a-form-item>
        </a-flex>
      </a-form>
      <a-flex  v-if="current==1" vertical justify="center" align="center" style="padding: 60px" :gap="10">
        <vue-qrcode :color="{}" :quality="1" value="fsdfsdfdsfsdfsdfs" :width="200" :margin="0"></vue-qrcode>
        <a-typography-text type="secondary">打开手机浏览器扫一扫</a-typography-text>
      </a-flex>
      <a-flex class="mt-4"  justify="center" align="center" :gap="10" >
        <a-button @click="current=1" v-if="current==0" type="primary" class="mt-0" size="large" style="width: 250px">下一步</a-button>
        <a-button @click="current=0" v-if="current==1" class="mt-0" size="large" style="width: 250px">上一步</a-button>
        <a-button @click="current=2" type="primary" v-if="current==1" class="mt-0" size="large" style="width: 250px">确认支付</a-button>
      </a-flex>
    </a-flex>
  </a-flex>


</template>

<style scoped lang="less">

</style>