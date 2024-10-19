<script setup lang="ts">
import { h, createVNode  } from 'vue';
import {ColumnsType} from "ant-design-vue/es/table";
import {AlipaySquareFilled, ExclamationCircleOutlined, FormOutlined } from "@ant-design/icons-vue"
import {PaginationProps,Modal,message} from "ant-design-vue";

import {ChannelListResponse, ChannelSearch, searchChannel} from "~/api/channel/ChannelInterface.ts";
import {getPayChannelTypeText, PayChannelType, PayModeType, getPayModeTypeText} from "~/utils/constant.ts";
import { calcFloat } from '~/utils/calcFloat'
const router=useRouter()
const columns:ColumnsType =[
  {
    title: '渠道组',
    dataIndex: 'groupInfo',
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
    title: '支付方式',
    dataIndex: 'payModes',
  },
  {
    title: '启用分账',
    dataIndex: 'isEnableRoyalty',
  },
  {
    title: '订单支付条数',
    dataIndex: 'successCount',
  },
  {
    title: '订单支付金额',
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
    title:'渠道测试',
    dataIndex:'test',
    width: '100px'
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
  isPageLoading:false,

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

const changeEnable=async (id:number)=>{
  Modal.confirm({
    title: '温馨提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: `确认关闭当前渠道吗？关闭后需联系管理员开启。`,
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        state.isPageLoading=true
        let res = await usePut(`/channel/change/${id}`)
        message.success('操作成功')
        await loadData()
        state.isPageLoading=false
      } catch {
        
      }
    },
    onCancel() {},
  });
 
}
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

const showPayModelDialog = (record: ChannelListResponse) => {
  let domArr = []
  if (record.payModes.length) {
    record.payModes.map((item: PayModeType, index: number) => {
      domArr.push(h('p', `${index + 1}、${getPayModeTypeText(item)}`))
    })
  
  }
  Modal.info({
    title: '支持的支付方式',
    content: h('div', {}, domArr),
    onOk() {
      console.log('ok');
    },
  });
}

onMounted(()=>{
  loadData()
})
</script>

