<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {AccessEnum} from "~/utils/constant.ts";
import {getOrderStatusText, OrderSearch, OrderStatus, OrderTableType, searchOrder} from "~/api/order/OrderInterface.ts";
import {PaginationProps} from "ant-design-vue";


const columns =shallowRef<any[]>(
    [
      {
        title: '订单编号',
        dataIndex: 'id',
        width: '150px',
        align:'left',
        fixed: 'left',
        tableTypes:[OrderTableType.ALL]
      },
      {
        title: '商家订单号',
        dataIndex: 'mchOrderNo',
        width: '180px',
        ellipsis:true,
        align:'left',
        fixed: 'left',
        tableTypes:[OrderTableType.ALL]
      },
      {
        title: '商户信息',
        align:'center',
        dataIndex: 'mchInfo',
        tableTypes:[OrderTableType.PAY_ING,OrderTableType.SUCCESS,OrderTableType.FAIL],
      },
      {
        title: '商品标题',
        align:'center',
        dataIndex: 'subject',
        tableTypes:[OrderTableType.ALL]
      },

      {
        title: '订单金额',
        align:'center',
        dataIndex: 'amount',
        tableTypes:[OrderTableType.ALL]
      },
      {
        title: '币种',
        align:'center',
        dataIndex: 'currency',
        tableTypes:[OrderTableType.ALL]
      },
      {
        title: '商户手续费',
        align:'center',
        dataIndex: 'mchFeeAmount',
        tableTypes:[OrderTableType.PAY_ING,OrderTableType.SUCCESS,OrderTableType.FAIL],
      },

      {
        title: '订单状态',
        align:'center',
        dataIndex: 'orderStatus',
        tableTypes:[OrderTableType.ALL]
      },
      {
        title: '渠道订单号',
        align:'center',
        dataIndex: 'channelOrderNo',
        tableTypes:[OrderTableType.PAY_ING,OrderTableType.SUCCESS,OrderTableType.FAIL],
      },
      {
        title: '完成时间',
        align:'center',
        dataIndex: 'successTime',
        tableTypes:[OrderTableType.PAY_ING,OrderTableType.SUCCESS,OrderTableType.FAIL],
      },
      {
        title: '创建时间',
        align:'center',
        dataIndex: 'createdTime',
        tableTypes:[OrderTableType.ALL]
      }
    ]
)
const searchParams=reactive<OrderSearch>({
  page: 1,
  limit:10
})
const props=defineProps<{
  tableType: number   | OrderTableType
}>()
const state=reactive({
  dataSourceLoading:false
})
const dataSource=shallowRef<any[]>([])
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
const getOrderStatus=():OrderStatus[]=>{
  switch (props.tableType){
    case OrderTableType.ALL:
      return []
    case OrderTableType.WAIT_PAY:
      return [OrderStatus.WAIT_PAY]
    case OrderTableType.PAY_ING:
      return [OrderStatus.PAY_ING]
    case OrderTableType.SUCCESS:
      return [OrderStatus.SUCCESS]
    case OrderTableType.FAIL:
      return [OrderStatus.FAIL,OrderStatus.CANCEL,OrderStatus.CLOSE]
  }
}
const loadData=async  ()=> {
  if (state.dataSourceLoading)
    return
  state.dataSourceLoading = true
  try {
    const { data } = await searchOrder({
      ...searchParams,
      orderStatus:getOrderStatus(),
      page: pagination.current,
      limit: pagination.pageSize,
    })
    dataSource.value = data?.rows ?? []
    pagination.total = data?.total ?? 0
  }
  finally {
    state.dataSourceLoading = false
  }
}
const refresh=async(search:OrderSearch)=>{
    Object.assign(searchParams,search)
    await loadData()
}
defineExpose({refresh})
onMounted(()=>{
  loadData()
})

</script>

<template>
  <div style="width: 100%;">
    <a-table style="width: 100%" :scroll="{ x: 1200 }"  :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns.filter(v=>v.tableTypes.includes(OrderTableType.ALL)||v.tableTypes.includes(tableType))" size="middle" :bordered="false">
      <template #emptyText>
        <a-empty></a-empty>
      </template>
      <template #bodyCell="{ column , record}">


        <template v-if="column.dataIndex==='orderStatus'">
          {{getOrderStatusText(record['orderStatus'] as OrderStatus)}}
        </template>
        <template v-if="column.dataIndex==='channelCount'">
          {{record['channelCount']|| '--' }}
        </template>
        <template v-if="column.dataIndex==='action'">
          <a-flex :gap="5">

          </a-flex>
        </template>
      </template>
    </a-table>
  </div>

</template>

<style scoped lang="less">

</style>