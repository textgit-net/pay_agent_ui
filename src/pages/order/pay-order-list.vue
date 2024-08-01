<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";

import {PaginationProps} from "ant-design-vue";

const columns:ColumnsType =[
  {
    title: '订单编号',
    dataIndex: 'id',
  },
  {
    title: '商品标题',
    dataIndex: 'name',
  },
  {
    title: '支付方式',
    dataIndex: 'company',
  },
  {
    title: '订单金额',
    dataIndex: 'appId',
  },
  {
    title: '手续费',
    dataIndex: 'isEnable',
  },
  {
    title: '货币种类',
    dataIndex: 'isEnable',
  },
  {
    title: '商家订单号',
    dataIndex: 'isEnable',
  },
  {
    title: '渠道订单号',
    dataIndex: 'isEnable',
  },
  {
    title: '订单状态',
    dataIndex: 'isEnable',
  }
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

        </template>
      </a-table>
    </a-card>


  </a-flex>
</template>

<style scoped lang="less">

</style>