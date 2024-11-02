<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";

import {PayChannelTypeSelectOption, PayModeTypeSelectOption, DateRange} from "@/utils/constant.ts";
import {OrderSearch, searchOrder,OrderTableType} from "~/api/order/OrderInterface.ts";
import { getChannelInfo, ChannelInfo, } from '~/api/channel/ChannelInterface'
import OrderTablePanel from "~/pages/order/components/order-table-panel.vue";
import {FileSearchOutlined } from "@ant-design/icons-vue"
import { getALLChannelList,ChannelListResponse, ALLChannelListRequest, } from "~/api/channel/ChannelInterface.ts";
import { init } from "~@/utils/page-bubble";
const DateSearchWrapRef = ref()

const router=useRouter()
const route = useRoute()
const {id}= route.query
const state=reactive({
  isShowData: true,
  dataSourceLoading:false,
  isConfirmLoading:false
})
const tableRef=ref()
const inntSearchParams = ():OrderSearch => {
    return {
        page:1,
        limit:10,
        agentId: `${id}`
    } as OrderSearch
}

const searchParams = ref<OrderSearch>(inntSearchParams())

const info = ref<ChannelInfo>({})

const resetSearch=async ()=>{
  searchParams.value = inntSearchParams()
  DateSearchWrapRef.value.handleFormReset()
  tableRef.value.resetSearch(searchParams.value)
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

const dateChange = (dateRange: DateRange) => {
  searchParams.value.dateRange = dateRange
  tableRef.value.refresh(searchParams.value)
}

watch(() => searchParams.value.orderStatus, () => {
  tableRef.value.refresh(searchParams.value)
})


onMounted(()=>{
    fetchALLChannelList()
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
          </a-col> -->
          <a-col class="gutter-row" :span="4">
            <a-select placeholder="按支付渠道筛选" :filter-option="filterOption"  show-search v-model:value="searchParams.channelId"  allow-clear style="width: 100%;">
              <a-select-option v-for="(item) in channelOpts" :value="item.id" :label="item.name" >{{item.name}}</a-select-option>
            </a-select>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-select style="width: 100%" mode="multiple" allow-clear :max-tag-count="1" v-model:value="searchParams.payModes" placeholder="按支付方式查询">
              <a-select-option v-for="(item) in PayModeTypeSelectOption" :value="item.value">{{item.title}}</a-select-option>
            </a-select>
          </a-col>

          <a-col class="gutter-row" :span="24">
            <date-search-wrap @date-change="dateChange" ref="DateSearchWrapRef" />
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
          <a-tooltip>
              <template #title>默认为展示订单统计数据，关闭的展示请进行勾选</template>
              <a-space>
                <a-typography-text type="secondary">是否展示统计数据</a-typography-text>
                <a-checkbox v-model:checked="state.isShowData"></a-checkbox>
              </a-space>
          </a-tooltip>
        </a-flex>
      </a-flex>
    </a-card>
    <a-card v-if="state.isShowData" :body-style="{padding: '15px'}">
        <a-descriptions :column="4" layout="vertical">
            <template #title>
                <a-flex  align="center">
                <a-typography-text>订单统计信息</a-typography-text>
                </a-flex>
            </template>
            <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="订单支付成功条数">
                <a-typography-text type="success" strong>  {{ info.successCount }}</a-typography-text>
            </a-descriptions-item>
            <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="订单支付累计条数">
                <a-typography-text type="danger" strong> {{ info.totalCount }}</a-typography-text>
            </a-descriptions-item>
           
            <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="订单支付成功金额">
                <a-typography-text type="success" strong> {{ info.successAmount }}</a-typography-text>
            </a-descriptions-item>
            <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}" label="订单支付累计金额">
                <a-typography-text type="danger" strong> {{ info.totalAmount }}</a-typography-text>
            </a-descriptions-item>
        </a-descriptions>
    </a-card>


    <a-card >
      <a-tabs destroy-inactive-tab-pane >
        <a-tab-pane key="all" tab="全部">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.ALL" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="waitPay" tab="待支付">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.WAIT_PAY" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="payIng" tab="支付中">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.PAY_ING" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="paySuccess" tab="成功">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.SUCCESS" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="payFail" tab="失败">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.FAIL" :search-params="searchParams"/>
        </a-tab-pane>
      </a-tabs>


    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>