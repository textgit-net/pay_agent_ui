

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


import {MchwalletRecordRequest,getWalletRecord,WallTypeEnum,WalletRecordInfo} from '@/api/merchant/wallet'
import {PaginationProps, Modal} from "ant-design-vue";

const router = useRouter()


const columns =shallowRef<any[]>(
    [
      {
        title: '批次号',
        dataIndex: 'id',
        align:'left',
        fixed: 'left',
        width: '180px',
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL]
      },
      {
        title: '备注',
        dataIndex: 'remark',
  
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL],
      },
      {
        title: '动账前',

        dataIndex: 'beforeAmount',
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL]
      },

      {
        title: '流水值',

        dataIndex: 'amount',
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL]
      },
      {
        title: '动账后',

        dataIndex: 'afterAmount',
        tableTypes:[ChannelWithdrawTableTypeEnum.ALL]
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
const initSearchParams = ():MchwalletRecordRequest => {
  return {
    page: 1,
    limit:10,
  }
}
const searchParams=ref<MchwalletRecordRequest>(initSearchParams())
const props=defineProps<{
  tableType: number   | ChannelWithdrawTableTypeEnum,
  searchParams?: null| MchwalletRecordRequest,
  isDiabledChnnnelInfo?: boolean,
}>()
const state=reactive({
  dataSourceLoading:false
})
const dataSource=shallowRef<WalletRecordInfo[]>([])
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
    const { data } = await getWalletRecord({
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

const resetSearch = (search:MchwalletRecordRequest) => {
  searchParams.value = initSearchParams()
  refresh(search)
}

const refresh=async(search:MchwalletRecordRequest)=>{
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
            <!-- <a-tooltip>
              <template #title>点击查看账单批号【{{record['id']}}】详情</template>
              {{ record.id }}
              <a-typography-link  @click="router.push({path:'/order/royalty-detail',query:{id:record['id']}})"> {{ record.id }}</a-typography-link>
            </a-tooltip> -->
            {{ record.id }}
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
            <a-space>
              <a-tooltip>
                <template #title>收款账号姓名</template>
                <a-typography-text>{{ record.accountRealName }}</a-typography-text>
              </a-tooltip>
            </a-space>
            <!-- <a-tooltip>
              <template #title>收款账号</template>
              <a-typography-text>{{ record.accountNo }}</a-typography-text>
              <copy-text-btn :copytext="record.accountNo" tipText="复制收款账号"></copy-text-btn>
            </a-tooltip> -->
            <a-space>
              <a-typography-text>{{ record.accountNo }}</a-typography-text>
              <copy-text-btn :copytext="record.accountNo" tipText="复制收款账号"></copy-text-btn>
            </a-space>
            
          </a-flex>
        </template>
        <template v-if="column.dataIndex==='amount'">
          <a-typography-text>{{(record['direction'])}}{{(parseFloat(record['amount']))}}</a-typography-text>
          
        </template>
        <template v-if="column.dataIndex==='remark'">
          <a-typography-text>{{record['remark']?? '/'}}</a-typography-text>
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