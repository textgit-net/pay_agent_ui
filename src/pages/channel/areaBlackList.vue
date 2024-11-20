<script setup lang="ts">
import { createVNode } from 'vue';
import {ColumnsType} from "ant-design-vue/es/table";
import { PayChannelType, getPayChannelTypeText} from "~/utils/constant.ts";
import {QuestionCircleOutlined,ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { Modal, message, PaginationProps } from 'ant-design-vue';

import { delChannelAddressBlackList, getChannelAddressBlackList, ChannelAddressBlackListSearch, ChannelAddressBlackListResponse } from '@/api/channel/blacklist'
import { updateParamsToUrl, getParamsFromUrl} from '@/utils/tools'

const router=useRouter()
const route = useRoute()
const {id}= route.query

const columns:ColumnsType =[

  // {
  //   title: '#ID',
  //   dataIndex: 'id',
  // },
  {
    title: '国家或地区',
    dataIndex: 'country',
    width: '22%'
  },
  {
    title: '省份或州',
    dataIndex: 'province',
     width: '22%'
  },
  {
    title: '城市',
    dataIndex: 'city',
     width: '22%'
  },
  {
    title: '限定区域',
    dataIndex: 'enable',
    key: 'enable'
  },
  // {
  //   title: '创建时间',
  //   dataIndex: 'createTime',
  // },
  {
    title:'操作',
    dataIndex: 'action',
  },
]
const state=reactive({
  dataSourceLoading:false,
  isSaveLoading:false,
  isShowEditModal: false
})

const initSearchParams = ():ChannelAddressBlackListSearch => {
  return {
    page:1,
    limit:10,
    channelId: `${id}`
  }
}
const searchParams = ref<ChannelAddressBlackListSearch>(initSearchParams())
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
    searchParams.value.page = current
    searchParams.value.limit = pageSize
    router.replace({ query: {...searchParams.value, timestamp: new Date().getTime()}})
    // loadData()
  },
})
const dataSource=ref<ChannelAddressBlackListResponse[]>([])
const resetSearch=()=>{
  searchParams.value = initSearchParams()
  filterSearch()
}
const filterSearch=()=>{

  pagination.onChange(1, pagination.pageSize)
}
const loadData=async  ()=> {
  if (state.dataSourceLoading) return
  state.dataSourceLoading = true
  try {
    const { data } = await getChannelAddressBlackList({
      ...searchParams.value,
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

const handleDel = async (item?: ChannelAddressBlackListResponse) => {
    
    Modal.confirm({
    title: '温馨提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: `确认删除当前渠道的黑名单地区【${item.country}-${item.province?? '/'}-${item.city?? '/'}】？`,
    okText: '确认',
    centered: true,
    cancelText: '取消',
    async onOk() {
      try {
        await delChannelAddressBlackList(item.id)
        message.success('操作成功')
        filterSearch()
      } catch {
        
      }
    },
    onCancel() {},
  });
 
}

onMounted(()=>{
  if (getParamsFromUrl()) {
    searchParams.value = Object.assign(searchParams.value, getParamsFromUrl())
  }
  if (searchParams.value.page) {
    pagination.current = searchParams.value.page
    pagination.pageSize = searchParams.value.limit
  }
  loadData()
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!-- <a-card style="border: none" :body-style="{padding:'15px'}">
      <a-flex vertical :gap="15">
        <a-row :gutter="16">

          <a-col class="gutter-row" :span="5">
            <a-input v-model:value="searchParams.realName" allow-clear  placeholder="按真实姓名筛选" ></a-input>
          </a-col>
          
        </a-row>

        <a-flex  :gap="0"  justify="flex-start">
          <a-button type="link" style="padding-left: 0" @click="resetSearch">重置筛选</a-button>
          <a-button  size="small"  @click="filterSearch"  type="primary"  style="width: 80px;height:28px" >
            <template #icon>
              <FileSearchOutlined />
            </template>
            筛选
          </a-button>
        </a-flex>
      </a-flex>
    </a-card> -->
    <a-card :body-style="{'padding':'0px'}">
      <a-table ref="tableRef" :scroll="{x: 'max-content'}" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
        <template #headerCell="{ column }">
          <template v-if="column.key === 'enable'">
            <a-tooltip>
              <template #title>若开启白名单地区，将限定在白名单地区<br/>若存在开启白名单地区，黑名单地区失效<br/>若不存在白名单地区，黑名单地区生效</template>
              <span>
                限定区域
                <QuestionCircleOutlined />
              </span>
            </a-tooltip>
            
          </template>
        </template>
        
        <template #bodyCell="{ column , record}">


          
          <template v-if="column.dataIndex==='name'">

            <a-flex vertical :gap="5" align="start">
              <a-button style="padding-left: 0" type="link" @click="router.push({path:'/agent/info',query:{id:record.id}})">{{record.name}}</a-button>
              <a-typography-text type="secondary">ID:{{record.id}}</a-typography-text>
            </a-flex>
          </template>
          <template v-if="column.dataIndex==='province'">
            <a-flex :gap="5">
              {{ record.province?? '/' }}
            </a-flex>
          </template>
          <template v-if="column.dataIndex==='city'">
            <a-flex :gap="5">
              {{ record.city?? '/' }}
            </a-flex>
          </template>
          <template v-if="column.dataIndex==='enable'">
            <a-flex :gap="5">
              <a-tooltip v-if="record.isEnable">
                <template #title>已开启白名单权限，将限定在白名单</template>
                <a-tag :bordered="false" color="success" >
                  白名单地区
                </a-tag>
              </a-tooltip>
              <a-tooltip v-else>
                <template #title>若开启白名单地区，黑名单地区失效 </template>
                <a-tag :bordered="false" color="processing" >
                  黑名单地区
                </a-tag>
              </a-tooltip>
            </a-flex>
          </template>
          <template v-if="column.dataIndex==='action'">
            <a-flex :gap="5">
              <a-button style="padding-left: 0" type="link" @click="handleDel(record)">删除</a-button>
            </a-flex>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>