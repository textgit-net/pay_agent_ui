<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";
import { DateRange, PayChannelTypeSelectOption, PayModeTypeSelectOption, } from '@/utils/constant'
import {OrderSearch, searchOrder,OrderTableType} from "~/api/order/OrderInterface.ts";
import OrderTablePanel from "~/pages/order/components/order-table-panel.vue";
import DateSearchWrap from '@/components/date-search-wrap/index.vue'
import { getALLChannelList,ChannelListResponse, ALLChannelListRequest, } from "~/api/channel/ChannelInterface.ts";
import {FileSearchOutlined } from '@ant-design/icons-vue';
const DateSearchWrapRef = ref()
const router=useRouter()
const state=reactive({
  dataSourceLoading:false,
  isConfirmLoading:false
})
const tableRef=ref()

const inntSearchParams = ():OrderSearch => {
    return {
        page:1,
        limit:10,
    } as OrderSearch
}
const searchParams = ref<OrderSearch>(inntSearchParams())

const resetSearch=async ()=>{
  searchParams.value = inntSearchParams()
  DateSearchWrapRef.value.handleFormReset()
  tableRef.value.resetSearch(searchParams.value)
}

const handleSearch = () => {
  tableRef.value.refresh(searchParams)
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
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>订单列表</a-typography-text>
      </a-flex>
    </a-card>
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
        <a-tab-pane key="all" tab="全部">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.ALL" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="waitPay" tab="待支付">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.WAIT_PAY" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="payIng" tab="支付中">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.PAY_ING" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="paySuccess" tab="支付成功">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.SUCCESS" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="payFail" tab="支付失败">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.FAIL" :search-params="searchParams"/>
        </a-tab-pane>
      </a-tabs>


    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>