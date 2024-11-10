<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";

import {PayChannelTypeSelectOption, PayModeTypeSelectOption, DateRange} from "@/utils/constant.ts";
import {OrderSearch, searchOrder,OrderTableType} from "~/api/order/OrderInterface.ts";
import { getChannelInfo, ChannelInfo, } from '~/api/channel/ChannelInterface'
import OrderTablePanel from "~/pages/order/components/order-table-panel.vue";
import {FileSearchOutlined } from "@ant-design/icons-vue"
import { getALLChannelList,ChannelListResponse, ALLChannelListRequest, } from "~/api/channel/ChannelInterface.ts";
import { updateParamsToUrl, getParamsFromUrl, flatten, unflatten} from '@/utils/tools'
import orderStatistics from "~@/components/analysis/order-statistics.vue";
import { OrderStatisticsEnum } from '@/api/order/statistics'

import { DateSearchTypeEnum} from '@/components/date-search-wrap/type'
const DateSearchWrapRef = ref()

const router=useRouter()
const route = useRoute()
const {id}= route.query
const state=reactive({
  isShowData: localStorage.getItem('showChannelOrderStatistics') ? JSON.parse(localStorage.getItem('showChannelOrderStatistics')) : false,
  dataSourceLoading:false,
  isConfirmLoading:false
})
const tableRef=ref()

const inntSearchParams = ():OrderSearch => {
    return {
        page:1,
        limit:10,
        channelId: id,
        dateType:null
    } as OrderSearch
}
const searchParams = ref<OrderSearch>(inntSearchParams())

const info = ref<ChannelInfo>({})

const resetSearch=async ()=>{
  searchParams.value = inntSearchParams()
  DateSearchWrapRef.value.handleFormReset()
  tableRef.value.resetSearch(searchParams.value)
}

