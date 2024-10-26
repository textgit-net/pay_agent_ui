<script setup lang="ts">
import CountUp from 'vue-countup-v3'
import Trend from "~/pages/dashboard/analysis/trend.vue";
import CommonCard from "~/pages/dashboard/analysis/components/common-card.vue";
import Field from "~/pages/dashboard/analysis/components/field.vue";
import { InfoCircleOutlined,  SyncOutlined} from "@ant-design/icons-vue";
import { TinyArea, TinyColumn } from "@antv/g2plot";
import { SelectOption } from '~/utils/constant'
enum RefreshIntervalEnum {
    _30s = 2 * 1000,
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


const initDataValue = () => {
    return {
        todayTotalAmount: 1,
        yestodayTotalAmount: 1,
    }
}


const originDataVal = ref(initDataValue())
const newDataVal = ref(initDataValue())



const handleRefresh = () => {
    clearInterval(refreshTimer);
    refreshTimer = null;
    getData()
}

const getData = () => {
    state.dataLoading = true;
    let timer = null;
    clearTimeout(timer)
    originDataVal.value =JSON.parse(JSON.stringify(newDataVal.value))
    timer = setTimeout(() => {
        clearTimeout(timer)
        state.dataLoading = false;
        restartCountUp();
        handleRefreshTimer();
        newDataVal.value.todayTotalAmount = 1000 * Math.random() + newDataVal.value.todayTotalAmount
        newDataVal.value.yestodayTotalAmount =  100 * Math.random() + newDataVal.value.yestodayTotalAmount
    }, 1000)
    
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
   
})
</script>

<template>
    <div>
        <a-card :body-style="{ padding: '10px' }">
            <template #title>
                <a-flex justify="space-between">
                    
                        <a-flex align="center" justify="flex-start">
                            总交易数据统计
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
                    <CommonCard title="今日总交易额" title2="昨日总交易额" title-color="rgb(22,119,255)" :loading="false">
                        <template #total>
                            <count-up ref="countUpRef1" :start-val="originDataVal.todayTotalAmount" :end-val="newDataVal.todayTotalAmount" :duration=".3">
                                <template #prefix>
                                    ¥
                                </template>
                                <template #suffix>
                                    rmb
                                </template>
                            </count-up>
                            
                        </template>
                        <template #total2>
                            <count-up ref="countUpRef2" :start-val="originDataVal.yestodayTotalAmount" :end-val="newDataVal.yestodayTotalAmount" :duration=".4">
                                <template #prefix>
                                    ¥
                                </template>
                                <template #suffix>
                                    rmb
                                </template>
                            </count-up>
                        </template>
                    </CommonCard>
                    
                </a-col>
                <a-col :span="6">


                    <CommonCard title="今日交易笔数" title2="昨日交易笔数" title-color="rgb(22,119,255)" :loading="false">
                        <template #total>
                            <count-up ref="countUpRef3" :end-val="2022" :duration=".4">
                                <template #prefix>
                                 
                                </template>
                                <template #suffix>
                                    笔
                                </template>
                            </count-up>
                        </template>
                        <template #total2>
                            <count-up ref="countUpRef4" :end-val="2022" :duration=".5">
                                <template #prefix>
                                 
                                </template>
                                <template #suffix>
                                    笔
                                </template>
                            </count-up>
                        </template>
                    </CommonCard>
                   
                </a-col>
                <a-col :span="6">

                    <CommonCard title="今日成交笔数" title2="昨日成交笔数" title-color="rgb(51,187,176)" :loading="false">
                        <template #total>
                            <count-up ref="countUpRef5" :end-val="2022" :duration=".5">
                                <template #prefix>
                                 
                                </template>
                                <template #suffix>
                                    笔
                                </template>
                            </count-up>
                        </template>
                        <template #total2>
                            <count-up ref="countUpRef6" :end-val="2022" :duration=".6">
                                <template #prefix>
                                 
                                </template>
                                <template #suffix>
                                    笔
                                </template>
                            </count-up>
                        </template>
                    </CommonCard>
                </a-col>
                <a-col :span="6">
                    <CommonCard title="今日失败笔数" title2="昨日失败笔数" title-color="rgb(255,77,79)" :loading="false">
                        <template #total>
                            <count-up ref="countUpRef7" :end-val="2022" :duration=".6">
                                <template #prefix>
                                 
                                </template>
                                <template #suffix>
                                    笔
                                </template>
                            </count-up>
                        </template>
                        <template #total2>
                            <count-up ref="countUpRef8" :end-val="2022" :duration=".7">
                                <template #prefix>
                                 
                                </template>
                                <template #suffix>
                                    笔
                                </template>
                            </count-up>
                        </template>
                    </CommonCard>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<style scoped lang="less"></style>