<template>
    <PageContainer>
        <a-card>
            <a-flex vertical :gap="15">
                <a-row :gutter="16">
                    <a-col class="gutter-row" :span="8">
                        <!-- <RemoteSelect :is-show-placeholder-item="true" placeholder="所属应用"
                            data-source-url="/application">
                        </RemoteSelect> -->

                        <a-select placeholder="所属应用" style="width: 200px" :options="options"
                            @change="handleChange"></a-select>

                        <!-- v-model:value="value"
                            :filter-option="filterOption"
                            @focus="handleFocus"
                            @blur="handleBlur"
                            -->
                    </a-col>
                    <a-col>
                        <!-- <a-range-picker @change="datePicker" v-model="query.day">
                            <template #renderExtraFooter>extra footer</template>
                        </a-range-picker> -->
                        <a-date-picker v-model:value="searchParams.day"    />
                        
                        
                        
                    </a-col>
                </a-row>
                <a-flex justify="flex-end" :gap="0">
                    <!-- <a-button type="link" @click="resetSearch">重置筛选</a-button> -->
                    <a-button size="middle" @click="doSearch" type="primary" style="width: 80px">筛选</a-button>
                </a-flex>
            </a-flex>

            <!-- radio -->
            <!-- <a-row>
        <a-col class="gutter-row" :span="8">
          <a-radio-group
            v-model:value="searchParams.bizType"
            style="margin: 16px 0"
          >
            <a-radio-button :value="accountBizType.transfer">{{
              getaccountBizType(accountBizType.transfer)
            }}</a-radio-button>
            <a-radio-button :value="accountBizType.OnlineRecharge">{{
              getaccountBizType(accountBizType.OnlineRecharge)
            }}</a-radio-button>
            <a-radio-button :value="accountBizType.backstage">{{
              getaccountBizType(accountBizType.backstage)
            }}</a-radio-button>
            <a-radio-button :value="accountBizType.withdrawDeposit">{{
              getaccountBizType(accountBizType.withdrawDeposit)
            }}</a-radio-button>
            <a-radio-button :value="accountBizType.channelPay">{{
              getaccountBizType(accountBizType.channelPay)
            }}</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row> -->
        </a-card>

        <div class="llsd-t1" style="margin-top: 20px;font-size: 16px;font-weight: 600;color: #333 ">用户每日收益排行榜(共0条)</div>
        <a-card>

            <a-table :columns="columns" :data-source="dataSource">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'applicationName'">
                        <a-flex :gap="5">
                            <a-avatar shape="square" :src="record.applicationIcon" size="large"></a-avatar>
                            <a-flex :gap="0" vertical>
                                <a-typography-text strong>{{ record.applicationName }}</a-typography-text>
                                <a-typography-text type="secondary">{{ record.applicationId }}</a-typography-text>
                            </a-flex>
                        </a-flex>
                    </template>
                    <template v-if="column.dataIndex === 'isAgent'">
                        <div>
                            <a-tag v-if="record.isAgent" color="success">代理 </a-tag>
                            <a-tag v-else color="error">非代理</a-tag>
                        </div>
                    </template>
                    <template v-if="column.dataIndex === 'amount'">
                        <span>￥{{ record.amount }} ({{ record.exchangeAmount }})</span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </PageContainer>



</template>

<script setup lang="ts">
import { PaginationProps, SelectProps } from 'ant-design-vue';
import { getDailyIncomeRanking } from '~@/api/member';
import { ColumnsType } from "ant-design-vue/es/table";
import { getSiteList } from '~@/api/mediationSite';
import dayjs from 'dayjs';
const columns: ColumnsType = [
    {
        title: '所属应用',
        dataIndex: 'applicationName',
        width: '200px',
        fixed: 'left',
    },
    {
        title: '用户ID',
        dataIndex: 'userId'
    },
    {
        title: '用户昵称',
        dataIndex: 'nickName'
    },
    {
        title: '用户手机号',
        dataIndex: 'phone',
    },
    {
        title: '是否代理',
        dataIndex: 'isAgent',
    },
    {
        title: '今日收益',
        dataIndex: 'amount',
    },
]



// const query = ref({
//     appId: '371',
//     walletType: 1,
//     day: dayjs().format('YYYY-MM-DD')
// })

const getDay=()=>{
let year=new Date().getFullYear();
let month=new Date().getMonth()+1;
let day=new Date().getDate()
console.log(year+ '-'+month+'-'+day);
return (year+ '-'+month+'-'+day)
}


const options = ref<SelectProps['options']>()
let slicedArray = null
const adSelect = ref({
    opts: [], //获取到的数组
    siteId: ''
})

const getSite = async () => {
    const { data } = await getSiteList()
    adSelect.value.opts = data
    console.log("data", data);
    newArray()
        if (data.length) {
            searchParams.appId = data[0].applicationInfo.id.toString()
        }
}
const newArray = () => {
    let originalArray = adSelect.value.opts;
    slicedArray = originalArray.map(item => Object.assign({}, { value: item.applicationInfo.id, label: item.applicationInfo.name }));
    console.log("applicationInfo", slicedArray);
    options.value = slicedArray
}


const handleChange = (e) => {
    // 输出 id
    searchParams.appId=e
    console.log(searchParams);
    // let day=dayjs().format('YYYY-MM-DD')
    // console.log(day);
    
}


const getDailyList = async (params) => {
    const res = await getDailyIncomeRanking(params)
}

let SS= dayjs().format('YYYY-MM-DD').toString()
console.log("SS",typeof(SS));
const searchParams = reactive({
    appId:"1239",
    // ['dateRange.startTime']: '',
    // ['dateRange.endTime']: '',
    page: 1,
    limit: 10,
    walletType:1,
    day:""
    // day:getDay()
    // day: dayjs().format('YYYY-MM-DD').toString()
    
})
const dataSource = shallowRef([])
const pagination = reactive<PaginationProps>({
    pageSize: 10,
    pageSizeOptions: ['10', '20', '30', '40'],
    current: 1,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => `总数据位：${total}`,
    onChange(current, pageSize) {
        pagination.pageSize = pageSize
        pagination.current = current
        loadData()
    },
})
const state = reactive<{
    tableLoad: boolean,
    isShowEditModal: boolean,
}>({
    tableLoad: false,
    isShowEditModal: false,
})

const loadData = async () => {
    if (state.tableLoad)
        return
    state.tableLoad = true
    try {
        const { data } = await getDailyList({
            ...searchParams,
            page: pagination.current,
            limit: pagination.pageSize,
        })
        console.log(data);
        // dataSource.value = data?.rows ?? []
        // pagination.total = data?.total ?? 0
    }
    catch (e) {
        console.log(e)
    }
    finally {
        state.tableLoad = false
    }
}

const doSearch = async() => {
try {
const res= await    getDailyIncomeRanking(searchParams)
    console.log(res);
    
} catch (e) {
    
}
}

onMounted(() => {
    getDay()
    loadData()
    getSite()
});
</script>