const getInfo=async (id:string)=>{
  state.dataSourceLoading=true
  const {data} =await getChannelInfo(id)
  info.value = data
  
  state.dataSourceLoading=false
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
  console.log('option', option)
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const dateChange = (dateRange: DateRange,dateType: DateSearchTypeEnum) => {
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
watch(() => state.isShowData, (val) => {
  localStorage.setItem('showChannelOrderStatistics', JSON.stringify(val))
})

watch(() => searchParams.value.orderStatus, () => {
  tableRef.value.refresh(searchParams.value)
})

let defaultDateRange = ref<DateRange>(null)


onBeforeMount(()=>{
    getInfo(`${id}`)
    
    
    if (getParamsFromUrl()) {
      searchParams.value = Object.assign(searchParams.value, getParamsFromUrl())
    }


    if (searchParams.value.startDate) {
      defaultDateRange.value = {
        startDate: searchParams.value.startDate,
        endDate: searchParams.value.endDate
      } 
    }

    // fetchALLChannelList()
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!-- <a-card style="border: none" :body-style="{padding:'15px'}">
      <a-flex vertical :gap="15">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="4">
            <a-input  v-model:value="searchParams.orderNo"  allow-clear placeholder="请输入订单编号"> </a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-input  v-model:value="searchParams.mchOrderNo"  allow-clear placeholder="按商家订单号查询"> </a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-input  v-model:value="searchParams.channelOrderNo"  allow-clear placeholder="按渠道订单号查询"> </a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-select style="width: 100%" mode="multiple" allow-clear :max-tag-count="2" v-model:value="searchParams.channelTypes" placeholder="所有渠道">
              <a-select-option v-for="(item) in PayChannelTypeSelectOption" :value="item.value">{{item.title}}</a-select-option>
            </a-select>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-select style="width: 100%" mode="multiple" allow-clear :max-tag-count="1" v-model:value="searchParams.payModes" placeholder="所有支付方式">
              <a-select-option v-for="(item) in PayModeTypeSelectOption" :value="item.value">{{item.title}}</a-select-option>
            </a-select>
          </a-col>
          <a-col class="gutter-row" :span="4">
             <a-input placeholder="请输入渠道ID"></a-input>
          </a-col>
        </a-row>

        <a-flex justify="flex-start" align="center"  :gap="10" >

          
        
          <a-button type="primary" size="small" style="width: 80px;height:27.99px"  @click="tableRef.refresh(searchParams)">搜索</a-button>
          
          <a-button type="link" style="padding-left: 0px" @click="resetSearch">重置搜索</a-button>
          <a-space>
            <a-typography-text type="secondary">是否展示统计数据</a-typography-text>
            <a-checkbox v-model:checked="state.isShowData"></a-checkbox>
          </a-space>
        </a-flex>
      </a-flex>
    </a-card> -->

    <a-card style="border: none" :body-style="{padding:'15px'}">
      <a-flex vertical :gap="15">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="4">
            <a-input  v-model:value="searchParams.orderNo"  allow-clear placeholder="按订单编号查询"> </a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-input  v-model:value="searchParams.mchOrderNo"  allow-clear placeholder="按商家订单号查询"> </a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-input  v-model:value="searchParams.channelOrderNo"  allow-clear placeholder="按渠道订单号查询"> </a-input>
          </a-col>
          <!-- <a-col class="gutter-row" :span="4">
            <a-select style="width: 100%" mode="multiple" allow-clear :max-tag-count="2" v-model:value="searchParams.channelTypes" placeholder="按渠道类型查询">
              <a-select-option v-for="(item) in PayChannelTypeSelectOption" :value="item.value">{{item.title}}</a-select-option>
            </a-select>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-select placeholder="按支付渠道筛选" :filter-option="filterOption"  show-search v-model:value="searchParams.channelId"  allow-clear style="width: 100%;">
              <a-select-option v-for="(item) in channelOpts" :value="item.id" :label="item.name" >{{item.name}}</a-select-option>
            </a-select>
          </a-col> -->
          <a-col class="gutter-row" :span="4">
            <a-select style="width: 100%" mode="multiple" allow-clear :max-tag-count="1" v-model:value="searchParams.payModes" placeholder="按支付方式查询">
              <a-select-option v-for="(item) in PayModeTypeSelectOption" :value="item.value">{{item.title}}</a-select-option>
            </a-select>
          </a-col>

          <a-col class="gutter-row" :span="24">
            <date-search-wrap @date-change="dateChange" :default-range-date="defaultDateRange" :default-date-type="searchParams.dateType" ref="DateSearchWrapRef" />
          </a-col>
          
        </a-row>

        <a-flex justify="flex-start" align="center"  :gap="10" >
          <a-button type="link" style="padding-left: 0px" @click="resetSearch">重置筛选</a-button>
          <a-button type="primary" size="small" style="width: 80px;height:27.99px"  @click="tableRef.refresh(searchParams)">
            <template #icon>
              <FileSearchOutlined />
            </template>
            筛选
          </a-button>
          
          <a-space>
            <a-typography-text type="secondary">是否展示统计数据</a-typography-text>
            <a-tooltip>
                <template #title>勾选展示当前渠道订单统计数据</template>
                <a-checkbox v-model:checked="state.isShowData"></a-checkbox>
            </a-tooltip>
          </a-space>
          
        </a-flex>
      </a-flex>
    </a-card>
  
    <order-statistics v-model:isShow="state.isShowData" :type="OrderStatisticsEnum.channel"></order-statistics>
    <a-card >
      <a-tabs destroy-inactive-tab-pane >
        <a-tab-pane key="all" tab="全部">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.ALL" :is-diabled-chnnnel-info="true" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="waitPay" tab="待支付">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.WAIT_PAY" :is-diabled-chnnnel-info="true" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="payIng" tab="支付中">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.PAY_ING" :is-diabled-chnnnel-info="true" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="paySuccess" tab="成功">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.SUCCESS" :is-diabled-chnnnel-info="true" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="payFail" tab="失败">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.FAIL" :is-diabled-chnnnel-info="true" :search-params="searchParams"/>
        </a-tab-pane>
      </a-tabs>


    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>