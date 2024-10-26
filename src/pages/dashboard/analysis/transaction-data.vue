<script setup lang="ts">

import Trend from "~/pages/dashboard/analysis/trend.vue";
import ChartCard from "~/pages/dashboard/analysis/components/chart-card.vue";
import Field from "~/pages/dashboard/analysis/components/field.vue";
import { InfoCircleOutlined,  SyncOutlined} from "@ant-design/icons-vue";
import { TinyArea, TinyColumn } from "@antv/g2plot";
import { SelectOption } from '~/utils/constant'
enum FilterDaysEnum {
    all = 0,
    today = 1,
    Nearly7Days = 2,
    Nearly30days = 3,
}
enum RefreshIntervalEnum {
    _30s = 3000,
    _60s = 6000,
    _200s = 20 * 1000,
    _300s = 30 * 1000,
}

const getFilterDaysEnumText = (type: FilterDaysEnum) => {
    switch (type) {
        case FilterDaysEnum.all:
            return '全部'
        case FilterDaysEnum.today:
            return '今日'
        case FilterDaysEnum.Nearly7Days:
            return '近7天'
        case FilterDaysEnum.Nearly30days:
            return '近30天'
    }
}

const getRefreshIntervalEnumText = (type: RefreshIntervalEnum) => {
    switch (type) {
        case RefreshIntervalEnum._30s:
            return '30秒'
        case RefreshIntervalEnum._60s:
            return '1分钟'
        case RefreshIntervalEnum._200s:
            return '2分钟'
        case RefreshIntervalEnum._300s:
            return '3分钟'
    }
}
const daysOpts:SelectOption<FilterDaysEnum>[] = [
    {
        value: FilterDaysEnum.today,
        title: getFilterDaysEnumText(FilterDaysEnum.today)
    },
    {
        value: FilterDaysEnum.Nearly7Days,
        title: getFilterDaysEnumText(FilterDaysEnum.Nearly7Days)
    },
    {
        value: FilterDaysEnum.Nearly30days,
        title: getFilterDaysEnumText(FilterDaysEnum.Nearly30days)
    }
]

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
        value: RefreshIntervalEnum._200s,
        title: getRefreshIntervalEnumText(RefreshIntervalEnum._200s)
    },
    {
        value: RefreshIntervalEnum._300s,
        title: getRefreshIntervalEnumText(RefreshIntervalEnum._300s)
    }
]


const value3 = ref<FilterDaysEnum>(FilterDaysEnum.today)
const value2 = ref<FilterDaysEnum>(FilterDaysEnum.today)
const checked = ref(false);
const refreshInterval = ref(RefreshIntervalEnum._60s)

const orderCountColumnContainer = ref()
const orderCountColumn = shallowRef()
const successCountColumnContainer = ref()
const successCountColumn = shallowRef()
const errorCountColumnContainer = ref()
const errorCountColumn = shallowRef()

const orderCountVisitData = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5, 0, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5]
const successCountVisitData = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5, 0, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5]
const errorCountVisitData = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5, 0, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5]
onMounted(() => {
    orderCountColumn.value = new TinyColumn(orderCountColumnContainer.value, {
        height: 80,
        autoFit: true,
        color: 'rgb(22,119,255)',
        data: orderCountVisitData,
    })
    orderCountColumn.value?.render()


    successCountColumn.value = new TinyArea(successCountColumnContainer.value, {
        height: 80,
        data: successCountVisitData,
        smooth: true,
        autoFit: true,
        areaStyle: {
            fill: 'l(270) 0:rgba(51,187,176,.1) 0.5:rgba(51,187,176,.3) 1:rgba(51,187,176,.5)',
        },
        line: {
            color: 'rgb(51,187,176)',
        },
    })

    successCountColumn.value?.render()


    errorCountColumn.value = new TinyArea(errorCountColumnContainer.value, {
        height: 80,
        data: errorCountVisitData,
        smooth: true,
        autoFit: true,
        areaStyle: {
            fill: 'l(270) 0:rgba(255,77,79,.1) 0.5:rgba(255,77,79,.3) 1:rgba(255,77,79,.5)',
        },
        line: {
            color: 'rgb(255,77,79)',
        },
    })
    errorCountColumn.value?.render()
})
</script>

