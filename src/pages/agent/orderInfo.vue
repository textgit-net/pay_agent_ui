<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";

import {PayChannelTypeSelectOption, PayModeTypeSelectOption, DateRange} from "@/utils/constant.ts";
import {OrderSearch, searchOrder,OrderTableType} from "~/api/order/OrderInterface.ts";
import { getChannelInfo, ChannelInfo, } from '~/api/channel/ChannelInterface'
import OrderTablePanel from "~/pages/order/components/order-table-panel.vue";
import {FileSearchOutlined } from "@ant-design/icons-vue"
import { getALLChannelList,ChannelListResponse, ALLChannelListRequest, } from "~/api/channel/ChannelInterface.ts";
import { DateSearchTypeEnum} from '@/components/date-search-wrap/type'
import { getParamsFromUrl} from '@/utils/tools'
import { calcFloat } from '@/utils/calcFloat'
import { getOrderStatisticsData, OrderStatisticsEnum, OrderStatisticsResponse} from '@/api/order/statistics'

const DateSearchWrapRef = ref()

const router=useRouter()
const route = useRoute()
const {id}= route.query
const state=reactive({
  isShowData: localStorage.getItem('AgentOrderListIsShowData')? eval(localStorage.getItem('AgentOrderListIsShowData')): false,
  isShowDataLoading: false,
  dataSourceLoading:false,
  isConfirmLoading:false
})
const tableRef=ref()
const inntSearchParams = ():OrderSearch => {
    return {
        page:1,
        limit:10,
        agentId: `${id}`,
        dateType:null
    } as OrderSearch
}

const searchParams = ref<OrderSearch>(inntSearchParams())

const info = ref<ChannelInfo>({})

const resetSearch=async ()=>{
  searchParams.value = inntSearchParams()
  DateSearchWrapRef.value.handleFormReset()
  tableRef.value.resetSearch(searchParams.value)
}



const allChannelListRequest = ref<ALLChannelListRequest>({
  isIgnoreDisable: true
})
const channelOpts = ref<ChannelListResponse[]>([])

const fetchALLChannelList = async () => {
  let res = await getALLChannelList(allChannelListRequest.value)
  channelOpts.value = res.data
}

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const dateChange = (dateRange: DateRange, dateType: DateSearchTypeEnum) => {
  searchParams.value.dateType = dateType
  if (dateRange) {
    searchParams.value.startDate = dateRange.startDate
    searchParams.value.endDate = dateRange.endDate
  } else {
    searchParams.value.startDate = null
    searchParams.value.endDate = null
  }
  tableRef.value.refresh(searchParams.value)
}

const initDataValue = (): OrderStatisticsResponse => {
    if (localStorage.getItem('AgentOrderListStatisticsData')) {
      return JSON.parse(localStorage.getItem('AgentOrderListStatisticsData'))
    }
    return {
        totalAmount: 0,
        todayAmount: 0,
        yesterdayAmount: 0,
        totalCount: 0,
        todayCount: 0,
        yesterdayCount: 0,
        totalSuccessCount: 0,
        todaySuccessCount: 0,
        yesterdaySuccessCount: 0,
        totalFailCount: 0,
        todayFailCount: 0,
        yesterdayFailCount: 0,
    }
}
const statisticsData = ref<OrderStatisticsResponse>(initDataValue())
watch(() => state.isShowData, (val) => {
  localStorage.setItem('AgentOrderListIsShowData', val)
  if (val) {
    getStatisticsData()
    console.log(val)
  } else {
    localStorage.removeItem('AgentOrderListStatisticsData')
    localStorage.removeItem('AgentOrderListIsShowData')
  }
})
const getStatisticsData = async () => {
    state.isShowDataLoading = true;
    try {
      let res = await getOrderStatisticsData({
        type: OrderStatisticsEnum.agent,
        params: `${id}`,
      })
      localStorage.setItem('AgentOrderListStatisticsData', JSON.stringify( res.data))
      statisticsData.value = res.data
    } catch (error) {
        
    } finally {
        state.isShowDataLoading = false;
    }
}

watch(() => searchParams.value.orderStatus, () => {
  tableRef.value.refresh(searchParams.value)
})
let defaultDateRange = ref<DateRange>(null)

