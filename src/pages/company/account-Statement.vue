<script setup lang="ts">
import { ColumnsType } from "ant-design-vue/es/table";
import { PaginationProps, message } from "ant-design-vue";
import {
  seachAccountStatement,
  AccountStatementSearch,
  getAccountStatement,
  getaccountBizType,
  accountBizType,
  accountTypeSearch,
  SearchByaccountType
} from "~/api/company.ts";
import {
  DownOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons-vue";
import { Dayjs } from "dayjs";
const router = useRouter();
const columns: ColumnsType = [
  {
    title: "ID",
    dataIndex: "id",
    fixed: "left",
  },
  {
    title: "企业ID",
    dataIndex: "companyId",
    fixed: "left",
    width: "100px",
  },
  {
    title: "企业名称",
    dataIndex: "companyName",
    fixed: "left",
  },
  {
    title: "账户类型",
    dataIndex: "accountTypeText",
    fixed: "left",
    width: "100px",
  },
  {
    title: "流水单号",
    dataIndex: "accountBizNo",
    fixed: "left",
  },
  {
    title: "业务类型",
    dataIndex: "accountBizTypeText",
    fixed: "left",
    width: "100px",
  },
  {
    title: "用途",
    dataIndex: "remark",
    fixed: "left",
  },
  {
    title: "动账前",
    dataIndex: "beforeAmount",
    width: "100px",
    fixed: "left",
  },
  {
    title: "金额",
    dataIndex: "amount",
    width: "100px",
    fixed: "left",
  },
  {
    title: "动账后",
    dataIndex: "afterAmount",
    width: "100px",
    fixed: "left",
  },
  {
    title: "创建日期",
    dataIndex: "createTime",
    fixed: "left",
  },

  // {
  //   title: "操作",
  //   fixed: "right",
  //   // width:"180px",
  //   dataIndex: "action",
  // },
];
const tableRef = shallowRef();
const tableSize = useElementSize(tableRef);
const dataSource = shallowRef<getAccountStatement[]>([]);
const searchParams = reactive<AccountStatementSearch>(<AccountStatementSearch>{
  page: 1,
  limit: 10,
  total:0,
  ['dateRange.startTime']: '',
  ['dateRange.endTime']: '',
});
const pagination = reactive<PaginationProps>({
  pageSize: 10,
  pageSizeOptions: ["10", "20", "30", "40"],
  current: 1,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `总数据位：${total}`,
  onChange(current, pageSize) {
    pagination.pageSize = pageSize;
    pagination.current = current;
    loadData();
  },
});

const state = reactive<{
  tableLoad: boolean;
  isShowEditModal: boolean;
  isUpdate: boolean;
  isSaveLoading: boolean;
}>({
  tableLoad: false,
  isShowEditModal: false,
  isSaveLoading: false,
  isUpdate: false,
});

const loadData = async () => {
  if (state.tableLoad) return;
  state.tableLoad = true;
  try {
    const { data } = await seachAccountStatement({
      ...searchParams,
      page: pagination.current,
      limit: pagination.pageSize,
    });
    dataSource.value = data?.rows ?? [];
    pagination.total = data?.total ?? 0;
  } catch (e) {
    console.log(e);
  } finally {
    state.tableLoad = false;
  }
};

const doSearch = () => {
  let params={}
  params['accountType']=searchParams.accountType
  pagination.current = 1;
  loadData();
};
const resetSearch = () => {
  pagination.current = 1;
  searchParams.companyId=""
  searchParams.bizNo=""
  searchParams.bizType=""
  loadData();
};

watch(
  () => searchParams.bizType,
  (newValue, oldValue) => {
    if (newValue) {
      pagination.current = 1;
      loadData();
    }
  }
);
const handleChangeSelect = (value) => {

};
const datePicker =async (_,dateStrArr) => {
  searchParams['dateRange.startTime']=dateStrArr[0]
  searchParams['dateRange.endTime']=dateStrArr[1]
};
onMounted(() => {
  loadData();
});
</script>

<template>
  <PageContainer>
    <a-card>
      <a-flex vertical :gap="15">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="5">
            <a-input
              v-model:value="searchParams.companyId"
              placeholder="请输入企业ID查询"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-col>
          <a-col class="gutter-row" :span="5">
            <a-input
              v-model:value="searchParams.bizNo"
              placeholder="请输入流水单号查询"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-col>
          <a-col>
            <a-range-picker  @change="datePicker" >
              <template #renderExtraFooter>extra footer</template>
            </a-range-picker>
          </a-col>
          <!-- <a-col class="gutter-row" :span="5">
            <a-select
             v-model:value="searchParams.accountType" 
              style="width: 120px"
              placeholder="根据账户类型筛选"
            >
              <a-select-option :value="accountTypeSearch.balance">{{
                SearchByaccountType(accountTypeSearch.balance)
              }}</a-select-option>
              <a-select-option :value="accountTypeSearch.earnest">{{
                SearchByaccountType(accountTypeSearch.earnest)
              }}</a-select-option>
              <a-select-option :value="accountTypeSearch.commission">{{
                SearchByaccountType(accountTypeSearch.commission)
              }}</a-select-option>
            </a-select>
          </a-col> -->
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

      <!-- radio -->
      <a-row>
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
      </a-row>
    </a-card>
    <a-card :body-style="{ padding: '0px' }">
      <template #extra> </template>
      <a-table
        ref="tableRef"
        :scroll="{ x: tableSize.width.value }"
        :pagination="pagination"
        :data-source="dataSource"
        :columns="columns"
        size="middle"
        :bordered="false"
        :loading="state.tableLoad"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'amount'">
            <a-space>
              <span>{{ record.direction }}{{ record.amount }}</span>
            </a-space>
          </template>
          <!-- <template v-if="column.dataIndex === 'action'">
            <a-flex :gap="5">
              <a-button
                size="small"
                type="link"
                @click="
                  router.push({
                    path: '',
                    query: { id: record.id },
                  })
                "
                >编辑</a-button
              >
              <a-button
                size="small"
                type="link"
                target="_blank"
                >查看应用</a-button>
            </a-flex>
          </template> -->
        </template>
      </a-table>
    </a-card>
  </PageContainer>
</template>

<style scoped lang="less">
</style>