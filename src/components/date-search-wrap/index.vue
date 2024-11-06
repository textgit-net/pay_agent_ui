<script setup lang="ts">
import { type StyleValue } from "vue"
import { message } from "ant-design-vue";
import { DateRange } from '@/utils/constant'
import dayjs from 'dayjs'
import { Dayjs } from 'dayjs'
import { DateSearchTypeEnum, getDateSearchTypeEnumText} from '@/components/date-search-wrap/type'
import {
    CloseSquareOutlined
} from '@ant-design/icons-vue';
import useClipboard from "vue-clipboard3";
import { escapeRegExp } from "lodash";
const { toClipboard } = useClipboard();




const emit = defineEmits<{
  (e: "date-change", val: DateRange, dateType: DateSearchTypeEnum): void;
//   (e: "update:checked", item: any): void;
}>();


type RangeValue = [Dayjs, Dayjs];
let firstDefaultDateTypeIsCustom = false 

export interface PropsType {
    isCanClear?: boolean;
    defaultDateType: DateSearchTypeEnum;
    defaultRangeDate?: DateRange;
    // 马上触发change
    immediatelyDateChange: boolean;
    // 自定义的时间最大天数
    rangeDateMaxDays: number;
    // 表单重置是否触发change
    resetFormimmediatelyDateChange: boolean;
}


const props = withDefaults(defineProps<Partial<PropsType>>(), {
    isCanClear: true,
    immediatelyDateChange: false,
    rangeDateMaxDays: 180,
    defaultRangeDate: null,
    resetFormimmediatelyDateChange: true
});



export interface DateFormState {
    dateRange?: DateRange
}

const state = reactive<{
    active?: DateSearchTypeEnum
}>({
    active: null
})
const initForm = (): DateFormState => {
    return {
        dateRange: null,
    }
}
const form = ref<DateFormState>(initForm())

const rangePickerValue = ref<RangeValue>()
const RangePickerRef = ref()
console.log('rangePickerValue', rangePickerValue.value)

function getDateRange(type: DateSearchTypeEnum, isFromDatePicker: boolean = false) {
    form.value.dateRange =  {
        startDate: null,
        endDate: null
    }
    switch (type) {
        case DateSearchTypeEnum.yestoday:
            form.value.dateRange.startDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
            form.value.dateRange.endDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
            break
        case DateSearchTypeEnum.today:
            form.value.dateRange.startDate = dayjs().format('YYYY-MM-DD')
            form.value.dateRange.endDate = dayjs().format('YYYY-MM-DD')
            break
        case DateSearchTypeEnum.last7days:
            form.value.dateRange.startDate = dayjs().subtract(6, 'day').format('YYYY-MM-DD')
            form.value.dateRange.endDate = dayjs().format('YYYY-MM-DD')
            break
        case DateSearchTypeEnum.last30days:
            form.value.dateRange.startDate = dayjs().subtract(29, 'day').format('YYYY-MM-DD')
            form.value.dateRange.endDate = dayjs().format('YYYY-MM-DD')
            break
        case DateSearchTypeEnum.last90days:
            form.value.dateRange.startDate = dayjs().subtract(89, 'day').format('YYYY-MM-DD')
            form.value.dateRange.endDate = dayjs().format('YYYY-MM-DD')
            break
        case DateSearchTypeEnum.customRangeDate:
            if (rangePickerValue.value) {
                form.value.dateRange.startDate = dayjs(rangePickerValue.value[0]).format('YYYY-MM-DD')
                form.value.dateRange.endDate = dayjs(rangePickerValue.value[1]).format('YYYY-MM-DD')
            } else {
                form.value.dateRange = null
            }
            break
        default:
            form.value.dateRange = null
    }
    
    console.log('form.value', form.value)
    //选自定义时间不刷新表单
    if (type != DateSearchTypeEnum.customRangeDate) {
        emit("date-change", form.value.dateRange, state.active);
    }
    if (type == DateSearchTypeEnum.customRangeDate && isFromDatePicker && form.value.dateRange) {
        emit("date-change", form.value.dateRange, state.active);
    }
    // 第一选择的类型为自定义要加载数据
    if (type == DateSearchTypeEnum.customRangeDate && !isFromDatePicker && firstDefaultDateTypeIsCustom) {
        emit("date-change", form.value.dateRange, state.active);
    }
    // 选自定义时间刷新表单
    // emit("date-change", form.value.dateRange);
    
    
    console.log('form.value', form.value)
}

const handleTypeClick = async (type: DateSearchTypeEnum) => {
    state.active = type
    getDateRange(type)
}

const changeRangePicker = (dates:any[], dateStrings: string[]) => {
    console.log(dates, dateStrings)
    if (dates) {
        if (dayjs(dateStrings[1]).diff(dateStrings[0], 'day') > props.rangeDateMaxDays) {
            message.info(`最多可选天数为${props.rangeDateMaxDays}天，日期范围自动调整${props.rangeDateMaxDays}天的范围`, 6)
            // 超过180天 重最新的时间减少到180天
            rangePickerValue.value = [dayjs(dateStrings[1]).subtract(props.rangeDateMaxDays - 1, 'day'), dayjs(dateStrings[1])]
        }
       
    }
    getDateRange(DateSearchTypeEnum.customRangeDate, true)
}
// 选择类型为DateSearchTypeEnum.customRangeDate 自动选择最大时间
const isTypeCustomAutoSelect = () => {
    rangePickerValue.value = [dayjs().subtract(props.rangeDateMaxDays - 1, 'day'), dayjs()]
}

