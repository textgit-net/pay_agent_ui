<script setup lang="ts">
import {DoubleRightOutlined} from '@ant-design/icons-vue'
import {PayChannelTypeSelectOption} from "~/utils/constant.ts";
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
  <a-flex justify="center" align="center" class="mt-10" >
    <a-form ref="formRef" style="width: 800px;background: white;padding: 15px;border-radius: 4px" :model="fromData"  layout="vertical"   >
      <a-typography-text strong >订单参数</a-typography-text>
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
      <a-flex class="mt-4"  justify="center" align="center" vertical >
        <a-button type="primary" class="mt-0" size="large" style="width: 250px">创建订单</a-button>
      </a-flex>
    </a-form>
  </a-flex>
</template>

<style scoped lang="less">

</style>