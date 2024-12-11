<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table"
import {PaginationProps} from "ant-design-vue"
import {FileSearchOutlined } from '@ant-design/icons-vue';
import {
  ProductOrderReportSearch,
  getProductOrderReportData
} from "~/api/order/report.ts"
import { PayModeTypeSelectOption, DateRange} from "~/utils/constant.ts"
import { getAllAgentList, AgentOptItem } from '@/api/agent'
import { getAllMerchantList, MerchantOptItem } from '@/api/merchant'
import { getALLChannelList,ChannelListResponse, ALLChannelListRequest, } from "~/api/channel/ChannelInterface.ts";
import { getChannelGroups,ChannelGroupSimpleResponse } from '@/api/channel/group'
import { calcFloat } from '~/utils/calcFloat'
import { DateSearchTypeEnum} from '@/components/date-search-wrap/type'
const userStore = useUserStore()
const PayModeOptions = useOptsStore().payModesOpts
const router=useRouter()
const columns:ColumnsType =[
  {
    title: '产品编码',
    dataIndex: 'productCode',
  },
  // {
  //   title: '产品',
  //   dataIndex: 'productName',
  // },
  {
    title: '交易总额',
    dataIndex: 'totalOrderAmount',
  },
  {
    title: '实收金额',
    dataIndex: 'totalSuccessOrderAmount',
  },
  {
    title: '手续费',
    dataIndex: 'totalFeeAmount',
  },
  {
    title: '交易笔数',
    dataIndex: 'totalOrderCount',
  },
  {
    title:'成交笔数',
    dataIndex:'totalSuccessOrderCount'
  },
  {
    title:'超时笔数',
    dataIndex:'totalSuccessOrderCount'
  },
  {
    title:'异常笔数',
    dataIndex:'totalSuccessOrderCount'
  },
  {
    title: '成功率',
    dataIndex: 'successRate',
  }
]
const state=reactive({
  dataSourceLoading:false
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
    loadData()
  },
})
const DateSearchWrapRef = ref()
const inntSearchParams = ():ProductOrderReportSearch => {
  return {
    page:1,
    limit:10,
    products: []
  } as ProductOrderReportSearch
}
const searchParams = ref<ProductOrderReportSearch>({
  page:1,
  limit:10
})
const dataSource=shallowRef<any>([])
const resetSearch=async ()=>{
  searchParams.value = inntSearchParams()
  DateSearchWrapRef.value.tranferReset()
  handleSearch()
}
const handleSearch = () => {
  pagination.onChange(1, pagination.pageSize)
}

const loadData=async  ()=> {
  if (state.dataSourceLoading) return
  state.dataSourceLoading = true
  try {
    const { data } = await getProductOrderReportData({
      ...searchParams.value,
      page: pagination.current,
      limit: pagination.pageSize,
    })
    dataSource.value = data?.rows ?? []
    pagination.total = data?.total ?? 0
  }catch (e){
    console.error(e)
  }finally{
    state.dataSourceLoading = false
  }
}

const groupsOpts = shallowRef<ChannelGroupSimpleResponse[]>([])
const loadGroups = async () => {
  const { data } = await getChannelGroups()
  groupsOpts.value = data ?? []
  
}

const dateChange = (dateRange: DateRange) => {
  if (dateRange) {
    searchParams.value.startDate = dateRange.startDate
    searchParams.value.endDate = dateRange.endDate
  } else {
    searchParams.value.startDate = null
    searchParams.value.endDate = null
  }
  handleSearch()
}

const filterPruductOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const filterAgentOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const filterMchOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const allChannelListRequest = ref<ALLChannelListRequest>({
  isIgnoreDisable: true
})
const channelOpts = ref<ChannelListResponse[]>([])
const fetchALLChannelList = async () => {
  let res = await getALLChannelList(allChannelListRequest.value)
  channelOpts.value = res.data
}


const machOpts = ref<MerchantOptItem[]>([])
const fetchAllMerchantList = async () => {
  let res = await getAllMerchantList()
  machOpts.value = res.data
}

const agentOpts = ref<AgentOptItem[]>([])
const fetchAllAgentList = async () => {
  let res = await getAllAgentList()
  agentOpts.value = res.data
}

