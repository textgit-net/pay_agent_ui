<script setup lang="ts">
import { calcFloat } from '@/utils/calcFloat'
import { getOrderStatisticsData, OrderStatisticsEnum, OrderStatisticsResponse} from '@/api/order/statistics'

export interface PropsType {
    type?: OrderStatisticsEnum;
    isShow?: boolean;
}

const props = withDefaults(defineProps<Partial<PropsType>>(), {
  type: OrderStatisticsEnum.agent,
  isShow: false

});

interface Emits {
  (e: 'update:isShowStatistics', visible: boolean): void;
}

const emit = defineEmits<Emits>();

const isShowStatistics = computed({
  get: () => props.isShow,
  set: (newVal) => {
    console.log('newVal', newVal)
    emit('update:isShowStatistics', newVal);
  },
});

const route = useRoute()
const {id, page}= route.query
const state=reactive({
  isShowDataLoading: false
})

const initDataValue = (): OrderStatisticsResponse => {
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
watch(() => isShowStatistics.value, (val) => {
  if (val) {
    getStatisticsData()
  }
})
const getStatisticsData = async () => {
    state.isShowDataLoading = true;
    try {
      let res = await getOrderStatisticsData({
        type: props.type,
        params: id as string
      })
      localStorage.setItem(`[orderType-${props.type}][orderStatisticeData]`, JSON.stringify(res.data))
      statisticsData.value = res.data
    } catch (error) {
        
    } finally {
      state.isShowDataLoading = false;
    }
}

onBeforeMount(()=>{
    if (isShowStatistics.value && !page) {
      getStatisticsData()
    } else if (localStorage.getItem(`[orderType-${props.type}][orderStatisticeData]`)) {
      statisticsData.value =  JSON.parse(localStorage.getItem(`[orderType-${props.type}][orderStatisticeData]`))
    }
})
</script>

<template>
    <a-spin :spinning="state.isShowDataLoading" tip="更新数据中...">
      <a-card v-show="isShowStatistics" :body-style="{padding: '15px'}">
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
</template>

<style scoped lang="less">

</style>