<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {NetworkInfo, NetworkSearch} from "~/api/network.ts";
import {PaginationProps} from "ant-design-vue";

const columns:ColumnsType =[
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '商户名称',
    dataIndex: 'name',
  },
  {
    title: '联系人',
    dataIndex: 'company',
  },
  {
    title: '取系方式',
    dataIndex: 'appId',
  },
  {
    title: '渠道数量',
    dataIndex: 'isEnable',
  },
  {
    title: '备注',
    dataIndex: 'isEnable',
  },
  {
    title: '合作状态',
    dataIndex: 'isEnable',
  },
  {
    title: '合作日期',
    dataIndex: 'isEnable',
  },
  {
    title:'操作',
    dataIndex: 'action',
  },
]
const state=reactive({
  isShowEditModal:false,
  dataSourceLoading:false,

})
const searchParams=reactive<NetworkSearch>({
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
const dataSource=shallowRef<NetworkInfo[]>([])

</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>支付渠道</a-typography-text>
      </a-flex>
    </a-card>
    <a-card :body-style="{'padding':'0px'}">

      <a-card style="border: none" :body-style="{padding:'15px'}">

      </a-card>
      <a-table ref="tableRef" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
        <template #emptyText>
          <a-empty></a-empty>
          <a-button  type="primary">添加商户</a-button>
        </template>
        <template #bodyCell="{ column , record}">

        </template>
      </a-table>
    </a-card>


  </a-flex>
</template>

<style scoped lang="less">

</style>