const calcSuccessRate = (successCount: number ,totalCount: number): number => {
  if (successCount) {
    return calcFloat.multi(calcFloat.div(successCount, totalCount), 100).toFixed(2)
  } 
  return 0
}

onMounted(()=>{
  Promise.all([
    fetchALLChannelList(),
    fetchAllMerchantList(),
    fetchAllAgentList(),
    // loadGroups()
  ])
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>支付产品订单数据报表</a-typography-text>
      </a-flex>
    </a-card>
    <a-card style="border: none" :body-style="{padding:'15px'}">
      <a-flex vertical :gap="15">
        <a-row :gutter="16">

          <!-- <a-col class="gutter-row" :span="6">
            <a-select v-model:value="searchParams.agentIds" placeholder="按代理商查询" mode="multiple" :filter-option="filterAgentOption" :max-tag-count="1" show-search allow-clear style="width: 100%;">
              <a-select-option v-for="(item) in agentOpts" :value="item.id" :label="item.name" >{{item.name}}</a-select-option>
            </a-select>
          </a-col> -->

          <a-col class="gutter-row" :span="6">
            <a-select v-model:value="searchParams.mchIds" placeholder="按商户查询" mode="multiple" :filter-option="filterMchOption" :max-tag-count="1" show-search  allow-clear style="width: 100%;">
              <a-select-option v-for="(item) in machOpts" :value="item.id" :label="item.name" >{{item.name}}</a-select-option>
            </a-select>
          </a-col>
         
          <a-col class="gutter-row" :span="5">
            <a-select placeholder="按支付产品查询" mode="multiple" :filter-option="filterPruductOption" show-search v-model:value="searchParams.products" :max-tag-count="1" allow-clear style="width: 100%;">
              <a-select-option v-for="(item) in userStore.userInfo.products" :value="item.productCode" :label="item.productCode" >{{item.productCode}}</a-select-option>
            </a-select>
          </a-col>
          <!-- <a-col class="gutter-row" :span="5">
            <a-select style="width: 100%" mode="multiple" allow-clear :max-tag-count="1" v-model:value="searchParams.payModes" placeholder="按支付方式查询">
              <a-select-option v-for="(item) in PayModeOptions" :value="item.payMode">{{item.payModeName}}</a-select-option>
            </a-select>
          </a-col> -->
          <a-col class="gutter-row" :span="24">
            <date-search-wrap :is-can-clear="false" :default-date-type="DateSearchTypeEnum.today" :immediatelyDateChange="true" @date-change="dateChange" ref="DateSearchWrapRef" />
          </a-col>
        </a-row>

        <a-flex justify="flex-start" :gap="0">
          <a-button type="link" style="padding-left: 0px" @click="resetSearch">重置筛选</a-button>
          <a-button type="primary" size="small" style="width: 80px;height:27.99px"  @click="handleSearch">
            <template #icon>
              <FileSearchOutlined />
            </template>
            筛选
          </a-button>
        </a-flex>
      </a-flex>
    </a-card>
    <a-card >
      <a-table style="width: 100%" :scroll="{ x: 1200 }"  :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
        <template #emptyText>
          <a-empty></a-empty>
        </template>
        <template #bodyCell="{ column , record}">
            <template v-if="column.dataIndex==='productCode'">
              <a-flex vertical :gap="5" align="start">
                <a-typography-text>{{record.productCode ?? '/'}}</a-typography-text>
              </a-flex>
              
            </template>
            <template v-if="column.dataIndex==='productName'">
              <a-flex vertical>
                <a-tooltip>
                  <template #title>点击查看渠道【{{record.productName}}】详情</template>
                  <a-typography-link @click="router.push({path:'/channel/group-info',query:{groupCode:record.productCode}})">{{record.productName ?? '/'}}</a-typography-link>
                </a-tooltip>
              </a-flex>
              
            </template>

            <template v-if="column.dataIndex==='successRate'">
            
              <a-typography-text v-if="record.totalSuccessOrderCount > 0" type="success" strong>{{calcSuccessRate(record.totalSuccessOrderCount, record.totalOrderCount)}}%</a-typography-text>
              <a-typography-text v-else type="danger" strong>{{calcSuccessRate(record.totalSuccessOrderCount, record.totalOrderCount)}}%</a-typography-text>
            </template> 
        </template>
      </a-table>

    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>