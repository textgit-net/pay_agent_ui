<script setup lang="ts">
import { h, createVNode  } from 'vue';
import {ColumnsType} from "ant-design-vue/es/table";
import {AlipaySquareFilled, ExclamationCircleOutlined, FormOutlined, FundViewOutlined } from "@ant-design/icons-vue"
import {PaginationProps,Modal,message} from "ant-design-vue";
import { ChannelGroupSimpleResponse, getChannelGroups} from '@/api/channel/group'

import {ChannelListResponse, ChannelSearch, searchChannel} from "~/api/channel/ChannelInterface.ts";
import {getPayChannelTypeText, PayChannelType, PayModeType, getPayModeTypeText, PayChannelTypeSelectOption} from "~/utils/constant.ts";
import { calcFloat } from '~/utils/calcFloat'
const router=useRouter()
const route = useRoute()
const columns:ColumnsType =[
  {
    title: '所属渠道组',
    dataIndex: 'group',
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
let { groupCode } = route.query
const initSearchParams = ():ChannelSearch => {
  return {
    page:1,
    limit:10,
    isIgnoreDisable:false,
    keyword: null,
    channelTypes: [],
    groupCodes: [groupCode as string]
  }
}
const searchParams=ref<ChannelSearch>(initSearchParams())


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
    loadData()
  },
})
const dataSource=shallowRef<ChannelListResponse[]>([])
const channelGroups = ref<ChannelGroupSimpleResponse[]>([])

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
  if (state.dataSourceLoading) return
  state.dataSourceLoading = true
  try {
    const { data } = await searchChannel({
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

const filterSearch=()=>{
  // Object.assign(searchParams,{
  //   page:1,
  //   limit:10
  // })
  // await loadData()

  pagination.onChange(1, pagination.pageSize)
}

watch(()=> searchParams.value.isIgnoreDisable, () => {
  filterSearch()
})


const fetchChanelGroups = async () => {
  let res = await getChannelGroups()
  channelGroups.value = res.data
}

const resetSearch=()=>{
  searchParams.value = initSearchParams();
  filterSearch()
}

onMounted(()=>{
  fetchChanelGroups()
  filterSearch()
})
</script>

<template>
  <a-spin :spinning="state.isPageLoading">
    <a-flex vertical :gap="10" style="width: 100%;height: 100%">
      <!--头部-->
      <a-card style="border: none" :body-style="{padding:'15px'}">
        <a-flex vertical :gap="15">
          <a-row :gutter="16">
            <!-- <a-col class="gutter-row" :span="4">
              <a-select
                v-model:value="searchParams.groupCodes"
                mode="multiple"
                style="width: 100%"
                placeholder="按渠道组查询"
                allow-clear
                :max-tag-count="2"
              >
                <a-select-option v-for="item in channelGroups" :value="item.groupCode">{{ item.name }}</a-select-option>
              </a-select>
            </a-col> -->

            <a-col class="gutter-row" :span="4">
              <a-select
                v-model:value="searchParams.channelTypes"
                mode="multiple"
                :max-tag-count="2"
                style="width: 100%"
                placeholder="按渠道类型查询"
                allow-clear
              >
                <a-select-option v-for="item in PayChannelTypeSelectOption" :value="item.value">{{ item.title }}</a-select-option>
              </a-select>
            </a-col>
            <a-col class="gutter-row" :span="4">
              <a-input v-model:value="searchParams.keyword" allow-clear  placeholder="按ID/名称查询" ></a-input>
            </a-col>
          </a-row>

          <a-flex  :gap="0" justify="start">
            <a-button type="link" style="padding-left: 0" @click="resetSearch">重置筛选</a-button>
            <a-button  size="small"  @click="filterSearch"  type="primary"  style="width: 80px;height:28px"  >筛选</a-button>
                <a-space style="padding-left: 20px;">
                  <a-typography-text type="secondary">是否忽略禁用的渠道</a-typography-text>
                  <a-tooltip>
                    <template #title>默认为不开启忽略禁用，若只查看开启的请进行勾选筛选</template>
                    <a-checkbox v-model:checked="searchParams.isIgnoreDisable"></a-checkbox>
                  </a-tooltip>
                </a-space>
          </a-flex>
        </a-flex>
      </a-card>

      <a-card :body-style="{'padding':'0px'}" >

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
              <a-flex :gap="5" align="center" justify="start">
                <a-typography-text type="success" strong>  {{ record.successCount }}</a-typography-text> /
                <a-typography-text type="danger" strong> {{ record.totalCount }}</a-typography-text>
                <a-tooltip>
                  <template #title>查看当前渠道订单信息</template>
                  <FundViewOutlined @click="router.push({path:'/channel/info',query:{id:record.id, tabKey: 'orderInfo'}})" style="color: #1677ff;padding-left: 3px" />
                </a-tooltip>
              </a-flex>
            </template>
            <template v-if="column.dataIndex==='successAmount'">
              <a-flex :gap="5" align="center" justify="start">
                <a-typography-text type="success" strong>  {{ record.successAmount }}</a-typography-text> /
                <a-typography-text type="danger" strong> {{ record.totalAmount }}</a-typography-text>
                <a-tooltip>
                  <template #title>查看当前渠道订单信息</template>
                  <FundViewOutlined @click="router.push({path:'/channel/info',query:{id:record.id, tabKey: 'orderInfo'}})" style="color: #1677ff;padding-left: 3px" />
                </a-tooltip>
              </a-flex>
            </template>

            <template v-if="column.dataIndex==='successRate'">
              <a-flex :gap="5" align="center">
                <a-typography-text v-if="record.totalCount" type="success" strong>  {{ (calcFloat.div(record.successCount, record.totalCount) * 100).toFixed(2) }}%</a-typography-text>
                <a-typography-text v-else type="success" strong> /</a-typography-text>
               
              </a-flex>
            </template>

            <template v-if="column.dataIndex==='group'">
              <a-typography-text v-if="!record.group" type="secondary">/</a-typography-text>
              <a-flex v-else vertical :gap="5" align="start">
                
                <!-- <a-tooltip>
                  <template #title>查看渠道组【{{(record.group as ChannelGroupSimpleResponse).name}}】详情</template>
                  <a-button style="padding-left: 0" type="link" @click="router.push({path:'/channel/info',query:{id:record.id}})">{{(record.group as ChannelGroupSimpleResponse).name}}</a-button>
                </a-tooltip> -->
                <a-typography-text type="secondary">{{(record.group as ChannelGroupSimpleResponse).name}}</a-typography-text>
                <a-typography-text type="secondary">编号:{{(record.group as ChannelGroupSimpleResponse).groupCode}}</a-typography-text>
              </a-flex>
            </template>



            <template v-if="column.dataIndex==='name'">
              <a-flex vertical :gap="5" align="start">
                <a-tooltip>
                  <template #title>查看渠道【{{record.name}}】详情</template>
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
              <a-flex align="center" justify="start">
                <a-tag v-if="record.isEnableRoyalty" :bordered="false" color="success">已配制</a-tag>
                <a-tag v-else :bordered="false" color="processing">未配制</a-tag>

                <a-tooltip>
                  <template #title>编辑渠道分账信息</template>
                  <FormOutlined @click="router.push({path:'/channel/info',query:{id:record.id, tabKey: 'channelAccountInfo'}})" style="color: #1677ff;" />
                </a-tooltip>
              </a-flex>
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
              
            </template>
            <template v-if="column.dataIndex==='action'">
              <a-flex :gap="10">

                <a-dropdown :trigger="['click']">
                  <a class="ant-dropdown-link" @click.prevent>
                    更多操作
                    <DownOutlined />
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="0">
                        <a-button style="padding-left: 0" type="link" @click="router.push({path:'/channel/info',query:{id:record.id}})">查看详情</a-button>
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="1">
                        <a-button type="link" @click="router.push({path:'/channel/edit',query:{id:record['id']}})"  style="padding: 5px" >编辑渠道</a-button>
                      </a-menu-item>
                      <a-menu-divider v-if="record.isEnable" />
                      <a-menu-item v-if="record.isEnable" key="2">
                        <a-button type="primary" size="small" :disabled="!record.isEnable" @click="router.push({path:'/channel/test',query:{id:record.id}})" style="padding: 0 10px" >渠道测试</a-button>
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
  </a-spin>
</template>

<style scoped lang="less">

</style>