<script setup lang="ts">
import {ColumnsType} from "ant-design-vue/es/table";
import {PaginationProps} from "ant-design-vue";
import EditContentModal from "~/pages/mch/edit-content-modal.vue";
import {MerchantSearch, searchMerchants} from "~/api/merchant/MerchantInterface.ts";
import {PayChannelTypeSelectOption} from "~/utils/constant.ts";

const router=useRouter()
const editContentModalRef=ref(null)
const columns:ColumnsType =[
  {
    title: '订单编号',
    dataIndex: 'id',
  },
  {
    title: '商户',
    dataIndex: 'mchOrderNo',
  },
  {
    title: '商家订单号',
    dataIndex: 'mchOrderNo',
  },
  {
    title: '通知地址',
    dataIndex: 'mchOrderNo',
  },
  {
    title: '通知状态',
    dataIndex: 'orderStatus',
  },
  {
    title: '通知次数',
    dataIndex: 'mchOrderNo',
  },
  {
    title: '上次时间',
    dataIndex: 'successTime',
  },
  {
    title: '首次时间',
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
const searchParams = reactive<MerchantSearch>({
  page:1,
  limit:10
})
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

  },
})
const dataSource=shallowRef<any[]>([])



const loadData=async  ()=> {
  if (state.dataSourceLoading)
    return
  state.dataSourceLoading = true
  try {
    const { data } = await searchMerchants({
      ...searchParams,
      page: pagination.current,
      limit: pagination.pageSize,
    })
    dataSource.value = data?.rows ?? []
    pagination.total = data?.total ?? 0
  }
  finally {
    state.dataSourceLoading = false
  }
}

onMounted(()=>{
  loadData()
})
</script>

<template>
  <a-flex vertical :gap="10" style="width: 100%;height: 100%">
    <!--头部-->
    <a-card :body-style="{padding:'15px'}">
      <a-flex justify="space-between">
        <a-typography-text>订单通知列表</a-typography-text>
      </a-flex>
    </a-card>
    <a-card style="border: none" :body-style="{padding:'15px'}">
      <a-flex vertical :gap="15">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="4">
            <a-flex  :gap="10" align="center" justify="center">
              <span  style="width: 80px"  >订单号</span>
              <a-input  v-model:value="searchParams.keywords"  placeholder="请输入订单编号"> </a-input>
            </a-flex>
          </a-col>

          <a-col class="gutter-row" :span="4">
            <a-flex  :gap="10" align="center" justify="center">
              <span  style="width: 80px"  >通知状态</span>
              <a-select  style="width: 100%">
                <a-select-option :value="null">所有</a-select-option>
              </a-select>
            </a-flex>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-flex  :gap="10" align="center" justify="center">
              <span  style="width: 80px"  >订单日期</span>
              <a-range-picker style="width: 100%" />
            </a-flex>
          </a-col>
          <a-col class="gutter-row" :span="4">
            <a-flex  :gap="10" align="center" justify="center">
              <span  style="width: 80px"  >商户</span>
              <a-input placeholder="请输入商户ID"></a-input>
            </a-flex>
          </a-col>
        </a-row>

        <a-flex justify="flex-end" :gap="0">
          <a-button type="link" @click="resetSearch">重置筛选</a-button>
          <a-button
              size="middle"
              @click="doSearch"
              type="primary"
              style="width: 80px"
          >筛选</a-button
          >
        </a-flex>
      </a-flex>
    </a-card>
    <a-card >
      <a-tabs>

        <a-tab-pane key="ing">
          <template #tab>
            进行中(0)
          </template>
          <a-table ref="tableRef" :scroll="{x: 'max-content'}" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
            <template #emptyText>
              <a-empty></a-empty>
              <a-button  type="primary" @click="router.push({path:'/mch/create'})" >添加商户</a-button>
            </template>
            <template #bodyCell="{ column , record}">


              <template v-if="column.dataIndex==='isEnable'">
                <a-switch :checked-value="true" :un-checked-value="false" :checked="record['isEnable']"></a-switch>
              </template>
              <template v-if="column.dataIndex==='channelCount'">
                {{record['channelCount']|| '--' }}
              </template>
              <template v-if="column.dataIndex==='totalOrderCount'">
                {{record['totalOrderAmount']|| '--' }}
              </template>
              <template v-if="column.dataIndex==='totalOrderAmount'">
                {{record['totalOrderAmount']|| '--' }}
              </template>
              <template v-if="column.dataIndex==='action'">
                <a-flex :gap="5">
                </a-flex>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="success">
          <template #tab>
            成功(0)
          </template>
          <a-table ref="tableRef" :scroll="{x: 'max-content'}" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
            <template #emptyText>
              <a-empty></a-empty>
              <a-button  type="primary" @click="router.push({path:'/mch/create'})" >添加商户</a-button>
            </template>
            <template #bodyCell="{ column , record}">


              <template v-if="column.dataIndex==='isEnable'">
                <a-switch :checked-value="true" :un-checked-value="false" :checked="record['isEnable']"></a-switch>
              </template>
              <template v-if="column.dataIndex==='channelCount'">
                {{record['channelCount']|| '--' }}
              </template>
              <template v-if="column.dataIndex==='totalOrderCount'">
                {{record['totalOrderAmount']|| '--' }}
              </template>
              <template v-if="column.dataIndex==='totalOrderAmount'">
                {{record['totalOrderAmount']|| '--' }}
              </template>
              <template v-if="column.dataIndex==='action'">
                <a-flex :gap="5">

                </a-flex>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane key="error">
          <template #tab>
            失败(0)
          </template>
          <a-table ref="tableRef" :scroll="{x: 'max-content'}" :data-source="dataSource" :pagination="pagination" :loading="state.dataSourceLoading"  :columns="columns" size="middle" :bordered="false">
            <template #emptyText>
              <a-empty></a-empty>
              <a-button  type="primary" @click="router.push({path:'/mch/create'})" >添加商户</a-button>
            </template>
            <template #bodyCell="{ column , record}">


              <template v-if="column.dataIndex==='isEnable'">
                <a-switch :checked-value="true" :un-checked-value="false" :checked="record['isEnable']"></a-switch>
              </template>
              <template v-if="column.dataIndex==='channelCount'">
                {{record['channelCount']|| '--' }}
              </template>
              <template v-if="column.dataIndex==='totalOrderCount'">
                {{record['totalOrderAmount']|| '--' }}
              </template>
              <template v-if="column.dataIndex==='totalOrderAmount'">
                {{record['totalOrderAmount']|| '--' }}
              </template>
              <template v-if="column.dataIndex==='action'">
                <a-flex :gap="5">

                </a-flex>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>

    </a-card>
  </a-flex>
</template>

<style scoped lang="less">

</style>