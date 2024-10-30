<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";
import {MerchantRequest, getMerchantList, MerchantInfo,delMerchant} from "~/api/merchant/index.ts";
import {ContactWay, getContactWayText} from "../../utils/constant.ts";
import { Modal, message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { ref, createVNode } from 'vue';

const router=useRouter()

const columns:ColumnsType =[
  // {
  //   title: '所属代理',
  //   dataIndex: 'agentInfo',
  // },
  {
    title: '商户名称',
    dataIndex: 'name',
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
    title: '渠道数量',
    dataIndex: 'channelCount',
  },
  {
    title: '订单数量',
    dataIndex: 'totalOrderCount',
  },
  {
    title: '订单金额',
    dataIndex: 'totalOrderAmount',
  },
  {
    title: '签名方试',
    dataIndex: 'signType',
  },

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
const state=reactive<{
  dataSourceLoading: boolean;
  isConfirmLoading: boolean;
  isShowDelDialog: boolean;
}>({
  dataSourceLoading:false,
  isConfirmLoading:false,
  isShowDelDialog: false
})
const searchParams = reactive<MerchantRequest>({
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
    searchParams.page=pagination.current
    searchParams.limit=pagination.pageSize
    router.replace({query: searchParams})
  },
})
const dataSource=shallowRef<MerchantInfo[]>([])
const resetSearch=()=>{
  Object.assign(searchParams,{
    keywords:null,
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
    const { data } = await getMerchantList({
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

const handleDel = (item: MerchantInfo) => {
  // Modal.confirm({
  //   title: '温馨提示',
  //   icon: createVNode(ExclamationCircleOutlined),
  //   content: `确认删除商户【 ${item.name} 】吗？`,
  //   okText: '确认',
  //   cancelText: '取消',
  // });



  Modal.confirm({
    title: '温馨提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: `确认删除商户【 ${item.name} 】吗？`,
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        let res = await delMerchant(item.id)
        message.success('操作成功')
        loadData()
      } catch {
        
      }
    },
    onCancel() {},
  });
}

onMounted(()=>{
  Object.assign(searchParams,router.currentRoute.value.query??{page:1,limit:1})
  pagination.current=searchParams.page
  pagination.pageSize=searchParams.limit
  loadData()
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>商户列表</a-typography-text>
      </a-flex>
    </a-card>
    <a-card style="border: none" :body-style="{padding:'15px'}">
      <a-flex vertical :gap="15">
        <a-row :gutter="16">

          <a-col class="gutter-row" :span="4">
            <a-input v-model:value="searchParams.keywords" allow-clear  placeholder="商户名称/ID" ></a-input>
          </a-col>
        </a-row>

        <a-flex  :gap="0"  justify="flex-end">
          <a-button type="link" style="padding-left: 0" @click="resetSearch">重置筛选</a-button>
          <a-button  size="small"   @click="filterSearch"  type="primary"  style="width: 80px;height:28px"  >筛选</a-button>
        </a-flex>
      </a-flex>
    </a-card>
    <a-card :body-style="{'padding':'0px'}">
      <template #title>
        <a-button @click="router.push({path:'/mch/edit'})" type="primary" >添加商户</a-button>
      </template>
      <template #extra>

      </template>
      <a-table ref="tableRef" :scroll="{x: 'max-content'}" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
        <template #emptyText>
          <a-empty></a-empty>
          <a-button v-if="searchParams.page==1" type="primary" @click="router.push({path:'/mch/edit'})" >添加商户</a-button>
        </template>
        <template #bodyCell="{ column , record}">


          <template v-if="column.dataIndex=='agentInfo'">
            <a-flex vertical :gap="5" align="start">
              <a-button style="padding-left: 0" type="link" @click="router.push({path:'/agent/info',query:{id:record.agentInfo.id}})">{{record.agentInfo.name}}</a-button>
              <a-typography-text type="secondary">代理商ID:{{record.agentInfo.id}}</a-typography-text>
            </a-flex>
          </template>
          <template v-if="column.dataIndex==='name'">
            <a-flex vertical :gap="5" align="start">
              <a-button style="padding-left: 0" type="link" @click="router.push({path:'/mch/info',query:{id:record.id}})">{{record["name"]}}</a-button>
              <a-typography-text type="secondary">商户ID:{{record["id"]}}</a-typography-text>
            </a-flex>
          </template>
          <template v-if="column.dataIndex==='contactWay'">
            <a-typography-text>{{getContactWayText((record["contactWay"]as ContactWay))}}</a-typography-text>
          </template>
          <template v-if="column.dataIndex==='signType'">
            <a-space>
              <a-typography-text v-if="record['signType']">{{record['signType']}}</a-typography-text>
              <a-typography-text type="warning" v-else>未设置</a-typography-text>
            </a-space>
          </template>
          <template v-if="column.dataIndex==='isEnable'">
              <a-switch :checked-value="true" :un-checked-value="false" :checked="record['isEnable']"></a-switch>
          </template>
          <template v-if="column.dataIndex==='channelCount'">
             {{record.channelCount?? '/' }}
          </template>
          <template v-if="column.dataIndex==='totalOrderCount'">
            {{record.totalOrderAmount || '/' }}
          </template>
          <template v-if="column.dataIndex==='totalOrderAmount'">
            {{record.totalOrderAmount|| '/' }}
          </template>
          <template v-if="column.dataIndex==='action'">
            <a-flex :gap="5">

              <a-dropdown :trigger="['click']">
                <a class="ant-dropdown-link" @click.prevent>
                  更多操作
                  <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="0">
                      <a-button style="padding-left: 0" type="link" @click="router.push({path:'/mch/info',query:{id:record.id}})">查看商户</a-button>
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="3">
                      <a-button danger style="padding-left: 0" type="link" @click="handleDel(record)">删除当前商户</a-button>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
              
            </a-flex>
          </template>
        </template>
      </a-table>
    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>