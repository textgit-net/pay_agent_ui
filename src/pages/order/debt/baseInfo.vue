<script setup lang="ts">
import { reactive} from 'vue';
import { message } from 'ant-design-vue';
import {ContactWay, ContactWaySelectOption,getContactWayText} from "~/utils/constant.ts";
import { getChannelInfo, ChannelInfo, saveChannel,ChannelFormData } from '~/api/channel/ChannelInterface'
import { getDebtModeEnumText, getDebtStrategyEnumText } from '@/api/channel/debt'

import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  QuestionCircleFilled,
  LoadingOutlined,
  AlipaySquareFilled,
} from '@ant-design/icons-vue';

import { DebtOrderStatusEnum, getDebtOrderStatusEnumText,DebtOrderTableTypeEnum, BaseDebtAccountOrderSearch, DebtOrderInfo,getDebtAccountOrderInfo } from '@/api/debt/order'
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

const info = ref<DebtOrderInfo>({})

const getInfo=async (id:string)=>{
  state.isLoading=true
  const {data} =await getDebtAccountOrderInfo(id)
  info.value = data
  state.isLoading=false
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


    <a-card :body-style="{padding: '15px'}" :loading="state.isLoading">
      <a-descriptions :column="4" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>基础信息</a-typography-text>
            <!-- <a-button @click="handleShowBaseInfo" type="link">编辑</a-button> -->
          </a-flex>

        </template>

       
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="批号">
          <a-typography-text strong  style="font-size: 12px">{{ info.id }}</a-typography-text >
          </a-descriptions-item>

        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="订单号">
          <a-typography-text strong  style="font-size: 12px">{{info.orderId}}</a-typography-text >
        </a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="分账状态">
          <a-tag v-if="info.status===DebtOrderStatusEnum.WAIT_ING" :bordered="false" color="processing" >
              <template #icon>
                <clock-circle-outlined />
              </template>
              {{getDebtOrderStatusEnumText(info.status as DebtOrderStatusEnum)}}
            </a-tag>
            <a-tag v-if="info.status===DebtOrderStatusEnum.PROCESS" :bordered="false" color="warning" > 
              <template #icon>
                <sync-outlined :spin="true" />
              </template>
              {{getDebtOrderStatusEnumText(info.status as DebtOrderStatusEnum)}}
            </a-tag>
            <a-tag v-if="info.status===DebtOrderStatusEnum.SUCCESS" :bordered="false" color="success" >
              <template #icon>
                <check-circle-outlined />
              </template>{{getDebtOrderStatusEnumText(info.status as DebtOrderStatusEnum)}}
            </a-tag>
            <a-tag v-if="info.status===DebtOrderStatusEnum.FAIL" :bordered="false" color="error" >
              <template #icon>
                <close-circle-outlined />
              </template>{{getDebtOrderStatusEnumText(info.status as DebtOrderStatusEnum)}}
            </a-tag>
            <!-- <a-tooltip v-if="info.status== DebtOrderStatusEnum.FAIL">
              
              <template #title>点击查看订单状态错误信息</template>
              <QuestionCircleFilled @click="viewOrderStatusErrorInfo(info)" style="color: #ff4d4f;" />
            </a-tooltip> -->
        </a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="创建日期">{{ info.createTime }}</a-descriptions-item>
        
      </a-descriptions>

      <a-descriptions :column="4" layout="vertical" style="padding-top: 20px;">
          <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="订单金额">
            <a-typography-text strong type="danger"  style="font-size: 12px">￥{{info.orderAmount}}</a-typography-text >
          </a-descriptions-item>
          <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="分账笔数">
            <a-typography-text  style="font-size: 12px">{{info.splitCount}}</a-typography-text >
          </a-descriptions-item>
          <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="分账小计">
            <a-typography-text strong type="danger"  style="font-size: 12px">￥{{info.amount}}</a-typography-text >
          </a-descriptions-item>
          <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="分账金额">
            <a-tooltip>
                <template #title>成功金额</template>
                <a-typography-text type="success" strong> ￥{{ info.successAmount }}</a-typography-text>
            </a-tooltip> / 
            <a-tooltip>
                <template #title>总分账金额</template>
                <a-typography-text type="danger" strong>  ￥{{ info.totalRoyaltyAmount }}</a-typography-text>
            </a-tooltip>
          </a-descriptions-item>
          
        </a-descriptions>

        <a-descriptions :column="4" layout="vertical" style="padding-top: 20px;">
          <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="完成时间">
            <a-typography-text  style="font-size: 12px">{{info.finishTime?? '/'}}</a-typography-text >
          </a-descriptions-item>
        </a-descriptions>
    </a-card>

    <a-card :body-style="{padding: '15px'}" :loading="state.isLoading">
      <a-descriptions :column="4" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>分账配置信息</a-typography-text>
            <!-- <a-button @click="handleShowBaseInfo" type="link">编辑</a-button> -->
          </a-flex>

        </template>
       
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="分账模式">
          <a-typography-text>{{ getDebtModeEnumText(info.royaltyMode) }}</a-typography-text>
        </a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="分账策略">
          <a-typography-text style="padding-right: 20px;">{{ getDebtStrategyEnumText(info.royaltyStrategy) }}</a-typography-text>
        </a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="分账比率">
          <a-typography-text style="padding-right: 20px;">{{ info.royaltyRate }}%</a-typography-text>
        </a-descriptions-item>
        

      </a-descriptions>
    </a-card>

    <a-card :body-style="{padding: '15px'}" :loading="state.isLoading">
      <a-descriptions :column="4" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>所属渠道</a-typography-text>
            <!-- <a-button @click="handleShowBaseInfo" type="link">编辑</a-button> -->
          </a-flex>

        </template>
       
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="渠道名称">
          
          <a-typography-link v-if="info.channelId"  @click="router.push({path:'/channel/info',query:{id:info.channelId}})">{{info.chanelName}}</a-typography-link>
          <a-typography-text v-else type="secondary">/</a-typography-text>
        </a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="渠道ID">{{  info.channelId ? info.channelId : '/'  }}</a-descriptions-item>
        

      </a-descriptions>
    </a-card>

   

    <!-- <a-card :body-style="{padding: '15px'}">


      <a-descriptions :column="4" layout="vertical">
        <template #title>
          <a-flex  align="center">
            <a-typography-text>分账订单详细信息</a-typography-text>
          </a-flex>

        </template>
       
      </a-descriptions>
    </a-card> -->
  </div>
</template>

<style scoped lang="less">

</style>