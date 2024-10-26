<script setup lang="ts">
const userStore = useUserStore()
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";
import {ContactWay, getContactWayText} from "../../utils/constant.ts";
import {getAgentList, AgentPageReq, AgentInfo } from '~/api/agent/index'

const isHasPermission = computed(()=> {
  return userStore.userInfo.isAllowInviteUser
})

const router=useRouter()

const columns:ColumnsType =[

  {
    title: '代理名称',
    dataIndex: 'name',
  },
  {
    title: '代理账号',
    dataIndex: 'loginName',
  },
  {
    title: '联系人',
    dataIndex: 'contactName',
  },
  {
    title: '联系方式',
    dataIndex: 'contactWay',
  },
  {
    title:'联系号码',
    dataIndex:'contactNumber'
  },
  {
    title: '商户数量',
    dataIndex: 'mchCount',
  },
  {
    title: '订单数量',
    dataIndex: 'totalOrderCount',
  },
  {
    title: '订单金额',
    dataIndex: 'totalOrderAmount',
  },
//   {
//     title: '签名方式',
//     dataIndex: 'signType',
//   },

  {
    title: '合作状态',
    dataIndex: 'isEnable',
  },
  {
    title: '合作日期',
    dataIndex: 'createdTime',
  },
  {
    title:'操作',
    dataIndex: 'action',
  },
]
const state=reactive({
  dataSourceLoading:false,
  isConfirmLoading:false
})
const searchParams = reactive<AgentPageReq>({
  page:1,
  limit:10,
  keyword: ''
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
    searchParams.page=pagination.current
    searchParams.limit=pagination.pageSize
    router.replace({query: searchParams})
  },
})
const dataSource=ref<AgentInfo[]>([])
const resetSearch=()=>{
  Object.assign(searchParams,{
    keyword:null,
    page:1,
    limit:10
  })
  router.replace({query: searchParams})
}
const filterSearch=()=>{
  // Object.assign(searchParams,{
  //   page:1,
  //   limit:10
  // })
  // await loadData()

  router.push({query: searchParams})
}
const loadData=async  ()=> {
  if (state.dataSourceLoading)
    return
  state.dataSourceLoading = true
  try {
    const { data } = await getAgentList({
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
  Object.assign(searchParams,router.currentRoute.value.query??{page:1,limit:1})
  pagination.current=searchParams.page
  pagination.pageSize=searchParams.limit
  console.log('isHasPermission', isHasPermission)
  if (isHasPermission.value) {
    loadData()
  }
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card v-if="isHasPermission" :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>代理列表</a-typography-text>
      </a-flex>
    </a-card>
    <a-card v-if="isHasPermission" style="border: none" :body-style="{padding:'15px'}">
      <a-flex vertical :gap="15">
        <a-row :gutter="16">

          <a-col class="gutter-row" :span="4">
            <a-input v-model:value="searchParams.keyword" allow-clear  placeholder="代理ID/名称/简称" ></a-input>
          </a-col>
        </a-row>

        <a-flex  :gap="0"  justify="flex-end">
          <a-button type="link" style="padding-left: 0" @click="resetSearch">重置筛选</a-button>
          <a-button  size="small"   @click="filterSearch"  type="primary"  style="width: 80px;height:28px"  >筛选</a-button>
        </a-flex>
      </a-flex>
    </a-card>
    <a-card v-if="isHasPermission" :body-style="{'padding':'0px'}">
      <template #title>
        <a-button @click="router.push({path:'/agent/edit'})" type="primary" >添加代理</a-button>
      </template>
      <template #extra>

      </template>
      <a-table ref="tableRef" :scroll="{x: 'max-content'}" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
        <template #emptyText>
          <a-empty></a-empty>
          <a-button v-if="searchParams.page==1" type="primary" @click="router.push({path:'/agent/edit'})" >添加代理</a-button>
        </template>
        <template #bodyCell="{ column , record}">
          <template v-if="column.dataIndex==='name'">

            <a-flex vertical :gap="5" align="start">
              <a-button style="padding-left: 0" type="link" @click="router.push({path:'/agent/info',query:{id:record.id}})">{{record.name}}</a-button>
              <a-typography-text type="secondary">ID:{{record.id}}</a-typography-text>
            </a-flex>
          </template>
<!--          <template v-if="column.dataIndex==='contactWay'">-->
<!--             <a-space>-->
<!--               <a-typography-text>{{getContactWayText((record["contactWay"]as ContactWay))}}</a-typography-text>-->
<!--               <a-typography-text type="secondary" >{{record["contactNumber"]}}</a-typography-text>-->
<!--             </a-space>-->
<!--          </template>-->
          <template v-if="column.dataIndex==='contactWay'">
            <a-typography-text>{{getContactWayText((record.contactWay as ContactWay))}}</a-typography-text>
          </template>
          <template v-if="column.dataIndex==='signType'">
            <a-space>
              <a-typography-text v-if="record.signType">{{record.signType}}</a-typography-text>
              <a-typography-text type="warning" v-else>未设置</a-typography-text>
            </a-space>
          </template>
          <template v-if="column.dataIndex==='isEnable'">
              <a-switch checked-children="是" un-checked-children="否" :checked="record.isEnable" disabled></a-switch>
          </template>
          <template v-if="column.dataIndex==='mchCount'">
             {{record.mchCount ?? '/' }}
          </template>
          <template v-if="column.dataIndex==='totalOrderCount'">
            {{record.totalOrderAmount ?? '/' }}
          </template>
          <template v-if="column.dataIndex==='totalOrderAmount'">
            {{record.totalOrderAmount ?? '/' }}
          </template>
          <template v-if="column.dataIndex==='action'">
            <a-flex :gap="5">
              <a-button style="padding-left: 0" type="link" @click="router.push({path:'/agent/edit',query:{id:record.id}})">编辑</a-button>
            </a-flex>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-card style="height: 100%;" v-if="!isHasPermission" :body-style="{padding:'15px', height: '100%'}">
      <div style="height: 100%; width: 100%; display: flex;align-items: center;justify-content: center;">

        <a-result status="403" title="温馨提示" sub-title="您无权限查看！" >
          <template #extra>
            
          </template>
        </a-result>
      </div>
    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>