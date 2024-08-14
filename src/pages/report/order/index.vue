<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table"
import {PaginationProps} from "ant-design-vue"
import {
  OrderSearch,
  searchOrder,
  OrderTableType,
  OrderReportSearch,getOrderStatusText, OrderStatus, getOrderReportData
} from "~/api/order/OrderInterface.ts"
import OrderTablePanel from "~/pages/order/components/order-table-panel.vue"
import dayjs, { Dayjs } from 'dayjs'
import {PayChannelTypeSelectOption} from "~/utils/constant.ts"
const dateFormat = 'YYYY-MM-DD'
type RangeValue = [Dayjs, Dayjs];
const reportDate =ref<RangeValue>([
  dayjs(dayjs().subtract(31,'day'), dateFormat),
  dayjs(dayjs(), dateFormat),
]);
const disabledDate = (current: Dayjs) => {
  if (!reportDate.value || (reportDate.value as any).length === 0) {
    return false;
  }
  const tooLate = reportDate.value[0] && current.diff(reportDate.value[0], 'days') > 31;
  const tooEarly = reportDate.value[1] && reportDate.value[1].diff(current, 'days') > 31;
  return tooEarly || tooLate;
};
const router=useRouter()
const columns:ColumnsType =[
  {
    title: '时间',
    dataIndex: 'orderDate',
  },
  {
    title: '交易总额',
    dataIndex: 'totalOrderAmount',
  },
  {
    title: '实收金额',
    dataIndex: 'totalSuccessOrderAmount',
  },
  {
    title: '手续费',
    dataIndex: 'totalFeeAmount',
  },
  {
    title: '交易笔数',
    dataIndex: 'totalOrderCount',
  },
  {
    title:'成交笔数',
    dataIndex:'totalSuccessOrderCount'
  },
  {
    title:'超时笔数',
    dataIndex:'totalSuccessOrderCount'
  },
  {
    title:'异常笔数',
    dataIndex:'totalSuccessOrderCount'
  },
  {
    title: '成功率',
    dataIndex: 'successRate',
  }
]
const state=reactive({
  dataSourceLoading:false,
  isConfirmLoading:false
})
const pagination = reactive<PaginationProps>({
  pageSize: 10,
  pageSizeOptions: ['10', '20', '30', '40'],
  current: 1,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: total => `总数据位：${total}`,
  onChange(current, pageSize) {
    pagination.pageSize = pageSize
    pagination.current = current

  },
})
const searchParams = reactive<OrderReportSearch>({
  page:1,
  limit:10
})
const dataSource=shallowRef<any>([])
const resetSearch=async ()=>{
  Object.assign(searchParams,{
    page:1,
    limit:10
  })
  await loadData()
}
const loadData=async  ()=> {
  if (state.dataSourceLoading)
    return
  state.dataSourceLoading = true
  try {
    const { data } = await getOrderReportData({
      ...searchParams,
      page: pagination.current,
      startDate:reportDate.value[0].format(dateFormat),
      endDate:reportDate.value[1].format(dateFormat),
      limit: pagination.pageSize,
    })
    dataSource.value = data?.rows ?? []
    pagination.total = data?.total ?? 0
  }catch (e){
    console.error(e)
  }finally{
    state.dataSourceLoading = false
  }

}
onMounted(()=>{
  loadData()
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
            <a-range-picker style="width: 100%" v-model:value="reportDate" :format="dateFormat"  :disabled-date="disabledDate"/>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-select style="width: 100%" v-model:value="searchParams.channels" :max-tag-count="1" placeholder="全部渠道方" allow-clear>
              <a-select-option v-for="(item) in PayChannelTypeSelectOption" :value="item.value">{{item.title}}</a-select-option>
            </a-select>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-select style="width: 100%" v-model:value="searchParams.channelIds" :max-tag-count="1" placeholder="全部渠道" allow-clear>
            </a-select>
          </a-col>
        </a-row>

        <a-flex justify="flex-start" :gap="0">
          <a-button type="link" style="padding-left: 0px" @click="resetSearch">重置筛选</a-button>
          <a-button type="primary" size="small" style="width: 80px;height:27.99px"  @click="loadData">筛选</a-button>
        </a-flex>
      </a-flex>
    </a-card>
    <a-card >
      <a-table style="width: 100%" :scroll="{ x: 1200 }"  :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
        <template #emptyText>
          <a-empty></a-empty>
        </template>
        <template #bodyCell="{ column , record}">
            <template v-if="column.dataIndex==='successRate'">
              {{record.totalSuccessOrderCount/record.totalOrderCount}}%
            </template>
        </template>
      </a-table>

    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>