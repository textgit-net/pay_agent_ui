<script setup lang="ts">
import CountUp from 'vue-countup-v3'
import CommonCard from "~/pages/dashboard/analysis/components/common-card.vue";
import {  SyncOutlined} from "@ant-design/icons-vue";
import { SelectOption } from '~/utils/constant'
import {OrderStatisticsEnum,OrderStatisticsRequest, OrderStatisticsResponse,getOrderStatistics } from '@/api/dashboard'

enum RefreshIntervalEnum {
    _30s = 30 * 1000,
    _60s = 60 * 1000,
    _120s = 120 * 1000,
    _180s = 180 * 1000,
}

const getRefreshIntervalEnumText = (type: RefreshIntervalEnum) => {
    switch (type) {
        case RefreshIntervalEnum._30s:
            return '30秒'
        case RefreshIntervalEnum._60s:
            return '1分钟'
        case RefreshIntervalEnum._120s:
            return '2分钟'
        case RefreshIntervalEnum._180s:
            return '3分钟'
    }
}

const refreshIntervalOpts:SelectOption<RefreshIntervalEnum>[] = [
    {
        value: RefreshIntervalEnum._30s,
        title: getRefreshIntervalEnumText(RefreshIntervalEnum._30s)
    },
    {
        value: RefreshIntervalEnum._60s,
        title: getRefreshIntervalEnumText(RefreshIntervalEnum._60s)
    },
    {
        value: RefreshIntervalEnum._120s,
        title: getRefreshIntervalEnumText(RefreshIntervalEnum._120s)
    },
    {
        value: RefreshIntervalEnum._180s,
        title: getRefreshIntervalEnumText(RefreshIntervalEnum._180s)
    }
]

const state = reactive<{
    isOpenRefresh: boolean;
    dataLoading: boolean;
}>({
    isOpenRefresh: false,
    dataLoading: false
})

