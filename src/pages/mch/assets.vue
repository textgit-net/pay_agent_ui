<script setup lang="ts">
import { DateRange} from '@/utils/constant'
import { DateSearchTypeEnum} from '@/components/date-search-wrap/type'
import WalletRecordTable from "~/pages/mch/component/wallet-record-table.vue";
import DateSearchWrap from '@/components/date-search-wrap/index.vue'
import {FileSearchOutlined } from '@ant-design/icons-vue';
import { getParamsFromUrl,} from '@/utils/tools'
import {MerchantInfo, getMerchantInfo } from '~/api/merchant'
import {ChannelWithdrawTableTypeEnum} from '@/api/channel/withdraw'
import {MchwalletRecordRequest,getWalletRecord,WallTypeEnum,} from '@/api/merchant/wallet'

const DateSearchWrapRef = ref()
const route=useRoute()
const {id}= route.query
const state=reactive({
  dataSourceLoading:false,
  isConfirmLoading:false,
  isLoading: false
})
const tableRef=ref()

const inntSearchParams = ():MchwalletRecordRequest => {
    return {
        page:1,
        limit:10,
        mchId: id,
        dateType:null,
        wallType: WallTypeEnum.transDeposit
    } as MchwalletRecordRequest
}
const searchParams = ref<MchwalletRecordRequest>(inntSearchParams())

const resetSearch=async ()=>{
  searchParams.value = inntSearchParams()
  DateSearchWrapRef.value.handleFormReset()
  tableRef.value.resetSearch(searchParams.value)
}

const handleSearch = () => {
  tableRef.value.refresh(searchParams.value)
}


const dateChange = (dateRange: DateRange, dateType: DateSearchTypeEnum) => {
  searchParams.value.dateType = dateType
  if (dateRange) {
    searchParams.value.startDate = dateRange.startDate
    searchParams.value.endDate = dateRange.endDate
  } else {
    searchParams.value.startDate = null
    searchParams.value.endDate = null
  }
  
  tableRef.value.refresh(searchParams.value)
}

const formData=reactive<MerchantInfo>({})
const getInfo=async ()=>{
  state.isLoading=true
  const {data} =await getMerchantInfo(`${id}`)
  Object.assign(formData, data)
  
  state.isLoading=false
}


// watch(() => searchParams.value.status, () => {
//   tableRef.value.refresh(searchParams.value)
// })
let defaultDateRange = ref<DateRange>(null)

onBeforeMount(()=>{
  if (getParamsFromUrl()) {
    searchParams.value = Object.assign(searchParams.value, getParamsFromUrl())
  }

  if (searchParams.value.startDate) {
    defaultDateRange.value = {
      startDate: searchParams.value.startDate,
      endDate: searchParams.value.endDate
    } 
  }
  getInfo()
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <a-card :body-style="{padding:'15px'}" :loading="state.isLoading">
      <a-descriptions :column="4" layout="vertical">
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999','margin-top': '14px'}"  label="代付保证金">￥{{ formData.transDepositAmount }}</a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999','margin-top': '14px'}"  label="累计代付保证金">￥{{ formData.totalTransDepositAmount }}</a-descriptions-item>
      </a-descriptions>
     
    </a-card>
    <a-card style="border: none" :body-style="{padding:'15px'}">
      <a-flex vertical :gap="15">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="5">
            <a-input  v-model:value="searchParams.bizNo"  allow-clear placeholder="按流水号查询"> </a-input>
          </a-col>

          <a-col class="gutter-row" :span="24">
            <date-search-wrap :default-date-type="searchParams.dateType" :default-range-date="defaultDateRange"  @date-change="dateChange" ref="DateSearchWrapRef" />
          </a-col>
          
        </a-row>

        <a-flex justify="flex-start" align="center"  :gap="10" >
          <a-button type="link" style="padding-left: 0px" @click="resetSearch">重置筛选</a-button>
          <a-button type="primary" size="small" style="width: 80px;height:27.99px"  @click="handleSearch">
            <template #icon>
              <FileSearchOutlined />
            </template>
            筛选
          </a-button>
        </a-flex>
      </a-flex>
    </a-card>
    <a-card >
      <wallet-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.ALL" :search-params="searchParams" :is-diabled-chnnnel-info="true" />
      <!-- <a-tabs destroy-inactive-tab-pane >
       
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.ALL" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.ALL)">
          <wallet-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.ALL" :search-params="searchParams" :is-diabled-chnnnel-info="true" />
        </a-tab-pane>
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.AUDIT" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.AUDIT)">
          <wallet-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.AUDIT" :search-params="searchParams" :is-diabled-chnnnel-info="true"/>
        </a-tab-pane>
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.PROCESS" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.PROCESS)">
          <wallet-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.PROCESS" :search-params="searchParams" :is-diabled-chnnnel-info="true"/>
        </a-tab-pane>
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.TRANSFER" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.TRANSFER)">
          <wallet-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.TRANSFER" :search-params="searchParams" :is-diabled-chnnnel-info="true"/>
        </a-tab-pane>
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.SUCCESS" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.SUCCESS)">
          <wallet-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.SUCCESS" :search-params="searchParams" :is-diabled-chnnnel-info="true"/>
        </a-tab-pane>
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.TRANSFER_FAIL" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.TRANSFER_FAIL)">
          <wallet-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.TRANSFER_FAIL" :search-params="searchParams" :is-diabled-chnnnel-info="true"/>
        </a-tab-pane>
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.AUDIT_REJECT" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.AUDIT_REJECT)">
          <wallet-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.AUDIT_REJECT" :search-params="searchParams" :is-diabled-chnnnel-info="true"/>
        </a-tab-pane>
        
      </a-tabs> -->
    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>