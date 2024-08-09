<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {AlipaySquareFilled } from "@ant-design/icons-vue"
import {PaginationProps} from "ant-design-vue";
import {ChannelListResponse, ChannelSearch, searchChannel} from "~/api/channel/ChannelInterface.ts";
import {PayChannelType} from "~/utils/constant.ts";
const router=useRouter()
const columns:ColumnsType =[
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '渠道名称',
    dataIndex: 'name',
  },
  {
    title: '渠道类型',
    dataIndex: 'channelType',
  },

  {
    title: '启用分账',
    dataIndex: 'isEnableAllocation',
  },
  {
    title: '成功金额',
    dataIndex: 'successAmount',
  },
  {
    title: '成功率',
    dataIndex: 'successRate',
  },
  {
    title: '启用状态',
    dataIndex: 'isEnable',
  },
  {
    title:'创建日间',
    dataIndex:'createTime'
  },
  {
    title:'操作',
    width:180,
    dataIndex: 'action',
  },
]
const state=reactive({
  isShowEditModal:false,
  dataSourceLoading:false,

})
const searchParams=reactive<ChannelSearch>({
  page:1,
  limit:10,
  isIgnoreDisable:true
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
const dataSource=shallowRef<ChannelListResponse[]>([])

const loadData=async ()=>{
  if (state.dataSourceLoading)
    return
  state.dataSourceLoading = true
  try {
    const { data } = await searchChannel({
      ...searchParams,
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

onMounted(()=>{
  loadData()
})
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
        <a-table ref="tableRef" :scroll="{x: 'max-content'}" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
        <template #emptyText>
          <a-empty></a-empty>
          <a-button @click="router.push({path:'/channel/edit'})" type="primary">添加渠道</a-button>
        </template>
        <template #bodyCell="{ column , record}">
          <template v-if="column.dataIndex==='isEnableAllocation'">
            <a-tag v-if="record['isEnableAllocation']" color="success">已配制</a-tag>
            <a-tag v-else color="#f50">未配制</a-tag>
          </template>
          <template v-if="column.dataIndex==='amount'">
            {{record['totalAmount']||'--'}}
          </template>
          <template v-if="column.dataIndex==='isEnable'">
            <a-tag v-if="record['isEnable']" color="#389e0d" > 启用</a-tag>
            <a-tag v-else color="#f50">禁用</a-tag>
          </template>
          <template v-if="column.dataIndex==='channelType'">
              <a-flex :gap="5" v-if="PayChannelType.ALI==record['channelType']">
                <AlipaySquareFilled style="color: dodgerblue;font-size: 18px"/><a-typography-text strong  style="font-size: 12px">支付宝</a-typography-text >
              </a-flex>
          </template>
          <template v-if="column.dataIndex==='action'">
            <a-flex :gap="10">
              <a-button type="link" style="padding: 5px" >编辑</a-button>
              <a-button  @click="router.push({path:'/channel/test',query:{id:record['id']}})" type="link" style="padding: 5px" >测式</a-button>
              <a-button  v-if="record['isEnable']" style="padding: 5px" type="link" danger>禁用</a-button>
            </a-flex>
          </template>
        </template>
      </a-table>
    </a-card>


  </a-flex>
</template>

<style scoped lang="less">

</style>