const query = ref<OrderStatisticsRequest>({
    type: OrderStatisticsEnum.merchant
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
const originStatisticsData = ref<OrderStatisticsResponse>(initDataValue())
const statisticsData = ref<OrderStatisticsResponse>(initDataValue())

const refreshInterval = ref(RefreshIntervalEnum._60s)
let refreshTimer = null
const countUpRef1 = ref()
const countUpRef2 = ref()
const countUpRef3 = ref()
const countUpRef4 = ref()
const countUpRef5 = ref()
const countUpRef6 = ref()
const countUpRef7 = ref()
const countUpRef8 = ref()
const countUpRef9 = ref()
const countUpRef10 = ref()
const countUpRef11 = ref()
const countUpRef12 = ref()


const handleRefresh = () => {
    clearInterval(refreshTimer);
    refreshTimer = null;
    getData()
}

const getData = async () => {
    state.dataLoading = true;
    originStatisticsData.value = JSON.parse(JSON.stringify(statisticsData.value))
    try {
        let res = await getOrderStatistics(query.value)
        statisticsData.value = res.data
        restartCountUp();
        handleRefreshTimer();
    } catch (error) {
        
    } finally {
        state.dataLoading = false;
    }
    
}

const changeOpenRefreshStatus = () => {
    console.log('state', state.isOpenRefresh)
    handleRefreshTimer()
    
}
const changeRefreshInterval = () => {
    handleRefreshTimer();
}

const restartCountUp = () => {
    countUpRef1.value.restart()
    countUpRef2.value.restart()
    countUpRef3.value.restart()
    countUpRef4.value.restart()
    countUpRef5.value.restart()
    countUpRef6.value.restart()
    countUpRef7.value.restart()
    countUpRef8.value.restart()
    countUpRef9.value.restart()
    countUpRef10.value.restart()
    countUpRef11.value.restart()
    countUpRef12.value.restart()
}


const handleRefreshTimer = () => {

    
    clearInterval(refreshTimer);
    refreshTimer = null;
    if (!state.isOpenRefresh) {
        return
    }
    refreshTimer = setInterval(() => {
        getData()
    }, refreshInterval.value)
} 



onMounted(() => {
    getData()
})
</script>

<template>
    <div>
        <a-card :body-style="{ padding: '10px' }">
            <template #title>
                <a-flex justify="space-between">
                    
                        <a-flex align="center" justify="flex-start">
                            商户总交易数据统计
                            <a-tooltip title="刷新数据">
                                <a-flex justify="center">
                                    <a-tooltip title="刷新交易数据">
                                        <a-button type="link" @click="handleRefresh" :disabled="state.dataLoading">
                                            <SyncOutlined :spin="state.dataLoading" style="font-size: 12px; font-weight: bold;" />刷新
                                        </a-button>
                                    </a-tooltip>
                                </a-flex>
                            </a-tooltip>
                        </a-flex>
                        <a-flex align="center" justify="center" style="padding-left: 50px;">
                            <a-checkbox v-model:checked="state.isOpenRefresh" @change="changeOpenRefreshStatus">开启自动刷新</a-checkbox>

                             <a-flex v-if="state.isOpenRefresh" align="center" justify="center">|&nbsp;&nbsp;每
                               <a-select v-model:value="refreshInterval" @change="changeRefreshInterval" :disabled="state.dataLoading" style="width: 80px; padding: 0 3px" size="small" :loading="state.dataLoading">
                                        
                                    <a-select-option v-for="i in refreshIntervalOpts" :key="i.value" :value="i.value">{{ i.title }}</a-select-option>
                                </a-select>刷新
                             </a-flex>
                          
                        </a-flex>
                        
                </a-flex>
            </template>
            <a-row :gutter="24">
                <a-col :span="6">
                    <a-spin :spinning="state.dataLoading" tip="更新数据中...">
                        <CommonCard :loading="false">
                            <template #title1>
                                <span style="color: #666;">总交易额</span>
                            </template>
                            <template #title2>
                                <span style="color: #666;">今日总交易额</span>
                            </template>
                            <template #title3>
                                <span style="color: #666;">昨日总交易额</span>
                            </template>
                            <template #total1>
                                <count-up ref="countUpRef1" style="color: rgb(22,119,255);" :start-val="originStatisticsData.totalAmount" :end-val="statisticsData.totalAmount" :duration=".2">
                                    <template #prefix>
                                        ¥
                                    </template>
                                    <template #suffix>
                                    
                                    </template>
                                </count-up>
                                
                            </template>
                            <template #total2>
                                <count-up ref="countUpRef2" style="color: rgb(22,119,255);" :start-val="originStatisticsData.todayAmount" :end-val="statisticsData.todayAmount" :duration=".3">
                                    <template #prefix>
                                        ¥
                                    </template>
                                    <template #suffix>
                                    
                                    </template>
                                </count-up>
                            </template>
                            <template #total3>
                                <count-up ref="countUpRef3" style="color: rgb(22,119,255);" :start-val="originStatisticsData.yesterdayAmount" :end-val="statisticsData.yesterdayAmount" :duration=".3">
                                    <template #prefix>
                                        ¥
                                    </template>
                                    <template #suffix>
                                        
                                    </template>
                                </count-up>
                            </template>
                        </CommonCard>
                    </a-spin>
                </a-col>
                <a-col :span="6">
                    <a-spin :spinning="state.dataLoading" tip="更新数据中...">
                        <CommonCard :loading="false">
                            <template #title1>
                                <span style="color: #666;">总交易笔数</span>
                            </template>
                            <template #title2>
                                <span style="color: #666;">今日交易笔数</span>
                            </template>
                            <template #title3>
                                <span style="color: #666;">昨日交易笔数</span>
                            </template>
                            <template #total1>
                                <count-up ref="countUpRef4" style="color: purple;" :start-val="originStatisticsData.totalCount" :end-val="statisticsData.totalCount" :duration=".3">
                                    <template #prefix>
                                    
                                    </template>
                                    <template #suffix>
                                    
                                    </template>
                                </count-up>
                                
                            </template>
                            <template #total2>
                                <count-up ref="countUpRef5" style="color: purple;" :start-val="originStatisticsData.todayCount" :end-val="statisticsData.todayCount" :duration=".4">
                                    <template #prefix>
                                    
                                    </template>
                                    <template #suffix>
                                    
                                    </template>
                                </count-up>
                            </template>
                            <template #total3>
                                <count-up ref="countUpRef6" style="color: purple;" :start-val="originStatisticsData.yesterdayCount" :end-val="statisticsData.yesterdayCount" :duration=".4">
                                    <template #prefix>
                                    
                                    </template>
                                    <template #suffix>
                                    
                                    </template>
                                </count-up>
                            </template>
                        </CommonCard>
                    </a-spin>
                </a-col>

                <a-col :span="6">
                    <a-spin :spinning="state.dataLoading" tip="更新数据中...">
                        <CommonCard :loading="false">
                            <template #title1>
                                <span style="color: #666;">总成交笔数</span>
                            </template>
                            <template #title2>
                                <span style="color: #666;">今日成交笔数</span>
                            </template>
                            <template #title3>
                                <span style="color: #666;">昨日成交笔数</span>
                            </template>
                            <template #total1>
                                <count-up ref="countUpRef7" style="color: rgb(51,187,176);" :start-val="originStatisticsData.totalSuccessCount" :end-val="statisticsData.totalSuccessCount" :duration=".4">
                                    <template #prefix>
                                    
                                    </template>
                                    <template #suffix>
                                    
                                    </template>
                                </count-up>
                                
                            </template>
                            <template #total2>
                                <count-up ref="countUpRef8" style="color: rgb(51,187,176);" :start-val="originStatisticsData.todaySuccessCount" :end-val="statisticsData.todaySuccessCount" :duration=".5">
                                    <template #prefix>
                                    
                                    </template>
                                    <template #suffix>
                                    
                                    </template>
                                </count-up>
                            </template>
                            <template #total3>
                                <count-up ref="countUpRef9" style="color: rgb(51,187,176);" :start-val="originStatisticsData.yesterdaySuccessCount" :end-val="statisticsData.yesterdaySuccessCount" :duration=".5">
                                    <template #prefix>
                                    
                                    </template>
                                    <template #suffix>
                                    
                                    </template>
                                </count-up>
                            </template>
                        </CommonCard>
                    </a-spin>
                </a-col>


                <a-col :span="6">
                    <a-spin :spinning="state.dataLoading" tip="更新数据中...">
                        <CommonCard :loading="false">
                            <template #title1>
                                <span style="color: #666;">总失败笔数</span>
                            </template>
                            <template #title2>
                                <span style="color: #666;">今日失败笔数</span>
                            </template>
                            <template #title3>
                                <span style="color: #666;">昨日失败笔数</span>
                            </template>
                            <template #total1>
                                <count-up ref="countUpRef10" style="color: rgb(255,77,79);" :start-val="originStatisticsData.totalFailCount" :end-val="statisticsData.totalFailCount" :duration=".5">
                                    <template #prefix>
                                    
                                    </template>
                                    <template #suffix>
                                    
                                    </template>
                                </count-up>
                                
                            </template>
                            <template #total2>
                                <count-up ref="countUpRef11" style="color: rgb(255,77,79);" :start-val="originStatisticsData.todayFailCount" :end-val="statisticsData.todayFailCount" :duration=".6">
                                    <template #prefix>
                                    
                                    </template>
                                    <template #suffix>
                                    
                                    </template>
                                </count-up>
                            </template>
                            <template #total3>
                                <count-up ref="countUpRef12" style="color: rgb(255,77,79);" :start-val="originStatisticsData.yesterdayFailCount" :end-val="statisticsData.yesterdayFailCount" :duration=".6">
                                    <template #prefix>
                                    
                                    </template>
                                    <template #suffix>
                                    
                                    </template>
                                </count-up>
                            </template>
                        </CommonCard>
                    </a-spin>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<style scoped lang="less"></style>