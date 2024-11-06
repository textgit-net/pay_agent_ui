<script setup lang="ts">
import { DateRange,PayChannelTypeSelectOption} from '@/utils/constant'
import { DateSearchTypeEnum} from '@/components/date-search-wrap/type'
import WithdrawRecordTable from "~/pages/channel/components/withdraw-record-table.vue";
import DateSearchWrap from '@/components/date-search-wrap/index.vue'
import { getALLChannelList,ChannelListResponse, ALLChannelListRequest, } from "~/api/channel/ChannelInterface.ts";
import {FileSearchOutlined } from '@ant-design/icons-vue';
import { getParamsFromUrl,} from '@/utils/tools'
import { DebtOrderStatusEnum, getDebtOrderStatusEnumText,DebtOrderTableTypeEnum, BaseDebtAccountOrderSearch, getDebtOrderTableTypeEnumText } from '@/api/debt/order'

import {getChannelWithdrawRecord,ChannelWithdrawSearch,getChannelWithdrawTableTypeEnumText,ChannelWithdrawTableTypeEnum} from '@/api/channel/withdraw'

const DateSearchWrapRef = ref()
const router=useRouter()
const state=reactive({
  dataSourceLoading:false,
  isConfirmLoading:false
})
const tableRef=ref()

const inntSearchParams = ():ChannelWithdrawSearch => {
    return {
        page:1,
        limit:10,
        dateType:null
    } as ChannelWithdrawSearch
}
const searchParams = ref<ChannelWithdrawSearch>(inntSearchParams())

const resetSearch=async ()=>{
  searchParams.value = inntSearchParams()
  DateSearchWrapRef.value.handleFormReset()
  tableRef.value.resetSearch(searchParams.value)
}

const handleSearch = () => {
  tableRef.value.refresh(searchParams.value)
}

const allChannelListRequest = ref<ALLChannelListRequest>({
  isIgnoreDisable: true
})
const channelOpts = ref<ChannelListResponse[]>([])

const fetchALLChannelList = async () => {
  let res = await getALLChannelList(allChannelListRequest.value)
  channelOpts.value = res.data
}

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

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


watch(() => searchParams.value.status, () => {
  tableRef.value.refresh(searchParams.value)
})
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
  
  fetchALLChannelList()
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>渠道提现记录列表</a-typography-text>
      </a-flex>
    </a-card>
    <a-card style="border: none" :body-style="{padding:'15px'}">
      <a-flex vertical :gap="15">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="5">
            <a-input  v-model:value="searchParams.applyBy"  allow-clear placeholder="按申请人ID查询"> </a-input>
          </a-col>
          <a-col class="gutter-row" :span="5">
            <a-input  v-model:value="searchParams.accountNo"  allow-clear placeholder="按收款账户查询"> </a-input>
          </a-col>
          
          <a-col class="gutter-row" :span="5">
            <a-select placeholder="按支付渠道筛选" :filter-option="filterOption"  show-search v-model:value="searchParams.channelId"  allow-clear style="width: 100%;">
              <a-select-option v-for="(item) in channelOpts" :value="item.id" :label="item.name" >{{item.name}}</a-select-option>
            </a-select>
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
      <a-tabs destroy-inactive-tab-pane >
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.ALL" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.ALL)">
          <withdraw-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.ALL" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.AUDIT" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.AUDIT)">
          <withdraw-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.AUDIT" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.PROCESS" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.PROCESS)">
          <withdraw-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.PROCESS" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.TRANSFER" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.TRANSFER)">
          <withdraw-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.TRANSFER" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.SUCCESS" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.SUCCESS)">
          <withdraw-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.SUCCESS" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.TRANSFER_FAIL" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.TRANSFER_FAIL)">
          <withdraw-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.TRANSFER_FAIL" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane :key="ChannelWithdrawTableTypeEnum.AUDIT_REJECT" :tab="getChannelWithdrawTableTypeEnumText(ChannelWithdrawTableTypeEnum.AUDIT_REJECT)">
          <withdraw-record-table ref="tableRef" :table-type="ChannelWithdrawTableTypeEnum.AUDIT_REJECT" :search-params="searchParams"/>
        </a-tab-pane>
        
      </a-tabs>
    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>