const disabledDate = (current: Dayjs) => {
  return  current && dayjs(current).diff(dayjs().format('YYYY-MM-DD'), 'day') > 0;
};

const handleReset = async () => {
    state.active = null;
    rangePickerValue.value = undefined
    form.value = initForm()
    getDateRange(state.active)
}

const handleFormReset = async () => {
    state.active = null;
    rangePickerValue.value = undefined
    form.value = initForm()
}

const init =  () => {
    // 不可清除跟选中
    console.log('props.isCanClear', props.isCanClear)
    if (!props.isCanClear) {
        // state.active = DateSearchTypeEnum.today
    }
    if (props.defaultDateType) {
        console.log('props.defaultDateType', props.defaultDateType)
        state.active = props.defaultDateType
        if (state.active == DateSearchTypeEnum.customRangeDate && !props.defaultRangeDate) {
            firstDefaultDateTypeIsCustom = true
            isTypeCustomAutoSelect()
        }
        if (state.active == DateSearchTypeEnum.customRangeDate && props.defaultRangeDate) {
            firstDefaultDateTypeIsCustom = true
            rangePickerValue.value = [dayjs(props.defaultRangeDate.startDate), dayjs(props.defaultRangeDate.endDate)]
        }
    }

    if (props.immediatelyDateChange) {
        
        getDateRange(state.active)
    }
}

const tranferReset = () => {
    if (props.isCanClear) {
        handleReset()
    } else {
       
        form.value = initForm()
        init()
        getDateRange(state.active)
    }
}

onMounted(() => {
    init()
})
 
defineExpose({
    handleReset,
    handleFormReset,
    tranferReset,
    dateRange: form.value.dateRange,
    dateType: state.active
});
</script>

<template>
    <a-flex gap="center" justify="start" style="flex: 1;padding-top: 20px;">
        <a-space>
            <a-tooltip>
                <template #title>筛选今日数据</template>
                <a-button @click="handleTypeClick(DateSearchTypeEnum.today)" :type="state.active == DateSearchTypeEnum.today ? 'primary' : 'dashed'">
                    {{ getDateSearchTypeEnumText(DateSearchTypeEnum.today) }}
                </a-button>
            </a-tooltip>
            <a-tooltip>
                <template #title>筛选昨日数据</template>
                <a-button @click="handleTypeClick(DateSearchTypeEnum.yestoday)" :type="state.active == DateSearchTypeEnum.yestoday ? 'primary' : 'dashed'">
                    {{ getDateSearchTypeEnumText(DateSearchTypeEnum.yestoday) }}
                </a-button>
            </a-tooltip>
            
            <a-tooltip>
                <template #title>筛选最近一周（7天）数据</template>
                <a-button @click="handleTypeClick(DateSearchTypeEnum.last7days)" :type="state.active == DateSearchTypeEnum.last7days ? 'primary' : 'dashed'">
                    {{ getDateSearchTypeEnumText(DateSearchTypeEnum.last7days) }}
                </a-button>
            </a-tooltip>
            <a-tooltip>
                <template #title>筛选最近一个月（30天）数据</template>
                <a-button @click="handleTypeClick(DateSearchTypeEnum.last30days)" :type="state.active == DateSearchTypeEnum.last30days ? 'primary' : 'dashed'">
                    {{ getDateSearchTypeEnumText(DateSearchTypeEnum.last30days) }}
                </a-button>
            </a-tooltip>
            <a-tooltip>
                <template #title>筛选最近三个月（90天）数据</template>
                <a-button @click="handleTypeClick(DateSearchTypeEnum.last90days)" :type="state.active == DateSearchTypeEnum.last90days ? 'primary' : 'dashed'">
                    {{ getDateSearchTypeEnumText(DateSearchTypeEnum.last90days) }}
                </a-button>
            </a-tooltip>
            <a-tooltip>
                <template #title>自定义查询时间范围，最多查询{{props.rangeDateMaxDays}}天,若超出范围，将从后面时间减少到{{props.rangeDateMaxDays}}天的范围</template>
                <a-button @click="handleTypeClick(DateSearchTypeEnum.customRangeDate)" :type="state.active == DateSearchTypeEnum.customRangeDate ? 'primary' : 'dashed'">
                    {{ getDateSearchTypeEnumText(DateSearchTypeEnum.customRangeDate) }}
                </a-button>
            </a-tooltip>
            
            <a-range-picker v-show="state.active == DateSearchTypeEnum.customRangeDate"  v-model:value="rangePickerValue" @change="changeRangePicker" :allowClear="props.isCanClear"  :disabled-date="disabledDate" :disabled="state.active != DateSearchTypeEnum.customRangeDate" :style="{ width: '256px' }" />
            <a-tooltip v-if="state.active && props.isCanClear">
                <template #title>重置时间筛选</template>
                <a-button @click="handleReset" type="link" style="padding: 0;">重置日期</a-button>
                <!-- <CloseSquareOutlined  style="font-size: 22px;padding-left: 5px;"/> -->
            </a-tooltip>

        </a-space>
    </a-flex>
</template>

<style lang="less" scoped>
.icon {
    cursor: pointer;
}
</style>
