<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";
import {
  OrderSearch,
  searchOrder,
  OrderTableType,
  OrderReportSearch,
  BaseOrderReportInfo, getOrderStatusText, OrderStatus
} from "~/api/order/OrderInterface.ts";
import OrderTablePanel from "~/pages/order/components/order-table-panel.vue";
import {PayChannelTypeSelectOption} from "~/utils/constant.ts";

const router=useRouter()
const editContentModalRef=ref(null)
const columns:ColumnsType =[
  {
    title: '时间',
    dataIndex: 'orderDate',
  },
  {
    title: '成交金额',
    dataIndex: 'totalSuccessAmount',
  },
  {
    title: '实收金额',
    dataIndex: 'totalPayAmount',
  },
  {
    title: '手续费',
    dataIndex: 'totalFree',
  },
  {
    title: '成交总笔数',
    dataIndex: 'totalRefundAmount',
  },
  {
    title: '交易笔数',
    dataIndex: 'currency',
  },
  {
    title: '成功率',
    dataIndex: 'mchFeeAmount',
  },
  {
    title:'渠道数量',
    dataIndex: 'channel',
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
const dataSource=shallowRef<BaseOrderReportInfo>([])
onMounted(()=>{

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
          <a-col class="gutter-row" :span="3">
            <a-date-picker style="width: 100%" />
          </a-col>
          <a-col class="gutter-row" :span="3">
            <a-select style="width: 100%" v-model:value="searchParams.channels" :max-tag-count="1" placeholder="全部渠道方" allow-clear>
              <a-select-option v-for="(item) in PayChannelTypeSelectOption" :value="item.value">{{item.title}}</a-select-option>
            </a-select>
          </a-col>
          <a-col class="gutter-row" :span="3">
            <a-select style="width: 100%" v-model:value="searchParams.channelIds" :max-tag-count="1" placeholder="全部渠道" allow-clear>
            </a-select>
          </a-col>
        </a-row>

        <a-flex justify="flex-start" :gap="0">
          <a-button type="link" style="padding-left: 0px" @click="resetSearch">重置筛选</a-button>

        </a-flex>
      </a-flex>
    </a-card>
    <a-card >
      <a-table style="width: 100%" :scroll="{ x: 1200 }"  :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
        <template #emptyText>
          <a-empty></a-empty>
        </template>

      </a-table>

    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>