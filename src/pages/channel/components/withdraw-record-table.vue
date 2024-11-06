

<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import { getPayModeTypeText} from "~/utils/constant.ts";
import CopyTextBtn from '~/components/copy-text-btn/index.vue'
import { updateParamsToUrl, getParamsFromUrl} from '@/utils/tools'
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
import {getChannelWithdrawRecord,ChannelWithdrawSearch,ChannelWithdrawInfo,ChannelWithdrawTableTypeEnum,ChannelWithdrawStatusEnum,getChannelWithdrawStatusEnumText} from '@/api/channel/withdraw'
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
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL]
      },

      {
        title: '第三方订单号',
        dataIndex: 'transferOutNo',
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL]
      },
      {
        title: '渠道信息',
        dataIndex: 'channelInfo',
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL],
      },
      {
        title: '提现账号',
        width: '180px',
        dataIndex: 'accountNo',
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL]
      },
      {
        title: '提现金额',

        dataIndex: 'amount',
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL]
      },
      {
        title: '提现备注',
        dataIndex: 'remark',
  
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL],
      },
      {
        title: '提现发起人',
        dataIndex: 'applyBy',
  
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL],
      },
    
      
      {
        title: '订单状态',
        dataIndex: 'status',
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL]
      },
      {
        title: '转账时间',
        dataIndex: 'transferFinishTime',
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL],
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL],
      },
     
      {
        title: '创建时间',
        dataIndex: 'createTime',
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL]
      },
      
      // {
      //   title: '操作',
      //   align:'center',
      //   dataIndex: 'action',
      //   tableTypes:[ChannelWithdrawTableTypeEnum.ALL]
      // }
    ]
)
const initSearchParams = ():ChannelWithdrawSearch => {
  return {
    page: 1,
    limit:10,
  }
}
const searchParams=ref<ChannelWithdrawSearch>(initSearchParams())
const props=defineProps<{
  tableType: number   | ChannelWithdrawTableTypeEnum,
  searchParams?: null| ChannelWithdrawSearch,
}>()
const state=reactive({
  dataSourceLoading:false
})
const dataSource=shallowRef<ChannelWithdrawInfo[]>([])
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
const getOrderStatus=():ChannelWithdrawStatusEnum=>{
  switch (props.tableType){
    case ChannelWithdrawTableTypeEnum.ALL:
      return null
    case ChannelWithdrawTableTypeEnum.AUDIT:
      return ChannelWithdrawStatusEnum.AUDIT
    case ChannelWithdrawTableTypeEnum.PROCESS:
      return ChannelWithdrawStatusEnum.PROCESS
    case ChannelWithdrawTableTypeEnum.TRANSFER:
      return ChannelWithdrawStatusEnum.TRANSFER
    case ChannelWithdrawTableTypeEnum.SUCCESS:
      return ChannelWithdrawStatusEnum.SUCCESS
    case ChannelWithdrawTableTypeEnum.TRANSFER_FAIL:
      return ChannelWithdrawStatusEnum.TRANSFER_FAIL
    case ChannelWithdrawTableTypeEnum.AUDIT_REJECT:
      return ChannelWithdrawStatusEnum.AUDIT_REJECT
  }
}
const loadData=async  ()=> {
  if (state.dataSourceLoading) return
  state.dataSourceLoading = true
  console.log('searchParams.value 2', searchParams.value )
  try {
    const { data } = await getChannelWithdrawRecord({
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
  let errDom = h('p', record['transferError'])
  Modal.error({
    title: getChannelWithdrawStatusEnumText(record['status']),
    content: h('div', {}, [errDom]),
    onOk() {
      console.log('ok');
    },
  });
}

const resetSearch = (search:ChannelWithdrawSearch) => {
  searchParams.value = initSearchParams()
  refresh(search)
}

const refresh=async(search:ChannelWithdrawSearch)=>{
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
    <a-table style="width: 100%" :scroll="{ x: 1300 }"  :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns.filter(v=>v.tableTypes.includes(ChannelWithdrawTableTypeEnum.ALL)||v.tableTypes.includes(tableType))" size="middle" :bordered="false">
      <template #emptyText>
        <a-empty></a-empty>
      </template>
      <template #bodyCell="{ column , record}">
        <template v-if="column.dataIndex==='id'">
          <a-flex justify="space-start" align="center" :gap="5" >
            <a-tooltip>
              <template #title>点击查看账单批号【{{record['id']}}】详情</template>
              {{ record.id }}
              <!-- <a-typography-link  @click="router.push({path:'/order/royalty-detail',query:{id:record['id']}})"> {{ record.id }}</a-typography-link> -->
            </a-tooltip>
            <copy-text-btn :copytext="record.id" tipText="复制批次号"></copy-text-btn>
          </a-flex>
        </template>

        <template v-if="column.dataIndex==='transferOutNo'">
          <a-flex justify="flex-start" align="center" :gap="5" >
            <a-tooltip>
              <template #title>转账第三方订单号</template>
              <a-typography-text>{{ record.transferOutNo?? '/' }}</a-typography-text>
              
            </a-tooltip>
            <copy-text-btn v-if="record.transferOutNo" :copytext="record.transferOutNo" tipText="复制第三方订单号"></copy-text-btn>
          </a-flex>
        </template>


       
        <template v-if="column.dataIndex==='status'">
            <a-tag v-if="record['status']===ChannelWithdrawStatusEnum.PROCESS" :bordered="false" color="processing" >
              <template #icon>
                <clock-circle-outlined />
              </template>
              {{getChannelWithdrawStatusEnumText(record['status'] as ChannelWithdrawStatusEnum)}}
            </a-tag>
            <a-tag v-if="record['status']===ChannelWithdrawStatusEnum.TRANSFER" :bordered="false" color="warning" > 
              <template #icon>
                <sync-outlined :spin="true" />
              </template>
              {{getChannelWithdrawStatusEnumText(record['status'] as ChannelWithdrawStatusEnum)}}
            </a-tag>
            <a-tag v-if="record['status']===ChannelWithdrawStatusEnum.SUCCESS" :bordered="false" color="success" >
              <template #icon>
                <check-circle-outlined />
              </template>{{getChannelWithdrawStatusEnumText(record['status'] as ChannelWithdrawStatusEnum)}}
            </a-tag>
            <a-tag v-if="record['status']===ChannelWithdrawStatusEnum.TRANSFER_FAIL" :bordered="false" color="error" >
              <template #icon>
                <close-circle-outlined />
              </template>{{getChannelWithdrawStatusEnumText(record['status'] as ChannelWithdrawStatusEnum)}}
            </a-tag>
            <a-tag v-if="record['status']===ChannelWithdrawStatusEnum.AUDIT_REJECT" :bordered="false" color="error" >
              <template #icon>
                <close-circle-outlined />
              </template>{{getChannelWithdrawStatusEnumText(record['status'] as ChannelWithdrawStatusEnum)}}
            </a-tag>
            <a-tooltip v-if="record['status']== ChannelWithdrawStatusEnum.TRANSFER_FAIL || record['status']== ChannelWithdrawStatusEnum.AUDIT_REJECT">
              
              <template #title>{{ record.transferError }}</template>
              <QuestionCircleFilled @click="viewOrderStatusErrorInfo(record)" style="color: #ff4d4f;" />
            </a-tooltip>
        </template>

        <template v-if="column.dataIndex==='accountNo'">
          <a-flex vertical justify="flex-start">
            <a-tooltip>
              <template #title>收款账号姓名</template>
              <a-typography-text>{{ record.accountRealName }}</a-typography-text>
            </a-tooltip>
            <a-tooltip>
              <template #title>收款账号</template>
              <a-typography-text>{{ record.accountNo }}</a-typography-text>
            </a-tooltip>
          </a-flex>
        </template>
        <template v-if="column.dataIndex==='amount'">
          <a-typography-text>￥{{(parseFloat(record['amount']))}}</a-typography-text>
          
        </template>
        <template v-if="column.dataIndex==='remark'">
          <a-typography-text>{{record['remark']?? '/'}}</a-typography-text>
        </template>
        <template v-if="column.dataIndex==='transferFinishTime'">
          {{record['transferFinishTime']?? '/' }}
        </template>
        <template v-if="column.dataIndex==='updateTime'">
          {{record['updateTime']?? '/' }}
        </template>
        <template v-if="column.dataIndex==='applyBy'">


          <a-flex vertical :gap="5" align="start">
              <a-flex justify="start" align="center" :gap="5" >
                <a-tooltip>
                  
                  <template #title>查看账号【{{record['applyByName']}}】详情</template>
                
                  <a-space>
                    <a-flex justify="center" align="center">
                      {{record['applyByName']}}
                      <!-- <a-typography-link  @click="router.push({path:'/channel/info',query:{id:record['applyBy']}})" style="padding-left: 3px;">{{record['applyByName']}}</a-typography-link> -->
                    </a-flex>
                  </a-space>
                </a-tooltip>
              </a-flex>
              <a-typography-text type="secondary">账号ID:{{record['channelId']}}</a-typography-text>
            </a-flex>
        </template>
       
        <template v-if="column.dataIndex==='channelInfo'">


          <a-flex v-if="record['channelId']" vertical :gap="5" align="start">
              <a-flex justify="start" align="center" :gap="5" >
                <a-tooltip>
                  
                  <template #title>查看渠道【{{record['channelName']}}】详情</template>
                
                  <a-space>
                    <a-flex justify="center" align="center">
                      <AlipaySquareFilled @click="router.push({path:'/channel/info',query:{id:record['channelId']}})" style="font-size: 18px;color: dodgerblue"/>
                      <a-typography-link  @click="router.push({path:'/channel/info',query:{id:record['channelId']}})" style="padding-left: 3px;">{{record['channelName']}}</a-typography-link>
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