<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {AccessEnum, getPayChannelTypeText, getPayModeTypeText, PayChannelType, PayModeType} from "~/utils/constant.ts";
import {CopyOutlined,AlipaySquareFilled} from '@ant-design/icons-vue'
import {getOrderStatusText, OrderSearch, OrderStatus, OrderTableType, searchOrder} from "~/api/order/OrderInterface.ts";
import {PaginationProps} from "ant-design-vue";


const columns =shallowRef<any[]>(
    [
      {
        title: '订单编号',
        dataIndex: 'id',
        align:'left',
        fixed: 'left',
        tableTypes:[OrderTableType.ALL]
      },
      {
        title: '商家订单号',
        dataIndex: 'mchOrderNo',
        align:'left',
        fixed: 'left',
        tableTypes:[OrderTableType.ALL]
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
        width: '60px',
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
        title: '渠道信息',
        align:'center',
        dataIndex: 'channelInfo',
        tableTypes:[OrderTableType.ALL],
      },
      {
        title: '支付方式',
        align:'center',
        dataIndex: 'payMode',
        tableTypes:[OrderTableType.ALL,OrderTableType.PAY_ING,OrderTableType.SUCCESS,OrderTableType.FAIL],
      },
      {
        title: '渠道订单号',
        align:'center',
        dataIndex: 'channelOrderNo',
        tableTypes:[OrderTableType.ALL,OrderTableType.PAY_ING,OrderTableType.SUCCESS,OrderTableType.FAIL],
      },
      {
        title: '完成时间',
        align:'center',
        dataIndex: 'successTime',
        tableTypes:[OrderTableType.ALL,OrderTableType.PAY_ING,OrderTableType.SUCCESS],
      },
      {
        title: '创建时间',
        align:'center',
        dataIndex: 'createdTime',
        tableTypes:[OrderTableType.ALL]
      },
      // {
      //   title: '操作',
      //   align:'center',
      //   dataIndex: 'action',
      //   tableTypes:[OrderTableType.ALL]
      // }
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
    <a-table style="width: 100%" :scroll="{ x: 1300 }"  :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns.filter(v=>v.tableTypes.includes(OrderTableType.ALL)||v.tableTypes.includes(tableType))" size="middle" :bordered="false">
      <template #emptyText>
        <a-empty></a-empty>
      </template>
      <template #bodyCell="{ column , record}">

        <template v-if="column.dataIndex==='orderStatus'">
          <template v-if="column.dataIndex==='orderStatus'">
            <a-tag v-if="record['orderStatus']===1" color="#0066ff" > {{getOrderStatusText(record['orderStatus'] as OrderStatus)}}</a-tag>
            <a-tag v-if="record['orderStatus']===2" color="#ff9933" > {{getOrderStatusText(record['orderStatus'] as OrderStatus)}}</a-tag>
            <a-tag v-if="record['orderStatus']===3" color="#009933" > {{getOrderStatusText(record['orderStatus'] as OrderStatus)}}</a-tag>
            <a-tag v-if="record['orderStatus']===4" color="#ff0000" > {{getOrderStatusText(record['orderStatus'] as OrderStatus)}}</a-tag>
            <a-tag v-if="record['orderStatus']===5" color="#cc0000" > {{getOrderStatusText(record['orderStatus'] as OrderStatus)}}</a-tag>
            <a-tag v-if="record['orderStatus']===6" color="#cc0000" > {{getOrderStatusText(record['orderStatus'] as OrderStatus)}}</a-tag>
          </template>
        </template>
        <template v-if="column.dataIndex==='amount'">
          {{(parseFloat(record['amount']) / 100)}}
        </template>
        <template v-if="column.dataIndex==='mchOrderNo'">
          <a-flex justify="space-start" align="center" :gap="5" >
            <a-typography-text >{{record['mchOrderNo']}}</a-typography-text>
          </a-flex>

        </template>
        <template v-if="column.dataIndex==='payMode'">
          <a-typography-link v-if="record['payMode']">{{getPayModeTypeText(record['payMode'])}}</a-typography-link>
          <a-typography-text v-else>--</a-typography-text>
        </template>
        <template v-if="column.dataIndex==='successTime'">
          {{record['successTime']|| '--' }}
        </template>
        <template v-if="column.dataIndex==='mchFeeAmount'">
          {{record['mchFeeAmount']|| '--' }}
        </template>
        <template v-if="column.dataIndex==='channelOrderNo'">
            <a-typography-text>{{record['channelOrderNo']||'--'}}</a-typography-text>
        </template>
        <template v-if="column.dataIndex==='channelInfo'">
          <a-flex justify="center" align="center" :gap="5" v-if="record['channelInfo']">
            <AlipaySquareFilled   style="font-size: 28px;color: dodgerblue"/>
            <a-typography-link>{{record['channelInfo'].name}}</a-typography-link>
          </a-flex>
          <a-typography-text v-else>--</a-typography-text>
        </template>
        <template v-if="column.dataIndex==='action'">
          <a-button type="link" style="padding: 5px" >详情</a-button>
        </template>
      </template>
    </a-table>
  </div>

</template>

<style scoped lang="less">

</style>