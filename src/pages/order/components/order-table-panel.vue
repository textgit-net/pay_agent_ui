<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {AccessEnum, getPayChannelTypeText, getPayModeTypeText, PayChannelType, PayModeType} from "~/utils/constant.ts";
import CopyTextBtn from '~/components/copy-text-btn/index.vue'
import { updateParamsToUrl, getParamsFromUrl, flatten, unflatten} from '@/utils/tools'
import { DateSearchTypeEnum} from '@/components/date-search-wrap/type'
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
import {getOrderStatusText, OrderSearch, OrderStatus, OrderTableType, searchOrder, OrderNotifyStatusEnum, getOrderNotifyStatusEnumText} from "~/api/order/OrderInterface.ts";
import {PaginationProps, Modal} from "ant-design-vue";

const router = useRouter()

const props=defineProps<{
  tableType: number   | OrderTableType,
  hideChannelinfoColumn?: boolean,
  hideChannelorderColumn?: boolean,
  hidemchinfoColumn?: boolean,
  isDiabledChnnnelInfo?: boolean,
  isDiabledMchInfo?: boolean,
  searchParams?: null| OrderSearch,
}>()
const columns =shallowRef<any[]>(
    [
      {
        title: '订单编号',
        dataIndex: 'id',
        align:'left',
        fixed: 'left',
        width: '160px',
        tableTypes:[OrderTableType.ALL]
      },
      {
        title: '商家订单号',
        dataIndex: 'mchOrderNo',
        align:'left',
        fixed: 'left',
        width: '160px',
        tableTypes:[OrderTableType.ALL]
      },
      {
        title: '渠道订单号',
        align:'center',
        width: '160px',
        dataIndex: 'channelOrderNo',
        tableTypes:[OrderTableType.ALL,OrderTableType.PAY_ING,OrderTableType.SUCCESS,OrderTableType.FAIL],
        isHide: props.hideChannelorderColumn
      },

      {
        title: '渠道信息',
        dataIndex: 'channelInfo',
        width: '140px',
        tableTypes:[OrderTableType.ALL],
        isHide: props.hideChannelinfoColumn
      },
      {
        title: '商户信息',
        dataIndex: 'mchInfo',
        width: '140px',
        tableTypes:[OrderTableType.ALL],
        isHide: props.hidemchinfoColumn
      },
     

      // {
      //   title: '商品标题',
      //   align:'center',
      //   dataIndex: 'subject',
      //   tableTypes:[OrderTableType.ALL]
      // },

     

      {
        title: '订单金额',
        width: '120px',
        dataIndex: 'amount',
        tableTypes:[OrderTableType.ALL]
      },
      {
        title: '商户手续费',
        width: '120px',
        dataIndex: 'mchFeeAmount',
        tableTypes:[OrderTableType.PAY_ING,OrderTableType.SUCCESS,OrderTableType.FAIL],
      },
      // {
      //   title: '币种',
      //   align:'center',
      //   width: '60px',
      //   dataIndex: 'currency',
      //   tableTypes:[OrderTableType.ALL]
      // },
      

      {
        title: '订单状态',
        width: '130px',
        dataIndex: 'orderStatus',
        tableTypes:[OrderTableType.ALL]
      },
      {
        title: '支付方式',
        width: '120px',
        dataIndex: 'payMode',
        tableTypes:[OrderTableType.ALL,OrderTableType.PAY_ING,OrderTableType.SUCCESS,OrderTableType.FAIL],
      },
      {
        title: '回调状态',
        width: '130px',
        align:'left',
        dataIndex: 'notifyStatus',
        tableTypes:[OrderTableType.ALL]
      },
     
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        tableTypes:[OrderTableType.ALL]
      },
      {
        title: '完成时间',
        dataIndex: 'successTime',
        tableTypes:[OrderTableType.ALL,OrderTableType.PAY_ING,OrderTableType.SUCCESS],
      },
      // {
      //   title: '操作',
      //   align:'center',
      //   dataIndex: 'action',
      //   tableTypes:[OrderTableType.ALL]
      // }
    ]
)
const initSearchParams = ():OrderSearch => {
  return {
    page: 1,
    limit:10,
  }
}
const searchParams=ref<OrderSearch>(initSearchParams())