<template>
    <div>
        <a-card :body-style="{ padding: '10px' }">
            <template #title>
                <a-flex justify="space-between">
                    
                        <a-flex align="center" justify="flex-start">
                            交易数据统计
                            <a-tooltip title="刷新数据">
                                <a-flex justify="center">
                                    <a-tooltip title="刷新交易数据">
                                        <a style="padding-left: 13px;">
                                            <SyncOutlined style="font-size: 12px; font-weight: bold;margin-right: 3px;" />刷新
                                        </a>
                                    </a-tooltip>
                                    
                                </a-flex>
                            

                            
                            </a-tooltip>
                        </a-flex>
                        <a-flex align="center" justify="center" style="padding-left: 50px;">
                            <a-checkbox v-model:checked="checked">开启自动刷新</a-checkbox>

                             <a-flex v-if="checked" align="center" justify="center">|&nbsp;&nbsp;每
                               <a-select v-model:value="refreshInterval" style="width: 80px; padding: 0 3px" size="small" :loading="false">
                                        
                                    <a-select-option v-for="i in refreshIntervalOpts" :key="i.value" :value="i.value">{{ i.title }}</a-select-option>
                                </a-select>刷新
                             </a-flex>
                          
                        </a-flex>
                        
                </a-flex>
            </template>
            <a-row :gutter="24">
                <a-col :span="6">
                    <ChartCard :bordered="false" title="总交易额" title-color="rgb(22,119,255)" :loading="false" :content-height="80">
                        <template #action>
                            <a-flex>
                                <a-tooltip title="按条件筛选交易总额">
                                    <a-select v-model:value="value2" style="width: 80px" size="small" :loading="false">
                                        
                                        <a-select-option v-for="i in daysOpts" :key="i.value" :value="i.value">{{ i.title }}</a-select-option>
                                    </a-select>
                                </a-tooltip>
                            </a-flex>
                        </template>
                        <template #total>
                            <span>{{ `¥100` }}</span>
                        </template>
                        <template #footer>
                            <Field :label="`${getFilterDaysEnumText(value2)} | 订单交易额`" value="￥12,423" value-color="rgb(22,119,255)" />
                        </template>
                        <Trend flag="down"  :style="{ marginRight: '16px' }">
                            日同比
                            <span class="trendText" :style="{color: '#52c41a'}">11%</span>
                        </Trend>
                        <Trend flag="up" :style="{ marginRight: '16px' }">
                            周同比
                            <span class="trendText" :style="{color: '#f5222d'}">12%</span>
                        </Trend>
                        <Trend flag="up" >
                            月同比
                            <span class="trendText" :style="{color: '#f5222d'}">12%</span>
                        </Trend>
                       
                    </ChartCard>
                </a-col>
                <a-col :span="6">
                    <ChartCard :bordered="false" title="总交易笔数" title-color="rgb(22,119,255)" :loading="false" :content-height="80">
                        <template #action>
                            <a-flex>
                                <a-tooltip title="按条件筛选订单成交笔数">
                                    <a-select v-model:value="value3" style="width: 80px" size="small" :loading="false">
                                        <a-select-option v-for="i in daysOpts" :key="i.value" :value="i.value">{{ i.title }}</a-select-option>
                                    </a-select>
                                </a-tooltip>
                            </a-flex>
                        </template>
                        <template #total>
                            <span>{{ `411` }}</span>
                        </template>
                        <template #footer>
                            <Field :label="`${getFilterDaysEnumText(value3)} | 订单总成交笔数`" value="1000000" value-color="rgb(22,119,255)" />
                        </template>
                        <div ref="orderCountColumnContainer" />
                    </ChartCard>
                </a-col>
                <a-col :span="6">
                    <ChartCard :bordered="false" title="总成交笔数" title-color="rgb(51,187,176)" :loading="false" :content-height="80">
                        <template #action>
                            <a-flex>
                                <a-tooltip title="按条件筛选订单交易成功笔数">
                                    <a-select v-model:value="value3" style="width: 80px" size="small" :loading="false">
                                        <a-select-option v-for="i in daysOpts" :key="i.value" :value="i.value">{{ i.title }}</a-select-option>
                                    </a-select>
                                </a-tooltip>
                            </a-flex>
                            
                        </template>
                        <template #total>
                            <span>{{ `411` }}</span>
                        </template>
                        <template #footer>
                            <Field :label="`${getFilterDaysEnumText(value3)} | 订单交易成功笔数`" value="600" value-color="rgb(51,187,176)" />
                        </template>
                        <div ref="successCountColumnContainer" />
                    </ChartCard>
                </a-col>
                <a-col :span="6">
                    <ChartCard :bordered="false" title="总失败笔数" title-color="rgb(255,77,79)" :loading="false" :content-height="80">
                        <template #action>
                            <a-flex>
                                <a-tooltip title="按条件筛选订单失败笔数">
                                    <a-select v-model:value="value3" style="width: 80px" size="small" :loading="false">
                                        <a-select-option v-for="i in daysOpts" :key="i.value" :value="i.value">{{ i.title }}</a-select-option>
                                    </a-select>
                                </a-tooltip>
                            </a-flex>
                            
                        </template>
                        <template #total>
                            <span>{{ `411` }}</span>
                        </template>
                        <template #footer>
                            <Field :label="`${getFilterDaysEnumText(value3)} | 订单失败笔数`" value="60" value-color="rgb(255,77,79)" />
                        </template>
                        <div ref="errorCountColumnContainer" />
                    </ChartCard>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<style scoped lang="less"></style>