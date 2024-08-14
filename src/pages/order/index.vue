<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";
import {PayChannelTypeSelectOption, PayModeTypeSelectOption,} from "../../utils/constant.ts";
import {OrderSearch, searchOrder,OrderTableType} from "~/api/order/OrderInterface.ts";
import OrderTablePanel from "~/pages/order/components/order-table-panel.vue";

const router=useRouter()
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
            <a-input  v-model:value="searchParams.orderNo"  allow-clear placeholder="请输入订单编号"> </a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-select style="width: 100%" mode="multiple" allow-clear :max-tag-count="1" v-model:value="searchParams.channelTypes" placeholder="所有渠道">
              <a-select-option v-for="(item) in PayChannelTypeSelectOption" :value="item.value">{{item.title}}</a-select-option>
            </a-select>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-select style="width: 100%" mode="multiple" allow-clear :max-tag-count="1" v-model:value="searchParams.payModes" placeholder="所有支付方式">
              <a-select-option v-for="(item) in PayModeTypeSelectOption" :value="item.value">{{item.title}}</a-select-option>
            </a-select>
          </a-col>
          <a-col class="gutter-row" :span="4">
             <a-input placeholder="请输入渠道ID"></a-input>
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