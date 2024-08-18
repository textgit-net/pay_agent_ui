<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";
import {ClockCircleOutlined} from "@ant-design/icons-vue"
import {AccountInfoResponse, getAccountList} from "~/api/account/AccountInterface.ts";
import {BasePageRequest} from "~/utils/constant.ts";

const columns:ColumnsType =[

  {
    title: '名称',
    dataIndex: 'nickName',

    fixed:'left'
  },
  {
    title: '登录账号',
    dataIndex: 'loginName',
  },
  {
    title: '角色',

    dataIndex: 'role',
  },
  {
    title: '动态安全码',

    dataIndex: 'isEnableGoogleVerify',
  },
  {
    title: '账号状态',

    dataIndex: 'isEnable',
  },
  {
    title: '上一次登录信息 ',
    width:'250px',
    dataIndex: 'lastLoginInfo',
  },
  {
    title: '创建时间',
    width:'200px',
    dataIndex: 'createTime',
  },
  {
    title:'操作',
    fixed:'right',
    width:'200px',
    dataIndex: 'action',
  },
]

const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys: (string | number)[], selectedRows: AccountInfoResponse[]) => {

  },
  onSelect: (record: AccountInfoResponse, selected: boolean, selectedRows: AccountInfoResponse[]) => {

  },
  onSelectAll: (selected: boolean, selectedRows: AccountInfoResponse[], changeRows: AccountInfoResponse[]) => {

  },
});
const state=reactive({
  isShowEditModal:false,
  dataSourceLoading:false,

})
const searchParams=reactive<BasePageRequest>({
  page:1,
  limit:10,
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
const dataSource=shallowRef<AccountInfoResponse[]>([])

const loadData=async ()=>{
  if (state.dataSourceLoading)
    return
  state.dataSourceLoading = true
  try {
    const { data } = await getAccountList()
    dataSource.value=data ?? []
  }
  finally {
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
        <a-typography-text>账号管理</a-typography-text>
      </a-flex>
    </a-card>
    <a-card :body-style="{'padding':'0px'}">

      <a-card style="border: none" :body-style="{padding:'15px'}">

      </a-card>
      <a-table  ref="tableRef" :scroll="{x: 'max-content'}" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
        <template #emptyText>
          <a-empty></a-empty>
        </template>
        <template #bodyCell="{ column , record}">
          <template v-if="column.dataIndex==='isEnableGoogleVerify'">
            <a-tag v-if="record['isEnableGoogleVerify']" color="success">已启用</a-tag>
            <a-tag v-else >未启用</a-tag>
          </template>
          <template v-if="column.dataIndex==='nickName'">
            <a-flex :gap="10">
              <a-avatar shape="square" />
              <a-flex vertical>
                <a-typography-text >{{record["nickName"]}}</a-typography-text>
                <a-typography-text strong>{{record["id"]}}</a-typography-text>
              </a-flex>
            </a-flex>
          </template>


          <template v-if="column.dataIndex==='role'">
             <a-button style="padding-left: 0px" type="link">{{record['isAdmin']?'超级管理员':record["roleName"]}}</a-button>
          </template>
          <template v-if="column.dataIndex==='isEnable'">
            <a-tag v-if="record['isEnable']" color="#389e0d" > 启用</a-tag>
            <a-tag v-else color="#f50">禁用</a-tag>
          </template>
          <template v-if="column.dataIndex==='lastLoginInfo'">
            <a-typography-text><ClockCircleOutlined class="mr-2"/>{{record['lastLoginTime']}}<a-typography-text class="ml-2" type="secondary">{{record['lastLoginIp']}}</a-typography-text> </a-typography-text>
          </template>

          <template v-if="column.dataIndex==='action'">
            <a-flex :gap="10" >
              <a-button v-if="record['isEnable']" type="primary" danger>禁用</a-button>
              <a-button v-if="!record['isEnable']" type="primary" >启用</a-button>
            </a-flex>
          </template>
        </template>
      </a-table>
    </a-card>


  </a-flex>
</template>

<style scoped lang="less">


</style>