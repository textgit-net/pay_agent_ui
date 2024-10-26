<script setup lang="ts">
import { Line } from '@antv/g2plot'
import { InfoCircleOutlined,  SyncOutlined} from "@ant-design/icons-vue";


enum FilterDaysEnum {
    nearly7Days = 1,
    nearly30days = 2,
    nearly90days = 3,
    custom = 4
}

const getFilterDaysEnumText = (type: FilterDaysEnum) => {
    switch (type) {
        case FilterDaysEnum.nearly7Days:
            return '近7天'
        case FilterDaysEnum.nearly30days:
            return '近30天'
        case FilterDaysEnum.nearly90days:
            return '近90天'
        case FilterDaysEnum.custom:
            return '自定义时间'
    }
}

const offlineChartData = [
  {
    date: '03:26',
    type: '交易金额',
    value: 36,
  },
  {
    date: '03:26',
    type: '交易笔数',
    value: 53,
  },
  {
    date: '03:56',
    type: '交易金额',
    value: 98,
  },
  {
    date: '03:56',
    type: '交易笔数',
    value: 31,
  },
  {
    date: '04:26',
    type: '交易金额',
    value: 62,
  },
  {
    date: '04:26',
    type: '交易笔数',
    value: 109,
  },
  {
    date: '04:56',
    type: '交易金额',
    value: 76,
  },
  {
    date: '04:56',
    type: '交易笔数',
    value: 11,
  },
  {
    date: '05:26',
    type: '交易金额',
    value: 39,
  },
  {
    date: '05:26',
    type: '交易笔数',
    value: 56,
  },
  {
    date: '05:56',
    type: '交易金额',
    value: 52,
  },
  {
    date: '05:56',
    type: '交易笔数',
    value: 98,
  },
  {
    date: '06:26',
    type: '交易金额',
    value: 29,
  },
  {
    date: '06:26',
    type: '交易笔数',
    value: 101,
  },
  {
    date: '06:56',
    type: '交易金额',
    value: 10,
  },
  {
    date: '06:56',
    type: '交易笔数',
    value: 13,
  },
  {
    date: '07:26',
    type: '交易金额',
    value: 29,
  },
  {
    date: '07:26',
    type: '交易笔数',
    value: 62,
  },
  {
    date: '07:56',
    type: '交易金额',
    value: 70,
  },
  {
    date: '07:56',
    type: '交易笔数',
    value: 20,
  },
  {
    date: '08:26',
    type: '交易金额',
    value: 21,
  },
  {
    date: '08:26',
    type: '交易笔数',
    value: 41,
  },
  {
    date: '08:56',
    type: '交易金额',
    value: 86,
  },
  {
    date: '08:56',
    type: '交易笔数',
    value: 104,
  },
  {
    date: '09:26',
    type: '交易金额',
    value: 91,
  },
  {
    date: '09:26',
    type: '交易笔数',
    value: 76,
  },
  {
    date: '09:56',
    type: '交易金额',
    value: 31,
  },
  {
    date: '09:56',
    type: '交易笔数',
    value: 72,
  },
  {
    date: '10:26',
    type: '交易金额',
    value: 14,
  },
  {
    date: '10:26',
    type: '交易笔数',
    value: 37,
  },
  {
    date: '10:56',
    type: '交易金额',
    value: 45,
  },
  {
    date: '10:56',
    type: '交易笔数',
    value: 106,
  },
  {
    date: '11:26',
    type: '交易金额',
    value: 31,
  },
  {
    date: '11:26',
    type: '交易笔数',
    value: 69,
  },
  {
    date: '11:56',
    type: '交易金额',
    value: 99,
  },
  {
    date: '11:56',
    type: '交易笔数',
    value: 103,
  },
  {
    date: '12:26',
    type: '交易金额',
    value: 49,
  },
  {
    date: '12:26',
    type: '交易笔数',
    value: 33,
  },
  {
    date: '12:56',
    type: '交易金额',
    value: 86,
  },
  {
    date: '12:56',
    type: '交易笔数',
    value: 23,
  },
]


const rangePickerValue = ref()
const checkDateType = ref<FilterDaysEnum>(FilterDaysEnum.nearly7Days)

const onClick = (type: FilterDaysEnum) => {
    checkDateType.value = type
}

const props = defineProps({
  offlineChartData: {
    type: Array,

  },
})

const container = ref()

onMounted(() => {
  new Line(container.value, {
    data: offlineChartData,
    padding: 'auto',
    xField: 'date',
    yField: 'value',
    xAxis: {
      tickCount: 30,
    },
    seriesField: 'type',
    legend: {
      position: 'top',
    },
    slider: {
      start: 0,
      end: 1,
    },
  }).render()
})
</script>

<template>
    <a-card :body-style="{ padding: '10px' }" :loading="false">
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
                        
                            <a-flex  align="center" justify="flex-start">
                              
                            </a-flex>
                        
                        </a-tooltip>
                    </a-flex>
                    <a-flex align="center" justify="center" style="padding-left: 50px;">
                        <div class="extra">
                            <a :class="{currentDate: FilterDaysEnum.nearly7Days == checkDateType}" @click="onClick(FilterDaysEnum.nearly7Days)">{{ getFilterDaysEnumText(FilterDaysEnum.nearly7Days) }}</a>
                            <a :class="{currentDate: FilterDaysEnum.nearly30days == checkDateType}" @click="onClick(FilterDaysEnum.nearly30days)">{{ getFilterDaysEnumText(FilterDaysEnum.nearly30days) }}</a>
                            <a :class="{currentDate: FilterDaysEnum.nearly90days == checkDateType}" @click="onClick(FilterDaysEnum.nearly90days)">{{ getFilterDaysEnumText(FilterDaysEnum.nearly90days) }}</a>
                            <a :class="{currentDate: FilterDaysEnum.custom == checkDateType}" @click="onClick(FilterDaysEnum.custom)">{{ getFilterDaysEnumText(FilterDaysEnum.custom) }}</a>
                            
                        </div>
                        <a-range-picker
                            v-if="FilterDaysEnum.custom == checkDateType"
                            :value="rangePickerValue"
                            :style="{ width: '256px' }"
                        />
                    </a-flex>
            </a-flex>
        </template>
        <div class="dataContainer" ref="container" />
    </a-card>
 
</template>

<style scoped lang="less">
    .extra {
        a {
            margin-right: 24px;
            color: var(--text-color);
            &:hover {
            color: #1890ff;
            }
            &.currentDate {
            color: #1890ff;
            }
        }
        .dataContainer {
            min-height: 200px;
        }
    }
</style>