onBeforeMount(()=>{
  if (getParamsFromUrl()) {
    searchParams.value = Object.assign(searchParams.value, getParamsFromUrl())
  }

  if (searchParams.value.startDate) {
    defaultDateRange.value = {
      startDate: searchParams.value.startDate,
      endDate: searchParams.value.endDate
    } 
  }

  fetchALLChannelList()
  if (state.isShowData && searchParams.value.page == 1) {
    getStatisticsData()
  }
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!-- <a-card style="border: none" :body-style="{padding:'15px'}">
      <a-flex vertical :gap="15">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="4">
            <a-input  v-model:value="searchParams.orderNo"  allow-clear placeholder="请输入订单编号"> </a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-input  v-model:value="searchParams.mchOrderNo"  allow-clear placeholder="按商家订单号查询"> </a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-input  v-model:value="searchParams.channelOrderNo"  allow-clear placeholder="按渠道订单号查询"> </a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-select style="width: 100%" mode="multiple" allow-clear :max-tag-count="2" v-model:value="searchParams.channelTypes" placeholder="所有渠道">
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

          
        
          <a-button type="primary" size="small" style="width: 80px;height:27.99px"  @click="tableRef.refresh(searchParams)">搜索</a-button>
          
          <a-button type="link" style="padding-left: 0px" @click="resetSearch">重置搜索</a-button>
          <a-space>
            <a-typography-text type="secondary">是否展示统计数据</a-typography-text>
            <a-checkbox v-model:checked="state.isShowData"></a-checkbox>
          </a-space>
        </a-flex>
      </a-flex>
    </a-card> -->

    <a-card style="border: none" :body-style="{padding:'15px'}">
      <a-flex vertical :gap="15">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="4">
            <a-input  v-model:value="searchParams.orderNo"  allow-clear placeholder="按订单编号查询"> </a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-input  v-model:value="searchParams.mchOrderNo"  allow-clear placeholder="按商家订单号查询"> </a-input>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-input  v-model:value="searchParams.channelOrderNo"  allow-clear placeholder="按渠道订单号查询"> </a-input>
          </a-col>
          <!-- <a-col class="gutter-row" :span="4">
            <a-select style="width: 100%" mode="multiple" allow-clear :max-tag-count="2" v-model:value="searchParams.channelTypes" placeholder="按渠道类型查询">
              <a-select-option v-for="(item) in PayChannelTypeSelectOption" :value="item.value">{{item.title}}</a-select-option>
            </a-select>
          </a-col> -->
          <a-col class="gutter-row" :span="4">
            <a-select placeholder="按支付渠道筛选" :filter-option="filterOption"  show-search v-model:value="searchParams.channelId"  allow-clear style="width: 100%;">
              <a-select-option v-for="(item) in channelOpts" :value="item.id" :label="item.name" >{{item.name}}</a-select-option>
            </a-select>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-select style="width: 100%" mode="multiple" allow-clear :max-tag-count="1" v-model:value="searchParams.payModes" placeholder="按支付方式查询">
              <a-select-option v-for="(item) in PayModeTypeSelectOption" :value="item.value">{{item.title}}</a-select-option>
            </a-select>
          </a-col>

          <a-col class="gutter-row" :span="24">
            <date-search-wrap @date-change="dateChange" :default-range-date="defaultDateRange" :default-date-type="searchParams.dateType" ref="DateSearchWrapRef" />
          </a-col>
          
        </a-row>

        <a-flex justify="flex-start" align="center"  :gap="10" >
          <a-button type="link" style="padding-left: 0px" @click="resetSearch">重置筛选</a-button>
          <a-button type="primary" size="small" style="width: 80px;height:27.99px"  @click="tableRef.refresh(searchParams)">
            <template #icon>
              <FileSearchOutlined />
            </template>
            筛选
          </a-button>
          <a-space>
            <a-typography-text type="secondary">是否展示统计数据</a-typography-text>
            <a-tooltip>
                <template #title>勾选展示当前代理商订单统计数据</template>
              <a-checkbox v-model:checked="state.isShowData"></a-checkbox>
            </a-tooltip>
          </a-space>
        </a-flex>
      </a-flex>
    </a-card>
    <a-spin :spinning="state.isShowDataLoading" tip="更新数据中...">
      <a-card v-show="state.isShowData" :body-style="{padding: '15px'}">
          <a-descriptions :column="5" layout="vertical">
            <template #title>
                <a-flex  align="center">
                  <a-typography-text>订单数据统计信息</a-typography-text>
                </a-flex>
            </template>
          
            
              
            <a-descriptions-item style="padding-bottom: 4px; padding-top: 0;" :labelStyle="{'color':'#999'}" label="交易额">
              <a-flex vertical style="padding-top: 4px;">
                <a-flex >
                  <a-typography-text type="secondary">总计：</a-typography-text>
                  <a-tooltip>
                    <template #title>全部订单累计金额</template>
                    <a-typography-text strong style="color: rgb(22, 119, 255);"> ￥{{  statisticsData.totalAmount }}</a-typography-text>
                  </a-tooltip>
                </a-flex>
                
                <a-flex justify="space-between" style="padding-top: 4px;">

      
                  <a-flex>
                    <a-typography-text type="secondary">今日：</a-typography-text>
                    <a-tooltip>
                      <template #title>今日订单累计金额</template>
                      <a-typography-text strong style="color: rgb(22, 119, 255);">￥{{ statisticsData.todayAmount }}</a-typography-text>
                    </a-tooltip>
                    
                  </a-flex>
                
                  <a-flex style="padding-left: 40px;">
                    <a-typography-text type="secondary">昨日：</a-typography-text>
                    <a-tooltip>
                      <template #title>昨日订单累计金额</template>
                      <a-typography-text strong style="color: rgb(22, 119, 255);">￥{{ statisticsData.yesterdayAmount }}</a-typography-text>
                    </a-tooltip>
                  </a-flex>
                
                </a-flex>
              </a-flex>
            </a-descriptions-item>
            <a-descriptions-item style="padding-bottom: 4px; padding-top: 0;" :labelStyle="{'color':'#999'}" label="交易笔数">
              <a-flex vertical style="padding-top: 4px;">
                <a-flex>
                  <a-typography-text type="secondary">总计：</a-typography-text>
                  <a-tooltip>
                    <template #title>全部订单累计交易笔数</template>
                    <a-typography-text strong style="color: purple;">{{ statisticsData.totalCount }}</a-typography-text>
                  </a-tooltip>
                  
                </a-flex>
                <a-flex justify="space-between" style="padding-top: 4px;">
                  <a-flex>
                    <a-typography-text type="secondary">今日：</a-typography-text>
                    <a-tooltip>
                      <template #title>今日订单累计交易笔数</template>
                      <a-typography-text strong style="color: purple;">{{ statisticsData.todayCount }}</a-typography-text>
                    </a-tooltip>
                  </a-flex>
                  <a-flex style="padding-left: 40px;">
                    <a-typography-text type="secondary">昨日：</a-typography-text>
                    <a-tooltip>
                      <template #title>昨日订单累计交易笔数</template>
                      <a-typography-text strong style="color: purple;">{{ statisticsData.yesterdayCount }}</a-typography-text>
                    </a-tooltip>
                  </a-flex>
                </a-flex>
              </a-flex>
            </a-descriptions-item>
          
            <a-descriptions-item style="padding-bottom: 4px;padding-top: 0;" :labelStyle="{'color':'#999'}" label="成交笔数">
              <a-flex vertical style="padding-top: 4px;">
                <a-flex >
                  <a-typography-text type="secondary">总计：</a-typography-text>
                  <a-tooltip>
                    <template #title>全部订单累计成功笔数</template>
                    <a-typography-text type="success" strong>{{ statisticsData.totalSuccessCount }}</a-typography-text>
                  </a-tooltip>
                </a-flex>
                <a-flex justify="space-between" style="padding-top: 4px;">
                  <a-flex>
                    <a-typography-text type="secondary">今日：</a-typography-text>
                    <a-tooltip>
                      <template #title>今日订单累计成功笔数</template>
                      <a-typography-text type="success" strong>{{ statisticsData.todaySuccessCount }}</a-typography-text>
                    </a-tooltip>
                  </a-flex>
                  <a-flex style="padding-left: 40px;">
                    <a-typography-text type="secondary">昨日：</a-typography-text>
                    <a-tooltip>
                      <template #title>昨日订单累计成功笔数</template>
                      <a-typography-text type="success" strong>{{ statisticsData.yesterdaySuccessCount }}</a-typography-text>
                    </a-tooltip>
                  </a-flex>
                </a-flex>
              </a-flex>
            </a-descriptions-item>
            <a-descriptions-item style="padding-bottom: 4px;" :labelStyle="{'color':'#999'}" label="失败笔数">
              <a-flex vertical style="padding-top: 4px;">
                <a-flex>
                  <a-typography-text type="secondary">总计：</a-typography-text>
                  
                  <a-tooltip>
                    <template #title>全部订单累计失败笔数</template>
                    <a-typography-text type="danger" strong>{{ statisticsData.totalFailCount }}</a-typography-text>
                  </a-tooltip>
                </a-flex>
                <a-flex justify="space-between" style="padding-top: 4px;">
                  <a-flex>
                    <a-typography-text type="secondary">今日：</a-typography-text>
                    <a-tooltip>
                      <template #title>今日订单累计失败笔数</template>
                      <a-typography-text type="danger" strong>{{ statisticsData.todayFailCount }}</a-typography-text>
                    </a-tooltip>
                  </a-flex>
                  <a-flex style="padding-left: 40px;">
                    <a-typography-text type="secondary">昨日：</a-typography-text>
                    <a-tooltip>
                      <template #title>昨日订单累计失败笔数</template>
                      <a-typography-text type="danger" strong>{{ statisticsData.yesterdayFailCount }}</a-typography-text>
                    </a-tooltip>
                  </a-flex>
                </a-flex>
              </a-flex>
            </a-descriptions-item>
            
            <a-descriptions-item style="padding-bottom: 4px;" :labelStyle="{'color':'#999'}" label="成功率">
              <a-flex vertical style="padding-top: 4px;">
                <a-flex>
                  <a-typography-text type="secondary">总计：</a-typography-text>
                  
                  <a-tooltip>
                    <template #title>全部订单成功率</template>
                    <a-typography-text v-if="statisticsData.totalSuccessCount > 0" type="success" strong>
                      {{ calcFloat.multi(calcFloat.div(statisticsData.totalSuccessCount,  statisticsData.totalCount),100).toFixed(2) }}%
                    </a-typography-text>
                    <a-typography-text v-else type="danger" strong>
                      0%
                    </a-typography-text>
                  </a-tooltip>
                </a-flex>
                <a-flex justify="space-between" style="padding-top: 4px;">
                  <a-flex>
                    <a-typography-text type="secondary">今日：</a-typography-text>
                    <a-tooltip>
                      <template #title>今日订单成功率</template>
                      <a-typography-text v-if="statisticsData.todaySuccessCount > 0" type="success" strong>
                
                        {{ calcFloat.multi(calcFloat.div(statisticsData.todaySuccessCount,  statisticsData.todayCount),100).toFixed(2) }}%
                      </a-typography-text>
                      <a-typography-text v-else type="danger" strong>
                        0%
                      </a-typography-text>
                    </a-tooltip>
                  </a-flex>
                  <a-flex style="padding-left: 40px;">
                    <a-typography-text type="secondary">昨日：</a-typography-text>
                    <a-tooltip>
                      <template #title>昨日订单成功率</template>
                      <a-typography-text v-if="statisticsData.yesterdaySuccessCount > 0" type="success" strong>
                        {{ calcFloat.multi( calcFloat.div(statisticsData.yesterdaySuccessCount,  statisticsData.yesterdayCount),100).toFixed(2) }}%
                      </a-typography-text>
                      <a-typography-text v-else type="danger" strong>
                        0%
                      </a-typography-text>
                    </a-tooltip>
                  </a-flex>
                </a-flex>
              </a-flex>
            </a-descriptions-item>
          </a-descriptions>
      </a-card>
    </a-spin>


    <a-card >
      <a-tabs destroy-inactive-tab-pane >
        <a-tab-pane key="all" tab="全部">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.ALL" :search-params="searchParams" :is-diabled-mch-info="true" :is-diabled-chnnnel-info="true" />
        </a-tab-pane>
        <a-tab-pane key="waitPay" tab="待支付">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.WAIT_PAY" :search-params="searchParams" :is-diabled-mch-info="true" :is-diabled-chnnnel-info="true" />
        </a-tab-pane>
        <a-tab-pane key="payIng" tab="支付中">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.PAY_ING" :search-params="searchParams" :is-diabled-mch-info="true" :is-diabled-chnnnel-info="true" />
        </a-tab-pane>
        <a-tab-pane key="paySuccess" tab="成功">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.SUCCESS" :search-params="searchParams" :is-diabled-mch-info="true" :is-diabled-chnnnel-info="true" />
        </a-tab-pane>
        <a-tab-pane key="payFail" tab="失败">
          <OrderTablePanel ref="tableRef" :table-type="OrderTableType.FAIL" :search-params="searchParams" :is-diabled-mch-info="true" :is-diabled-chnnnel-info="true" />
        </a-tab-pane>
      </a-tabs>


    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>