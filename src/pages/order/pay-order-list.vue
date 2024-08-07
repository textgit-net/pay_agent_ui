<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";

import {PaginationProps} from "ant-design-vue";

const columns:ColumnsType =[
  {
    title: '订单号',
    dataIndex: 'id',
  },{
    title: '商家订单号',
    dataIndex: 'mchOrderNo',
  },
  {
    title: '渠道订单号',
    dataIndex: 'channelOrderNo',
  },
  {
    title: '商品标题',
    dataIndex: 'subject',
  },
  {
    title: '支付方式',
    dataIndex: 'payMode',
  },
  {
    title: '支付渠道',
    dataIndex: 'payChannelName',
  },
  {
    title: '订单金额',
    dataIndex: 'amount',
  },
  {
    title: '手续费',
    dataIndex: 'mchFeeAmount',
  },
  {
    title: '订单状态',
    dataIndex: 'orderStatus',
  },
  {
    title: '通知状态',
    dataIndex: 'notifyStatus',
  },{
    title: '创建时间',
    dataIndex: 'createdTime',
  },{
    title: '支付时间',
    dataIndex: 'successTime',
  },
]
const state=reactive({
  isShowEditModal:false,
  dataSourceLoading:false,

})
const searchParams=reactive<any>({
  page:1,
  limit:10
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
const dataSource=shallowRef<any[]>([])

</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>订单列表</a-typography-text>
      </a-flex>
    </a-card>
    <a-card :body-style="{'padding':'0px'}">

      <a-card style="border: none" :body-style="{padding:'15px'}">

      </a-card>
      <a-table ref="tableRef" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
        <template #emptyText>
          <a-empty></a-empty>
        </template>
        <template #bodyCell="{ column , record}">

          <template v-if="column.dataIndex==='id'">
            {{record['id']}}
          </template>
          <template v-if="column.dataIndex==='mchOrderNo'">
            {{record['mchOrderNo']}}
          </template>
          <template v-if="column.dataIndex==='channelOrderNo'">
            {{record['channelOrderNo']}}
          </template>
          <template v-if="column.dataIndex==='subject'">
            {{record['subject']}}
          </template>
          <template v-if="column.dataIndex==='payMode'">
            {{record['payMode']}}
          </template>
          <template v-if="column.dataIndex==='payChannelName'">
            {{record['payChannelName']}}
          </template>
          <template v-if="column.dataIndex==='amount'">
            {{record['amount'] / 100 }}
          </template>
          <template v-if="column.dataIndex==='mchFeeAmount'">
            {{record['mchFeeAmount'] /100 }}
          </template>
          <template v-if="column.dataIndex==='orderStatus'">
            <a-tag v-if="record['orderStatus']=='WAIT_PAY'" color="success">待支付</a-tag>
            <a-tag v-if="record['orderStatus']=='PAY_ING'" color="success">待支付</a-tag>
            <a-tag v-if="record['orderStatus']=='SUCCESS'" color="success">成功</a-tag>
            <a-tag v-if="record['orderStatus']=='FAIL'" color="success">失败</a-tag>
            <a-tag v-if="record['orderStatus']=='CLOSE'" color="success">订单关闭</a-tag>
          </template>
          <template v-if="column.dataIndex==='notifyStatus'">
            <a-tag v-if="record['orderStatus']=='NOT'" color="success">未回调</a-tag>
            <a-tag v-if="record['orderStatus']=='SUCCESS'" color="success">已通知</a-tag>
          </template>
          <template v-if="column.dataIndex==='successTime'">
            {{record['successTime']}}
          </template>
          <template v-if="column.dataIndex==='createdTime'">
            {{record['createdTime']}}
          </template>



        </template>
      </a-table>
    </a-card>


  </a-flex>
</template>

<style scoped lang="less">

</style>