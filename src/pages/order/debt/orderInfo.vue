

<script setup lang="ts">
import CopyTextBtn from '~/components/copy-text-btn/index.vue'
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  QuestionCircleFilled,
  LoadingOutlined,
  AlipaySquareFilled,
} from '@ant-design/icons-vue';
import {getOrderStatusText, OrderStatus} from "~/api/order/OrderInterface.ts";
import { 
    DebtOrderStatusEnum,
    getDebtOrderStatusEnumText,
    DebtOrderTableTypeEnum,
    BaseDebtAccountOrderSearch,
    DebtOrderInfo,
    getDebtAccountOrderList,
    getDebtAccountOrderInfo,
    DebtOrderAccountInfo,
    DebtSplitOrderInfo
} from '@/api/debt/order'


import {PaginationProps, Modal} from "ant-design-vue";

const router = useRouter()
const route = useRoute()


const columns =shallowRef<any[]>(
    [
      {
        title: '#ID',
        dataIndex: 'id',
        align:'left',
        fixed: 'left',
      },
      {
        title: '第三方订单号',
        dataIndex: 'outOrderNo',
        align:'left',
        fixed: 'left',
      },
      {
        title: '分账账号类型',
        dataIndex: 'accountType',
      },
      {
        title: '分账账号',
        dataIndex: 'accountInfo',
      },
      
      {
        title: '订单金额',
        dataIndex: 'amount',
    
      },
      {
        title: '比率',
        dataIndex: 'rete',
      },

      {
        title: '订单状态',
        dataIndex: 'status',

      },
      {
        title: '完成时间',
        dataIndex: 'finishTime',

      },
     
      {
        title: '创建时间',
        dataIndex: 'createTime',
      },
      
      // {
      //   title: '操作',
      //   align:'center',
      //   dataIndex: 'action',
      //   tableTypes:[DebtOrderTableTypeEnum.ALL]
      // }
    ]
)

const state=reactive({
  isLoading:false
  
})

const info = ref<DebtOrderInfo>({})
const dataSource=shallowRef<DebtSplitOrderInfo[]>([])



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

const getInfo=async (id:string)=>{
  state.isLoading=true
  const {data} =await getDebtAccountOrderInfo(id)
  info.value = data
  dataSource.value = info.value.items
  state.isLoading=false
}


const {id}= route.query
onMounted(async ()=>{
  if(id){
    await getInfo(id as string)
  }
})
</script>

<template>

