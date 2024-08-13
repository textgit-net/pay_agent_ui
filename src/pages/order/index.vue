<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";
import {PayChannelTypeSelectOption,} from "../../utils/constant.ts";
import {OrderSearch, searchOrder,OrderTableType} from "~/api/order/OrderInterface.ts";
import OrderTablePanel from "~/pages/order/components/order-table-panel.vue";

const router=useRouter()
const editContentModalRef=ref(null)
const columns:ColumnsType =[
  {
    title: '订单编号',
    dataIndex: 'id',
  },
  {
    title: '商户信息',
    dataIndex: 'mchOrderNo',
  },
  {
    title: '商品信息',
    dataIndex: 'subject',
  },
  {
    title: '商家订单号',
    dataIndex: 'mchOrderNo',
  },
  {
    title: '订单金额',
    dataIndex: 'amount',
  },
  {
    title: '币种',
    dataIndex: 'currency',
  },
  {
    title: '商户手续费',
    dataIndex: 'mchFeeAmount',
  },

  {
    title: '订单状态',
    dataIndex: 'orderStatus',
  },
  {
    title: '回调状态',
    dataIndex: 'notifyStatus',
  },
  {
    title: '渠道订单号',
    dataIndex: 'channelOrderNo',
  },
  {
    title: '完成时间',
    dataIndex: 'successTime',
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
  },
  {
    title:'操作',
    dataIndex: 'action',
  },
]
const state=reactive({
  dataSourceLoading:false,
  isConfirmLoading:false
})
const tableRef=ref()
const searchParams = reactive<OrderSearch>({
  page:1,
  limit:10
})

const resetSearch=async ()=>{
  Object.assign(searchParams,{
    page:1,
    limit:10
  })
  tableRef.value.refresh(searchParams)
}


onMounted(()=>{

})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>订单列表</a-typography-text>
      </a-flex>
    </a-card>
    <a-card style="border: none" :body-style="{padding:'15px'}">
      <a-flex vertical :gap="15">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="4">
            <a-input  v-model:value="searchParams.keywords"  allow-clear placeholder="请输入订单编号"> </a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-select style="width: 100%">
              <a-select-option :value="null">所有</a-select-option>
              <a-select-option v-for="(item) in PayChannelTypeSelectOption" :value="item.value">{{item.title}}</a-select-option>
            </a-select>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-range-picker style="width: 100%" />
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-input placeholder="请输入商户ID" allow-clear></a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
             <a-input placeholder="请输入商户渠道ID"></a-input>
          </a-col>
        </a-row>

        <a-flex justify="flex-start" align="center"  :gap="10" >
          <a-button type="link" style="padding-left: 0px" @click="resetSearch">重置筛选</a-button>
          <a-button type="primary" size="small" style="width: 80px;height:27.99px"  @click="tableRef.refresh(searchParams)">筛选</a-button>
        </a-flex>
      </a-flex>
    </a-card>
    <a-card >
      <a-tabs destroy-inactive-tab-pane >
        <a-tab-pane key="all" tab="全部">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.ALL" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="waitPay" tab="待支付">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.WAIT_PAY" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="payIng" tab="支付中">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.PAY_ING" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="paySuccess" tab="成功">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.SUCCESS" :search-params="searchParams"/>
        </a-tab-pane>
        <a-tab-pane key="payFail" tab="失败">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.FAIL" :search-params="searchParams"/>
        </a-tab-pane>
      </a-tabs>


    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>