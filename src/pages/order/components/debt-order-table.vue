

<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {AccessEnum, getPayChannelTypeText, getPayModeTypeText, PayChannelType, PayModeType} from "~/utils/constant.ts";
import CopyTextBtn from '~/components/copy-text-btn/index.vue'
import { updateParamsToUrl, getParamsFromUrl, flatten, unflatten} from '@/utils/tools'
import { getDebtModeEnumText, getDebtStrategyEnumText } from '@/api/channel/debt'
import { toRaw} from 'vue'

import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  QuestionCircleFilled,
  LoadingOutlined,
  AlipaySquareFilled,
} from '@ant-design/icons-vue';
import {getOrderStatusText, OrderSearch, searchOrder, OrderNotifyStatusEnum, getOrderNotifyStatusEnumText} from "~/api/order/OrderInterface.ts";
import { DebtOrderStatusEnum, getDebtOrderStatusEnumText,DebtOrderTableTypeEnum, BaseDebtAccountOrderSearch, DebtOrderInfo,getDebtAccountOrderList } from '@/api/debt/order'
import {PaginationProps, Modal} from "ant-design-vue";

const router = useRouter()


const columns =shallowRef<any[]>(
    [
      {
        title: '批次号',
        dataIndex: 'id',
        align:'left',
        fixed: 'left',
        width: '160px',
        tableTypes:[DebtOrderTableTypeEnum.ALL]
      },
      {
        title: '订单编号',
        dataIndex: 'orderId',
        align:'left',
        fixed: 'left',
        width: '160px',
        tableTypes:[DebtOrderTableTypeEnum.ALL]
      },
   
      {
        title: '渠道信息',
        dataIndex: 'channelInfo',
        width: '140px',
        tableTypes:[DebtOrderTableTypeEnum.ALL],
      },
  

      {
        title: '订单金额',

        dataIndex: 'orderAmount',
        tableTypes:[DebtOrderTableTypeEnum.ALL]
      },
      {
        title: '分账小计',

        dataIndex: 'amount',
        tableTypes:[DebtOrderTableTypeEnum.ALL]
      },

      {
        title: '分账金额',

        dataIndex: 'successAmount',
        tableTypes:[DebtOrderTableTypeEnum.ALL]
      },
      {
        title: '分账笔数',

        dataIndex: 'splitCount',
        tableTypes:[DebtOrderTableTypeEnum.ALL]
      },
      {
        title: '分账比率',

        dataIndex: 'royaltyRate',
        tableTypes:[DebtOrderTableTypeEnum.ALL]
      },
      
      {
        title: '分账模式',

        dataIndex: 'royaltyMode',
        tableTypes:[DebtOrderTableTypeEnum.ALL]
      },
      {
        title: '分账策略',

        dataIndex: 'royaltyStrategy',
        tableTypes:[DebtOrderTableTypeEnum.ALL]
      },
     
     

      {
        title: '订单状态',
        dataIndex: 'status',
        tableTypes:[DebtOrderTableTypeEnum.ALL]
      },
      {
        title: '完成时间',
        dataIndex: 'finishTime',
        tableTypes:[DebtOrderTableTypeEnum.ALL],
      },
     
      {
        title: '创建时间',
        dataIndex: 'createTime',
        tableTypes:[DebtOrderTableTypeEnum.ALL]
      },
      
      // {
      //   title: '操作',
      //   align:'center',
      //   dataIndex: 'action',
      //   tableTypes:[DebtOrderTableTypeEnum.ALL]
      // }
    ]
)
const initSearchParams = ():BaseDebtAccountOrderSearch => {
  return {
    page: 1,
    limit:10,
  }
}
const searchParams=ref<BaseDebtAccountOrderSearch>(initSearchParams())
const props=defineProps<{
  tableType: number   | DebtOrderTableTypeEnum,
  searchParams?: null| BaseDebtAccountOrderSearch,
}>()
const state=reactive({
  dataSourceLoading:false
})
const dataSource=shallowRef<DebtOrderInfo[]>([])
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
    router.replace({ query: {...JSON.parse(JSON.stringify(searchParams.value)), timestamp: new Date().getTime()}})
    // console.log('333333 ', toReactive(searchParams),toRaw(toReactive(searchParams))  )
    // console.log('flatten', flatten(toReactive(searchParams.value)))
    // loadData()
  },
})
const getOrderStatus=():DebtOrderStatusEnum=>{
  switch (props.tableType){
    case DebtOrderTableTypeEnum.ALL:
      return null
    case DebtOrderTableTypeEnum.WAIT_ING:
      return DebtOrderStatusEnum.WAIT_ING
    case DebtOrderTableTypeEnum.PROCESS:
      return DebtOrderStatusEnum.PROCESS
    case DebtOrderTableTypeEnum.SUCCESS:
      return DebtOrderStatusEnum.SUCCESS
    case DebtOrderTableTypeEnum.FAIL:
      return DebtOrderStatusEnum.FAIL
  }
}
const loadData=async  ()=> {
  if (state.dataSourceLoading) return
  state.dataSourceLoading = true
  console.log('searchParams.value 2', searchParams.value )
  try {
    const { data } = await getDebtAccountOrderList({
      ...searchParams.value,
      status:getOrderStatus(),
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

const viewOrderStatusErrorInfo = (record: any) => {
  let errDom = h('p', record['errMsg'])
  Modal.error({
    title: '订单状态错误信息',
    content: h('div', {}, [errDom]),
    onOk() {
      console.log('ok');
    },
  });
}

const resetSearch = (search:BaseDebtAccountOrderSearch) => {
  searchParams.value = initSearchParams()
  refresh(search)
}

const refresh=async(search:BaseDebtAccountOrderSearch)=>{
  Object.assign(searchParams.value, search)
  pagination.onChange(1, pagination.pageSize)
   
}
defineExpose({refresh, loadData, resetSearch})
onMounted(()=>{
  if (props.searchParams) {
    searchParams.value = Object.assign(searchParams.value, props.searchParams)
  }
  if (getParamsFromUrl()) {
    searchParams.value = Object.assign(searchParams.value, getParamsFromUrl())
  }
  if (searchParams.value.page) {
    pagination.current = searchParams.value.page
    pagination.pageSize = searchParams.value.limit
  }

  console.log(' props.searchParams',  props.searchParams)
  loadData()
})

</script>

<template>
  <div style="width: 100%;">
    <a-table style="width: 100%" :scroll="{ x: 1300 }"  :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns.filter(v=>v.tableTypes.includes(DebtOrderTableTypeEnum.ALL)||v.tableTypes.includes(tableType))" size="middle" :bordered="false">
      <template #emptyText>
        <a-empty></a-empty>
      </template>
      <template #bodyCell="{ column , record}">
        <template v-if="column.dataIndex==='id'">
          <a-flex justify="space-start" align="center" :gap="5" >
            <a-tooltip>
              <template #title>查看账单批号【{{record['id']}}】详情</template>
              <a-typography-link  @click="router.push({path:'/order/royalty-detail',query:{id:record['id']}})"> {{ record.id }}</a-typography-link>
            </a-tooltip>
            <copy-text-btn :copytext="record.id" tipText="复制批次号"></copy-text-btn>
          </a-flex>
        </template>
        <template v-if="column.dataIndex==='orderId'">
          <a-flex justify="space-start" align="center" :gap="5" >

            <a-tooltip>
                <template #title>查看订单号【{{record['orderId']}}】详情</template>
                <a-typography-link  @click="router.push({path:'',query:{id:record['orderId']}})"> {{ record.orderId }}</a-typography-link>
            </a-tooltip>
            <copy-text-btn :copytext="record.orderId" tipText="复制订单号"></copy-text-btn>
          </a-flex>
        </template>

       
        <template v-if="column.dataIndex==='status'">
            <a-tag v-if="record['status']===DebtOrderStatusEnum.WAIT_ING" :bordered="false" color="processing" >
              <template #icon>
                <clock-circle-outlined />
              </template>
              {{getDebtOrderStatusEnumText(record['status'] as DebtOrderStatusEnum)}}
            </a-tag>
            <a-tag v-if="record['status']===DebtOrderStatusEnum.PROCESS" :bordered="false" color="warning" > 
              <template #icon>
                <sync-outlined :spin="true" />
              </template>
              {{getDebtOrderStatusEnumText(record['status'] as DebtOrderStatusEnum)}}
            </a-tag>
            <a-tag v-if="record['status']===DebtOrderStatusEnum.SUCCESS" :bordered="false" color="success" >
              <template #icon>
                <check-circle-outlined />
              </template>{{getDebtOrderStatusEnumText(record['status'] as DebtOrderStatusEnum)}}
            </a-tag>
            <a-tag v-if="record['status']===DebtOrderStatusEnum.FAIL" :bordered="false" color="error" >
              <template #icon>
                <close-circle-outlined />
              </template>{{getDebtOrderStatusEnumText(record['status'] as DebtOrderStatusEnum)}}
            </a-tag>
            <a-tooltip v-if="record['status']== DebtOrderStatusEnum.FAIL">
              
              <template #title>点击查看订单状态错误信息</template>
              <QuestionCircleFilled @click="viewOrderStatusErrorInfo(record)" style="color: #ff4d4f;" />
            </a-tooltip>
        </template>

        <template v-if="column.dataIndex==='notifyStatus'">
            <a-flex align="center" justify="start">
             
              <a-tag v-if="record['notifyStatus']==OrderNotifyStatusEnum.NO_NEED" color="processing" >
                <template #icon>
                  <clock-circle-outlined />
                </template>
                {{getOrderNotifyStatusEnumText(OrderNotifyStatusEnum.NO_NEED)}}
              </a-tag>
              <a-tag v-if="record['notifyStatus']==OrderNotifyStatusEnum.WAIT_HANDLE" color="processing" > 
                <template #icon>
                  <clock-circle-outlined />
                </template>
                {{getOrderNotifyStatusEnumText(OrderNotifyStatusEnum.WAIT_HANDLE)}}
              </a-tag>
              <a-tag v-if="record['notifyStatus']==OrderNotifyStatusEnum.HANDLE_ING" color="processing" > 
                <template #icon>
                  <sync-outlined :spin="true" />
                </template>
                {{getOrderNotifyStatusEnumText(OrderNotifyStatusEnum.HANDLE_ING)}}
              </a-tag>
              <a-tag v-if="record['notifyStatus']==OrderNotifyStatusEnum.SUCCESS" color="success" >
                <template #icon>
                  <check-circle-outlined />
                </template>{{getOrderNotifyStatusEnumText(OrderNotifyStatusEnum.SUCCESS)}}
              </a-tag>
              <a-tag v-if="record['notifyStatus']==OrderNotifyStatusEnum.FAIL_RETRY" color="warning" >
                <template #icon>
                  <sync-outlined :spin="true" />
                </template>{{getOrderNotifyStatusEnumText(OrderNotifyStatusEnum.FAIL_RETRY)}}
              </a-tag>
              <a-tag v-if="record['notifyStatus']==OrderNotifyStatusEnum.FAIL" color="error" >
                <template #icon>
                  <close-circle-outlined />
                </template>{{getOrderNotifyStatusEnumText(OrderNotifyStatusEnum.FAIL)}}
              </a-tag>
              
              <!-- <a-tooltip v-if="record['notifyStatus']== OrderNotifyStatusEnum.FAIL">
                
                <template #title>点击查看订单回调失败错误信息</template>
                <QuestionCircleFilled @click="viewOrderStatusErrorInfo(record)" style="color: #ff4d4f;" />
              </a-tooltip> -->
            </a-flex>
          
        </template>

        <template v-if="column.dataIndex==='orderAmount'">
          ￥{{(parseFloat(record['orderAmount']))}}
        </template>
        <template v-if="column.dataIndex==='amount'">
          ￥{{(parseFloat(record['amount']))}}
        </template>
        <template v-if="column.dataIndex==='successAmount'">
            <a-flex :gap="5" align="center" justify="start">
                <a-tooltip>
                    <template #title>成功金额</template>
                    <a-typography-text type="success" strong> ￥{{ record.successAmount }}</a-typography-text>
                </a-tooltip> / 
                <a-tooltip>
                    <template #title>总分账金额</template>
                    <a-typography-text type="danger" strong>  ￥{{ record.totalRoyaltyAmount }}</a-typography-text>
                </a-tooltip>
                
                <!-- <a-tooltip>
                    <template #title>查看当前渠道订单信息</template>
                    <FundViewOutlined @click="router.push({path:'/channel/info',query:{id:record.id, tabKey: 'orderInfo'}})" style="color: #1677ff;padding-left: 3px" />
                </a-tooltip> -->
            </a-flex>
        </template>

        <template v-if="column.dataIndex==='payMode'">
          <a-typography-text v-if="record['payMode']">{{getPayModeTypeText(record['payMode'])}}</a-typography-text>
          <a-typography-text v-else>/</a-typography-text>
        </template>
        <template v-if="column.dataIndex==='finishTime'">
          {{record['finishTime']?? '/' }}
        </template>
        <template v-if="column.dataIndex==='royaltyRate'">
          {{record['royaltyRate']}}%
        </template>
        <template v-if="column.dataIndex==='royaltyMode'">
            <a-typography-text>{{ getDebtModeEnumText(record.royaltyMode) }}</a-typography-text>
        </template>
        <template v-if="column.dataIndex==='royaltyStrategy'">
            <a-typography-text>{{ getDebtStrategyEnumText(record.royaltyStrategy) }}</a-typography-text>
        </template>
       
        <template v-if="column.dataIndex==='channelInfo'">


          <a-flex v-if="record['channelId']" vertical :gap="5" align="start">
              <a-flex justify="start" align="center" :gap="5" >
                <a-tooltip>
                  
                  <template #title>查看渠道【{{record['chanelName']}}】详情</template>
                
                  <a-space>
                    <a-flex justify="center" align="center">
                      <AlipaySquareFilled @click="router.push({path:'/channel/info',query:{id:record['channelId']}})" style="font-size: 18px;color: dodgerblue"/>
                      <a-typography-link  @click="router.push({path:'/channel/info',query:{id:record['channelId']}})" style="padding-left: 3px;">{{record['chanelName']}}</a-typography-link>
                    </a-flex>
                  </a-space>
                </a-tooltip>
              </a-flex>
              <a-typography-text type="secondary">渠道ID:{{record['channelId']}}</a-typography-text>
            </a-flex>
          
          <a-typography-text v-else>/</a-typography-text>
        </template>
        <template v-if="column.dataIndex==='action'">
          <a-button type="link" style="padding: 5px" >详情</a-button>
        </template>
      </template>
    </a-table>
  </div>

</template>

<style scoped lang="less">

</style>