<a-card :body-style="{padding: '15px'}">

  <a-card :body-style="{padding: '15px', marginBottom: '20px'}" :loading="state.isLoading">
      <a-descriptions :column="4" layout="vertical">
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="订单金额">
          <a-typography-text strong type="danger"  style="font-size: 12px">￥{{info.orderAmount}}</a-typography-text >
        </a-descriptions-item>
        
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="分账小计">
          <a-typography-text strong type="danger"  style="font-size: 12px">￥{{info.amount}}</a-typography-text >
        </a-descriptions-item>
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="分账笔数">
          <a-typography-text  style="font-size: 12px">{{info.splitCount}}</a-typography-text >
        </a-descriptions-item>
      
        <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="分账状态">
          <a-tag v-if="info.status===DebtOrderStatusEnum.WAIT_ING" :bordered="false" color="processing" >
              <template #icon>
                <clock-circle-outlined />
              </template>
              {{getDebtOrderStatusEnumText(info.status as DebtOrderStatusEnum)}}
            </a-tag>
            <a-tag v-if="info.status===DebtOrderStatusEnum.PROCESS" :bordered="false" color="warning" > 
              <template #icon>
                <sync-outlined :spin="true" />
              </template>
              {{getDebtOrderStatusEnumText(info.status as DebtOrderStatusEnum)}}
            </a-tag>
            <a-tag v-if="info.status===DebtOrderStatusEnum.SUCCESS" :bordered="false" color="success" >
              <template #icon>
                <check-circle-outlined />
              </template>{{getDebtOrderStatusEnumText(info.status as DebtOrderStatusEnum)}}
            </a-tag>
            <a-tag v-if="info.status===DebtOrderStatusEnum.FAIL" :bordered="false" color="error" >
              <template #icon>
                <close-circle-outlined />
              </template>{{getDebtOrderStatusEnumText(info.status as DebtOrderStatusEnum)}}
            </a-tag>
            <!-- <a-tooltip v-if="info.status== DebtOrderStatusEnum.FAIL">
              
              <template #title>点击查看订单状态错误信息</template>
              <QuestionCircleFilled @click="viewOrderStatusErrorInfo(info)" style="color: #ff4d4f;" />
            </a-tooltip> -->
        </a-descriptions-item>
       
        
      </a-descriptions>

      <!-- <a-descriptions :column="4" layout="vertical" style="padding-top: 20px;">
         
        
          <a-descriptions-item style="padding-bottom: 4px" :labelStyle="{'color':'#999'}"  label="分账金额">
            <a-tooltip>
                <template #title>成功金额</template>
                <a-typography-text type="success" strong> ￥{{ info.successAmount }}</a-typography-text>
            </a-tooltip> / 
            <a-tooltip>
                <template #title>总分账金额</template>
                <a-typography-text type="danger" strong>  ￥{{ info.totalRoyaltyAmount }}</a-typography-text>
            </a-tooltip>
          </a-descriptions-item>
          
        </a-descriptions> -->

      
  </a-card>
  <div style="width: 100%;">
    <a-table style="width: 100%" :scroll="{ x: 1300 }"  :data-source="dataSource" :pagination="false" :loading="state.isLoading"  :columns="columns" size="middle" :bordered="false">
      <template #emptyText>
        <a-empty></a-empty>
      </template>
      <template #bodyCell="{ column , record}">
        <template v-if="column.dataIndex==='id'">
          <a-flex justify="space-start" align="center" :gap="5" >
            <a-typography-text> {{ record.id }}</a-typography-text>
            <!-- <copy-text-btn :copytext="record.id" tipText="复制批次号"></copy-text-btn> -->
          </a-flex>
        </template>
        <template v-if="column.dataIndex==='outOrderNo'">
          <a-flex justify="space-start" align="center" :gap="5" >
            <a-typography-text> {{ record.outOrderNo?? '/' }}</a-typography-text>
            <copy-text-btn v-if="record.outOrderNo" :copytext="record.outOrderNo" tipText="复制第三方订单号"></copy-text-btn>
          </a-flex>
        </template>

        <template v-if="column.dataIndex==='status'">
            <a-tag v-if="record['status']===OrderStatus.WAIT_PAY" :bordered="false" color="processing" >
              <template #icon>
                <clock-circle-outlined />
              </template>
              {{getOrderStatusText(record['status'] as OrderStatus)}}
            </a-tag>
            <a-tag v-if="record['status']===OrderStatus.PAY_ING" :bordered="false" color="warning" > 
              <template #icon>
                <sync-outlined :spin="true" />
              </template>
              {{getOrderStatusText(record['status'] as OrderStatus)}}
            </a-tag>
            <a-tag v-if="record['status']===OrderStatus.SUCCESS" :bordered="false" color="success" >
              <template #icon>
                <check-circle-outlined />
              </template>{{getOrderStatusText(record['status'] as OrderStatus)}}
            </a-tag>
            <a-tag v-if="record['status']===OrderStatus.FAIL" :bordered="false" color="error" >
              <template #icon>
                <close-circle-outlined />
              </template>{{getOrderStatusText(record['status'] as OrderStatus)}}
            </a-tag>
            <a-tag v-if="record['status']===OrderStatus.CANCEL":bordered="false" color="error" > {{getOrderStatusText(record['orderStatus'] as OrderStatus)}}</a-tag>
            <a-tag v-if="record['status']===OrderStatus.CLOSE" :bordered="false" color="error" > {{getOrderStatusText(record['orderStatus'] as OrderStatus)}}</a-tag>
            <a-tooltip v-if="record['status']== OrderStatus.FAIL">
              
              <template #title>点击查看订单状态错误信息</template>
              <QuestionCircleFilled @click="viewOrderStatusErrorInfo(record)" style="color: #ff4d4f;" />
            </a-tooltip>
        </template>
        <template v-if="column.dataIndex==='accountType'">

          <a-tooltip>
            <template #title>分账类型</template>
            <a-typography-text strong>{{ (record.account as DebtOrderAccountInfo).channelTypeText  }}</a-typography-text>
          </a-tooltip>

        </template>

        <template v-if="column.dataIndex==='accountInfo'">

          <a-tooltip>
            <template #title>真实姓名</template>
            <a-typography-text strong>{{ (record.account as DebtOrderAccountInfo).realName  }}</a-typography-text>
          </a-tooltip> / 
          <a-tooltip>
            <template #title>分账账号</template>
            <a-typography-text strong>{{(record.account as DebtOrderAccountInfo).accountNo  }}</a-typography-text>
          </a-tooltip>
          
        </template>
      

        <template v-if="column.dataIndex==='amount'">
          ￥{{record['amount']}}
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

   
        <template v-if="column.dataIndex==='finishTime'">
          {{record['finishTime']?? '/' }}
        </template>
        <template v-if="column.dataIndex==='rete'">
          {{record['rete']}}%
        </template>
        <template v-if="column.dataIndex==='action'">
          <a-button type="link" style="padding: 5px" >详情</a-button>
        </template>
      </template>
    </a-table>
  </div>
</a-card>
</template>

<style scoped lang="less">

</style>