<template>
  <a-spin :spinning="state.isPageLoading">
    <a-flex vertical :gap="10" style="width: 100%;height: 100%">
      <!--头部-->
      <a-card :body-style="{padding:'15px'}">
        <a-flex justify="space-between">
          <a-typography-text>支付渠道</a-typography-text>
        </a-flex>
      </a-card>
      <a-card :body-style="{'padding':'0px'}">

        <a-card style="border: none" :body-style="{padding:'15px'}">
          <a-button @click="router.push({path:'/channel/edit'})" type="primary">添加渠道</a-button>
        </a-card>
        <a-table ref="tableRef" :scroll="{x: 'max-content'}" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading && !state.isPageLoading"  :columns="columns" size="middle" :bordered="false">
          <!--        <template #emptyText>-->
          <!--          <a-empty></a-empty>-->
          <!--          <a-button @click="router.push({path:'/channel/edit'})" type="primary">添加渠道</a-button>-->
          <!--        </template>-->
          <template #bodyCell="{ column , record}">

            <template v-if="column.dataIndex==='successCount'">
              <a-flex :gap="5" align="start">
                <div v-if="record.totalCount">
                  <a-typography-text type="success" strong>  {{ record.successCount }}</a-typography-text> /
                  <a-typography-text type="danger" strong> {{ record.totalCount }}</a-typography-text>
                </div>
                <a-typography-text v-else type="danger" strong>/</a-typography-text>
              </a-flex>
            </template>
            <template v-if="column.dataIndex==='successAmount'">
              <a-flex :gap="5" align="start">
                <div v-if="record.totalAmount">
                  <a-typography-text type="success" strong>  {{ record.successAmount }}</a-typography-text> /
                  <a-typography-text type="danger" strong> {{ record.totalAmount }}</a-typography-text>
                </div>
                <a-typography-text v-else type="danger" strong>/</a-typography-text>
              </a-flex>
            </template>

            <template v-if="column.dataIndex==='successRate'">
              <a-flex :gap="5" align="start">
                <a-typography-text v-if="record.totalCount" type="success" strong>  {{ (calcFloat.div(record.successCount, record.totalCount) * 100).toFixed(2) }}%</a-typography-text>
                <a-typography-text v-else type="success" strong> /</a-typography-text>
              </a-flex>
            </template>

            <template v-if="column.dataIndex==='name'">
              <a-flex vertical :gap="5" align="start">
                <a-tooltip>
                  <template #title>查看渠道 | {{record.name}}详情</template>
                  <a-button style="padding-left: 0" type="link" @click="router.push({path:'/channel/info',query:{id:record.id}})">{{record.name}}</a-button>
                </a-tooltip>
                
                <a-typography-text type="secondary">ID:{{record.id}}</a-typography-text>
              </a-flex>
            </template>

            <template v-if="column.dataIndex==='payModes'">
              <a-flex vertical :gap="5" align="start">
                <a @click="showPayModelDialog(record as ChannelListResponse)">{{record.payModes.length}}个</a>
              </a-flex>
            </template>

            <template v-if="column.dataIndex==='isEnableRoyalty'">
              <a-tag v-if="record['isEnableRoyalty']" :bordered="false" color="success">已配制</a-tag>
              <a-tag v-else :bordered="false" color="processing">未配制</a-tag>
            </template>
            <template v-if="column.dataIndex==='amount'">
              {{record['totalAmount']||'/'}}
            </template>
            <template v-if="column.dataIndex==='isEnable'">
              <a-flex :gap="5"  justify="space-between" align="center" >
                <!-- <a-switch v-if="record['isEnable']"  @click="changeEnable(record['id'] as number)" :checked="record['isEnable']" :disabled="!record['isEnable']" :checked-value="true" :un-checked-value="false"></a-switch> -->
                <a-flex v-if="record['isEnable']" align="center"  justify="center">
                  <a-tag :bordered="false" color="success">已开启</a-tag>
                  <a-tooltip>
                    <template #title>关闭渠道</template>
                    <FormOutlined @click="changeEnable(record.id as number)" style="color: #1677ff;" />
                  </a-tooltip>
                  
                </a-flex>
                
                
                <a-tooltip v-else>
                  <template #title>请联系管理员进行开启</template>
                  <a-tag :bordered="false" color="error">
                    已关闭
                  </a-tag>
                </a-tooltip>
              </a-flex>
              
             
             
            </template>
            <template v-if="column.dataIndex==='groupInfo'">
              <a-flex :gap="10"  justify="space-between" align="center" >
                <a-typography-text  v-if="record['groupCode']" >{{record['groupName']}}</a-typography-text>
                <a-typography-text  v-else>/</a-typography-text>
              </a-flex>
            </template>
            <template v-if="column.dataIndex==='channelType'">
              <a-flex :gap="5" >
                <AlipaySquareFilled v-if="[PayChannelType.ALI,PayChannelType.ALI_USER].indexOf(record['channelType'])>=0" style="color: dodgerblue;font-size: 18px"/>
                <a-typography-text strong  style="font-size: 12px">{{getPayChannelTypeText(record['channelType'])}}</a-typography-text >
              </a-flex>
            </template>
            <template v-if="column.dataIndex==='test'">
              <a-flex :gap="10">
                <a-typography-text v-if="!record.isEnable" strong>/</a-typography-text>
                <a-button v-else type="primary" size="small" :disabled="!record.isEnable" @click="router.push({path:'/channel/test',query:{id:record.id}})" style="padding: 0 10px" >去测试</a-button>
              </a-flex>
            </template>
            <template v-if="column.dataIndex==='action'">
              <a-flex :gap="10">
                <a-button type="link" @click="router.push({path:'/channel/edit',query:{id:record['id']}})"  style="padding: 5px" >编辑</a-button>
                <a-button type="link" style="padding: 0"   v-if="!record['groupCode']" @click="openGroupModal(record)">添加分组</a-button>
                <a-button type="link" style="padding: 0"   v-if="record['groupCode']" @click="openGroupModal(record)">修改分组</a-button>
              </a-flex>
            </template>
          </template>
        </a-table>
      </a-card>


    </a-flex>
  </a-spin>
</template>

<style scoped lang="less">

</style>