const state=reactive({
  dataSourceLoading:false
})
const dataSource=shallowRef<any[]>([])
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
const getOrderStatus=():OrderStatus[]=>{
  switch (props.tableType){
    case OrderTableType.ALL:
      return []
    case OrderTableType.WAIT_PAY:
      return [OrderStatus.WAIT_PAY]
    case OrderTableType.PAY_ING:
      return [OrderStatus.PAY_ING]
    case OrderTableType.SUCCESS:
      return [OrderStatus.SUCCESS]
    case OrderTableType.FAIL:
      return [OrderStatus.FAIL,OrderStatus.CANCEL,OrderStatus.CLOSE]
  }
}
const loadData=async  ()=> {
  if (state.dataSourceLoading) return
  state.dataSourceLoading = true
  console.log('searchParams.value 2', searchParams.value )
  try {
    const { data } = await searchOrder({
      ...searchParams.value,
      orderStatus:getOrderStatus(),
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

const resetSearch = (search:OrderSearch) => {
  searchParams.value = initSearchParams()
  refresh(search)
}

const refresh=async(search:OrderSearch)=>{
  Object.assign(searchParams.value, search)
  pagination.onChange(1, pagination.pageSize)
   
}
const filterColumns = () => {
  return columns.value.filter(v=>(v.tableTypes.includes(OrderTableType.ALL)||v.tableTypes.includes(props.tableType)) && !v.isHide)
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
    <a-table style="width: 100%" :scroll="{ x: 1300 }"  :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="filterColumns()" size="middle" :bordered="false">
      <template #emptyText>
        <a-empty></a-empty>
      </template>
      <template #bodyCell="{ column , record}">
        <template v-if="column.dataIndex==='id'">
          <a-flex justify="space-start" align="center" :gap="5" >
            <a-typography-text > {{ record.id }}</a-typography-text>
            <copy-text-btn :copytext="record.id" tipText="复制订单编号"></copy-text-btn>
          </a-flex>
        </template>
        <template v-if="column.dataIndex==='mchOrderNo'">
          <a-flex justify="space-start" align="center" :gap="5" >
            <a-typography-text > {{ record.mchOrderNo }}</a-typography-text>
            <copy-text-btn :copytext="record.mchOrderNo" tipText="复制商家订单号"></copy-text-btn>
          </a-flex>
        </template>

        <template v-if="column.dataIndex==='channelOrderNo'">
            <a-typography-text v-if="!record.channelOrderNo">/</a-typography-text>

            <a-flex v-else justify="space-start" align="center" :gap="5" >
              <a-typography-text > {{ record.channelOrderNo }}</a-typography-text>
              <copy-text-btn :copytext="record.channelOrderNo" tipText="复制渠道订单号"></copy-text-btn>
            </a-flex>
        </template>
        <template v-if="column.dataIndex==='orderStatus'">
            <a-tag v-if="record['orderStatus']===OrderStatus.WAIT_PAY" :bordered="false" color="processing" >
              <template #icon>
                <clock-circle-outlined />
              </template>
              {{getOrderStatusText(record['orderStatus'] as OrderStatus)}}
            </a-tag>
            <a-tag v-if="record['orderStatus']===OrderStatus.PAY_ING" :bordered="false" color="warning" > 
              <template #icon>
                <sync-outlined :spin="true" />
              </template>
              {{getOrderStatusText(record['orderStatus'] as OrderStatus)}}
            </a-tag>
            <a-tag v-if="record['orderStatus']===OrderStatus.SUCCESS" :bordered="false" color="success" >
              <template #icon>
                <check-circle-outlined />
              </template>{{getOrderStatusText(record['orderStatus'] as OrderStatus)}}
            </a-tag>
            <a-tag v-if="record['orderStatus']===OrderStatus.FAIL" :bordered="false" color="error" >
              <template #icon>
                <close-circle-outlined />
              </template>{{getOrderStatusText(record['orderStatus'] as OrderStatus)}}
            </a-tag>
            <a-tag v-if="record['orderStatus']===OrderStatus.CANCEL":bordered="false" color="error" > {{getOrderStatusText(record['orderStatus'] as OrderStatus)}}</a-tag>
            <a-tag v-if="record['orderStatus']===OrderStatus.CLOSE" :bordered="false" color="error" > {{getOrderStatusText(record['orderStatus'] as OrderStatus)}}</a-tag>
            <a-tooltip v-if="record['orderStatus']== OrderStatus.FAIL">
              
              <template #title>{{ record.errMsg }}</template>
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

        <template v-if="column.dataIndex==='amount'">
          ￥{{(parseFloat(record['amount']))}}
        </template>
        <template v-if="column.dataIndex==='payMode'">
          <a-typography-text v-if="record['payMode']">{{getPayModeTypeText(record['payMode'])}}</a-typography-text>
          <a-typography-text v-else>/</a-typography-text>
        </template>
        <template v-if="column.dataIndex==='successTime'">
          {{record['successTime']?? '/' }}
        </template>
        <template v-if="column.dataIndex==='mchFeeAmount'">
          {{record['mchFeeAmount']?? '/' }}
        </template>

        <template v-if="column.dataIndex==='mchInfo'">
          <a-flex v-if="record['mchInfo']" vertical :gap="5" align="start">
            <a-button v-if="!props.isDiabledMchInfo" style="padding-left: 0" type="link" @click="router.push({path:'/mch/info',query:{id:record['mchInfo'].id}})">{{record["mchInfo"].name}}</a-button>
            <a-typography-text v-else>{{record["mchInfo"].name}}</a-typography-text>
            <a-typography-text type="secondary">商户ID:{{record["mchInfo"].id}}</a-typography-text>
          </a-flex>
          <a-typography-text v-else>/</a-typography-text>
        </template>
       
        <template v-if="column.dataIndex==='channelInfo'">


          <a-flex v-if="record['channelInfo']" vertical :gap="5" align="start">
              <a-flex v-if="!props.isDiabledChnnnelInfo"  justify="start" align="center" :gap="5" >
                <a-tooltip>
                  
                  <template #title>查看渠道【{{record['channelInfo'].name}}】详情</template>
                
                  <a-space>
                    <a-flex justify="center" align="center">
                      <AlipaySquareFilled  style="font-size: 18px;color: dodgerblue"/>
                      <a-typography-link  @click="router.push({path:'/channel/info',query:{id:record['channelInfo'].id}})" style="padding-left: 3px;">{{record['channelInfo'].name}}</a-typography-link>
                    </a-flex>
                  </a-space>
                </a-tooltip>
              </a-flex>
              <a-space v-else>
                <a-flex justify="center" align="center">
                  <AlipaySquareFilled  style="font-size: 18px;color: dodgerblue"/>
                  <a-typography-text style="padding-left: 3px;">{{record['channelInfo'].name}}</a-typography-text>
                </a-flex>
              </a-space>
              <a-typography-text type="secondary">渠道ID:{{record['channelInfo'].id}}</a-typography-text>
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
